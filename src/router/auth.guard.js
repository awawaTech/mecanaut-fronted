import AuthService from '../features/authentication/services/auth.service';

/**
 * Guard de autenticación para proteger rutas
 */
export function requireAuth(to, from, next) {
  console.log('🔒 Verificando autenticación para ruta:', to.path);
  
  if (AuthService.isAuthenticated()) {
    console.log('✅ Usuario autenticado, permitiendo acceso');
    next();
  } else {
    console.log('❌ Usuario no autenticado, redirigiendo a login');
    next('/login');
  }
}

/**
 * Guard para rutas de autenticación (login, register)
 */
export function requireGuest(to, from, next) {
  console.log('🔓 Verificando acceso a página de autenticación:', to.path);
  
  if (AuthService.isAuthenticated()) {
    console.log('✅ Usuario ya autenticado, redirigiendo a home');
    next('/');
  } else {
    console.log('✅ Usuario no autenticado, permitiendo acceso');
    next();
  }
}

/**
 * Guard para verificar si el usuario puede acceder a una ruta específica
 */
export function canAccess(to, from, next) {
  console.log('🔍 Verificando permisos para:', to.path);
  
  // Por ahora, solo verificamos autenticación
  // En el futuro se pueden agregar verificaciones de roles
  if (AuthService.isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
} 