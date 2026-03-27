// Admin configuration - secure and environment-based
// This file handles admin access securely without exposing emails in client code

interface AdminConfig {
  enabled: boolean;
  debugMode: boolean;
  maxAdmins: number;
}

// Admin configuration from environment variables
export const adminConfig: AdminConfig = {
  enabled: import.meta.env.DEV || import.meta.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true',
  debugMode: import.meta.env.DEV,
  maxAdmins: parseInt(import.meta.env.NEXT_PUBLIC_MAX_ADMINS || '5', 10)
};

// Server-side admin email check (never exposed to client)
export const isAdminEmailServer = (email: string): boolean => {
  // Only run on server-side
  if (typeof window !== 'undefined') {
    // console.warn('isAdminEmailServer should only be used server-side');
    return false;
  }
  // Use import.meta.env for consistency, though this should only run server-side
  const adminEmails = import.meta.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
};

// Client-side admin access check (uses localStorage/sessionStorage)
export const isAdminAccessClient = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check both localStorage and sessionStorage for admin access
  const hasLocalStorageAccess = localStorage.getItem('isAdminAccess') === 'true';
  const hasSessionStorageAccess = sessionStorage.getItem('isAdminAccess') === 'true';
  
  return hasLocalStorageAccess || hasSessionStorageAccess;
};

// Grant admin access (after server-side verification)
export const grantAdminAccess = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('isAdminAccess', 'true');
  sessionStorage.setItem('isAdminAccess', 'true');
  sessionStorage.setItem('adminSessionStart', Date.now().toString());
  // console.log('🔑 Admin access granted');
};

// Revoke admin access
export const revokeAdminAccess = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('isAdminAccess');
  sessionStorage.removeItem('isAdminAccess');
  sessionStorage.removeItem('adminSessionStart');
  // console.log('🔒 Admin access revoked');
};

// Development-only admin bypass (for testing)
export const devAdminBypass = (): void => {
  if (adminConfig.debugMode) {
    // console.warn('⚠️ Development admin bypass enabled - REMOVE FOR PRODUCTION');
    grantAdminAccess();
  }
};

// Validate admin session
export const validateAdminSession = (): boolean => {
  if (!adminConfig.enabled) return false;
  
  // Check if session is still valid (add timestamp check if needed)
  const sessionStart = sessionStorage.getItem('adminSessionStart');
  if (sessionStart) {
    const sessionAge = Date.now() - parseInt(sessionStart);
    const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > maxSessionAge) {
      revokeAdminAccess();
      return false;
    }
  }
  
  return isAdminAccessClient();
};

export default {
  adminConfig,
  isAdminEmailServer,
  isAdminAccessClient,
  grantAdminAccess,
  revokeAdminAccess,
  devAdminBypass,
  validateAdminSession
};


