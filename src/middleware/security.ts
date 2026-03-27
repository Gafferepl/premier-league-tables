// Security middleware for API routes and sensitive operations
// Implements CSRF protection, rate limiting, and input validation

import crypto from 'crypto';

/**
 * CSRF Token Management
 */
class CSRFProtection {
  private tokens: Map<string, number> = new Map();
  private readonly TOKEN_EXPIRY = 3600000; // 1 hour

  generateToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.tokens.set(token, Date.now());
    this.cleanupExpiredTokens();
    return token;
  }

  validateToken(token: string): boolean {
    const timestamp = this.tokens.get(token);
    if (!timestamp) return false;

    const isValid = Date.now() - timestamp < this.TOKEN_EXPIRY;
    if (isValid) {
      this.tokens.delete(token); // One-time use
    }
    return isValid;
  }

  private cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, timestamp] of this.tokens.entries()) {
      if (now - timestamp > this.TOKEN_EXPIRY) {
        this.tokens.delete(token);
      }
    }
  }
}

export const csrfProtection = new CSRFProtection();

/**
 * Rate Limiting
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 100, windowMs = 900000) { // 100 requests per 15 minutes
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New window
      const resetTime = now + this.windowMs;
      this.requests.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }

    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }

  reset(identifier: string) {
    this.requests.delete(identifier);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Input Sanitization
 */
export class InputValidator {
  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static sanitizeString(input: string, maxLength = 1000): string {
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, ''); // Remove potential HTML tags
  }

  static isValidURL(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  static sanitizePhoneNumber(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }

  static isValidUK_PhoneNumber(phone: string): boolean {
    const ukPhoneRegex = /^(\+44|0)[1-9]\d{9}$/;
    return ukPhoneRegex.test(phone.replace(/\s/g, ''));
  }
}

/**
 * Security Headers
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://www.googletagmanager.com https://cdnjs.cloudflare.com https://aistudiocdn.com https://esm.run https://esm.sh",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://www.googletagmanager.com https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

/**
 * Admin Authentication
 */
export class AdminAuth {
  private static readonly ADMIN_EMAILS = import.meta.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
  
  static isAdmin(email: string): boolean {
    return this.ADMIN_EMAILS.includes(email.toLowerCase());
  }
  
  static validateAdminSession(session: any): boolean {
    // Add session validation logic here
    return session?.isAdmin === true && this.isAdmin(session.email);
  }
  
  static generateAdminToken(email: string): string | null {
    if (!this.isAdmin(email)) {
      return null;
    }
    return crypto.randomBytes(32).toString('hex');
  }
}

/**
 * Password Security
 */
export class PasswordSecurity {
  static readonly MIN_LENGTH = 8;
  static readonly REQUIRE_UPPERCASE = true;
  static readonly REQUIRE_LOWERCASE = true;
  static readonly REQUIRE_NUMBER = true;
  static readonly REQUIRE_SPECIAL = true;

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.MIN_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_LENGTH} characters`);
    }

    if (this.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.REQUIRE_NUMBER && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
  }

  static async hashPassword(password: string): Promise<string> {
    // In production, use bcrypt or argon2
    // This is a placeholder - DO NOT USE IN PRODUCTION
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // In production, use bcrypt.compare or argon2.verify
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }
}

/**
 * SQL Injection Prevention
 */
export class SQLSanitizer {
  static sanitize(input: string): string {
    // Remove SQL keywords and dangerous characters
    return input
      .replace(/['";\\]/g, '')
      .replace(/\b(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER|CREATE)\b/gi, '');
  }

  static isValidIdentifier(identifier: string): boolean {
    // Only allow alphanumeric and underscores
    return /^[a-zA-Z0-9_]+$/.test(identifier);
  }
}

/**
 * XSS Prevention
 */
export class XSSProtection {
  static sanitizeHTML(html: string): string {
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static sanitizeURL(url: string): string {
    // Remove javascript: and data: protocols
    if (url.match(/^(javascript|data|vbscript):/i)) {
      return '';
    }
    return url;
  }
}

/**
 * Request Validation Middleware
 */
export function validateRequest(req: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate Content-Type for POST/PUT
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      errors.push('Invalid Content-Type. Expected application/json');
    }
  }

  // Validate Origin for CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://thegafferEPL.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    errors.push('Invalid origin');
  }

  return { valid: errors.length === 0, errors };
}


