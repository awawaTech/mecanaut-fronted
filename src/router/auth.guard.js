import AuthService from '../features/authentication/services/auth.service';

/**
 * Guard de autenticación para proteger rutas
 */
export function requireAuth(to, from, next) {
  
  if (AuthService.isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
}

/**
 * Guard para rutas de autenticación (login, register)
 */
export function requireGuest(to, from, next) {
  
  if (AuthService.isAuthenticated()) {
    next('/');
  } else {
    next();
  }
}

/**
 * Guard para verificar si el usuario puede acceder a una ruta específica
 */
export function canAccess(to, from, next) {
  
  
  // Por ahora, solo verificamos autenticación
  // En el futuro se pueden agregar verificaciones de roles
  if (AuthService.isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
} 