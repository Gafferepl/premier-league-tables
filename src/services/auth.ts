export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'firstTeam' | 'seasonPass';
  team: string;
  username: string;
  avatar?: string;
  joinedDate: Date;
  totalPredictions: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  weeklyPoints: number;
  monthlyPoints: number;
  allTimePoints: number;
}

export interface LeaderboardEntry {
  user: User;
  rank: number;
  points: number;
  accuracy: number;
  predictions: number;
}

export interface Prediction {
  userId: string;
  fixtureId: string;
  homeScore: number;
  awayScore: number;
  timestamp: Date;
  points?: number;
  actualHomeScore?: number;
  actualAwayScore?: number;
}

class AuthService {
  private users: User[] = [];
  private predictions: Prediction[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedUsers = localStorage.getItem('gaffer_users');
    const storedPredictions = localStorage.getItem('gaffer_predictions');
    const storedCurrentUser = localStorage.getItem('gaffer_current_user');

    if (storedUsers) this.users = JSON.parse(storedUsers);
    if (storedPredictions) this.predictions = JSON.parse(storedPredictions);
    if (storedCurrentUser) this.currentUser = JSON.parse(storedCurrentUser);
  }

  private saveToStorage() {
    localStorage.setItem('gaffer_users', JSON.stringify(this.users));
    localStorage.setItem('gaffer_predictions', JSON.stringify(this.predictions));
    if (this.currentUser) {
      localStorage.setItem('gaffer_current_user', JSON.stringify(this.currentUser));
    }
  }

  register(email: string, username: string, team: string): User {
    // Check if user already exists
    if (this.users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      team,
      joinedDate: new Date(),
      totalPredictions: 0,
      accuracy: 0,
      currentStreak: 0,
      bestStreak: 0,
      weeklyPoints: 0,
      monthlyPoints: 0,
      allTimePoints: 0
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    this.saveToStorage();
    return newUser;
  }

  login(email: string): User {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    this.currentUser = user;
    this.saveToStorage();
    return user;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('gaffer_current_user');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  updatePredictionStats(userId: string, points: number, correct: boolean) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    user.totalPredictions++;
    user.allTimePoints += points;
    user.weeklyPoints += points;
    user.monthlyPoints += points;

    // Update accuracy
    const userPredictions = this.predictions.filter(p => p.userId === userId && p.points !== undefined);
    const correctPredictions = userPredictions.filter(p => p.points && p.points > 0).length;
    user.accuracy = userPredictions.length > 0 ? (correctPredictions / userPredictions.length) * 100 : 0;

    // Update streak
    if (points > 0) {
      user.currentStreak++;
      if (user.currentStreak > user.bestStreak) {
        user.bestStreak = user.currentStreak;
      }
    } else {
      user.currentStreak = 0;
    }

    this.saveToStorage();
  }

  getLeaderboard(type: 'weekly' | 'monthly' | 'allTime' = 'allTime'): LeaderboardEntry[] {
    const sortedUsers = [...this.users]
      .sort((a, b) => {
        const pointsA = type === 'weekly' ? a.weeklyPoints : type === 'monthly' ? a.monthlyPoints : a.allTimePoints;
        const pointsB = type === 'weekly' ? b.weeklyPoints : type === 'monthly' ? b.monthlyPoints : b.allTimePoints;
        return pointsB - pointsA;
      })
      .slice(0, 20);

    return sortedUsers.map((user, index) => ({
      user,
      rank: index + 1,
      points: type === 'weekly' ? user.weeklyPoints : type === 'monthly' ? user.monthlyPoints : user.allTimePoints,
      accuracy: user.accuracy,
      predictions: user.totalPredictions
    }));
  }

  getTeamLeaderboard(team: string): LeaderboardEntry[] {
    const teamUsers = this.users.filter(u => u.team === team);
    const sortedUsers = teamUsers
      .sort((a, b) => b.allTimePoints - a.allTimePoints)
      .slice(0, 10);

    return sortedUsers.map((user, index) => ({
      user,
      rank: index + 1,
      points: user.allTimePoints,
      accuracy: user.accuracy,
      predictions: user.totalPredictions
    }));
  }

  savePrediction(prediction: Omit<Prediction, 'timestamp'>) {
    const newPrediction: Prediction = {
      ...prediction,
      timestamp: new Date()
    };
    this.predictions.push(newPrediction);
    this.saveToStorage();
    return newPrediction;
  }

  getUserPredictions(userId: string): Prediction[] {
    return this.predictions.filter(p => p.userId === userId);
  }

  updatePredictionWithResult(fixtureId: string, actualHome: number, actualAway: number) {
    const fixturePredictions = this.predictions.filter(p => p.fixtureId === fixtureId);
    
    fixturePredictions.forEach(prediction => {
      prediction.actualHomeScore = actualHome;
      prediction.actualAwayScore = actualAway;
      
      // Calculate points
      if (prediction.homeScore === actualHome && prediction.awayScore === actualAway) {
        prediction.points = 3; // Exact score
      } else {
        const predResult = prediction.homeScore > prediction.awayScore ? 'H' : prediction.homeScore < prediction.awayScore ? 'A' : 'D';
        const actualResult = actualHome > actualAway ? 'H' : actualHome < actualAway ? 'A' : 'D';
        
        prediction.points = predResult === actualResult ? 1 : 0;
      }
      
      this.updatePredictionStats(prediction.userId, prediction.points, prediction.points > 0);
    });
    
    this.saveToStorage();
  }

  resetWeeklyPoints() {
    this.users.forEach(user => {
      user.weeklyPoints = 0;
    });
    this.saveToStorage();
  }

  resetMonthlyPoints() {
    this.users.forEach(user => {
      user.monthlyPoints = 0;
    });
    this.saveToStorage();
  }
}

export const authService = new AuthService();


