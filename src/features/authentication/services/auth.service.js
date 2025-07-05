import ApiService from '../../../core/services/api.service';
import axios from 'axios';

class AuthService extends ApiService {
  constructor() {
    super();
    this.baseUrl = 'https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/v1/authentication';
    
    // Inicializar token desde localStorage si existe
    const token = localStorage.getItem('token');
    if (token) {
      this.setAuthToken(token);
    }
  }


  /**
 * Configura el token en el header Authorization para futuras peticiones.
 * @param {string} token - El token JWT a ser enviado en el header.
 */
setAuthToken(token) {
    if (token) {
      // Configurar el token en el header Authorization para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Eliminar el token del header si no se proporciona uno
      delete axios.defaults.headers.common['Authorization'];
    }
  }
  
  /**
   * Registra un nuevo usuario y empresa
   * @param {Object} registrationData - Datos de registro
   * @returns {Promise} - Promesa con la respuesta
   */
  async register(registrationData) {
    try {
      const dataToSend = {
        ruc: registrationData.ruc,
        legalName: registrationData.legalName,
        commercialName: registrationData.commercialName,
        address: registrationData.address,
        city: registrationData.city,
        country: registrationData.country,
        tenantPhone: registrationData.tenantPhone,
        tenantEmail: registrationData.tenantEmail,
        website: registrationData.website,
        subscriptionPlanId: registrationData.subscriptionPlanId,
        username: registrationData.username,
        password: registrationData.password,
        email: registrationData.email,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName
      };

      console.log('Datos enviados al backend:', dataToSend);
      
      return await this.post('/sign-up', dataToSend, { skipAuth: true });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  }

  /**
   * Inicia sesión de usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise} - Promesa con la respuesta
   */


  async login(loginData) {
    try {
      console.log('🚀 === INICIANDO LOGIN ===');
      console.log('📤 LoginData recibido:', loginData);
      
      // Verificar que los datos no estén vacíos
      if (!loginData.username || !loginData.password) {
        throw new Error('El nombre de usuario y contraseña son requeridos.');
      }
      
      const dataToSend = {
        username: loginData.username.trim(),
        password: loginData.password
      };
      
      console.log('📤 Datos a enviar al backend:', {
        username: dataToSend.username,
        password: '***' // Ocultar contraseña en logs
      });
      console.log('🌐 URL del endpoint:', this.baseUrl + '/authentication/sign-in'); 

      // Para el login, NO enviar el token de autorización
      const response = await this.post('/authentication/sign-in', dataToSend, { skipAuth: true });
      
      console.log('📥 Respuesta del backend:', response);
      
      // Guardar token si existe
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        this.setAuthToken(response.data.token);
        console.log('✅ Token guardado en localStorage y configurado en headers');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('❌ Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      
      // Mensajes de error más específicos
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas. Verifica tu nombre de usuario y contraseña.');
      } else if (error.response?.status === 404) {
        throw new Error('Servicio no disponible. Contacta al administrador.');
      } else if (error.response?.status >= 500) {
        throw new Error('Error del servidor. Intenta más tarde.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
      }
    }
  }
  

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    console.log('🔄 Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setAuthToken(null); // Limpiar token de headers
    console.log('✅ Logout completado');
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} - true si está autenticado, false en caso contrario
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log('🔍 Verificando autenticación:', isAuth ? '✅ Autenticado' : '❌ No autenticado');
    return isAuth;
  }

  /**
   * Obtiene el token almacenado
   * @returns {string|null} - El token o null si no existe
   */
  getToken() {
    const token = localStorage.getItem('token');
    console.log('🔑 Token obtenido:', token ? token.substring(0, 20) + '...' : 'null');
    return token;
  }

  /**
   * Obtiene la información del usuario almacenada
   * @returns {object|null} - La información del usuario o null si no existe
   */
  getUser() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('👤 Usuario obtenido:', user ? user.username || user.name : 'null');
    return user;
  }

  /**
   * Verifica la conectividad con el backend usando un endpoint público
   * @returns {Promise<boolean>} - true si el backend responde, false en caso contrario
   */
  async checkBackendHealth() {
    try {
      console.log('🏥 Verificando conectividad con el backend...');
      
      // Intentar hacer una petición simple al endpoint base para verificar conectividad
      const response = await fetch('https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/v1/authentication', {
        method: 'HEAD',
        mode: 'cors'
      });
      
      if (response.ok || response.status === 401) {
        // Si responde 401, significa que el servidor está funcionando pero requiere auth
        console.log('✅ Backend responde correctamente');
        return true;
      } else {
        console.log('❌ Backend no responde');
        return false;
      }
    } catch (error) {
      console.error('❌ Error de conectividad:', error.message);
      return false;
    }
  }

  /**
   * Método temporal para probar credenciales específicas
   */
  async testSpecificCredentials() {
    try {
      console.log('🧪 === PROBANDO CREDENCIALES ESPECÍFICAS ===');
      
      const testData = {
        username: 'admin_andina',
        password: 'andina2025'
      };
      
      console.log('📤 Probando credenciales:', {
        username: testData.username,
        password: '***'
      });
      
      const response = await this.post('/sign-in', testData, { skipAuth: true });
      console.log('✅ Credenciales funcionan:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Credenciales no funcionan:', error.response?.status, error.response?.data);
      throw error;
    }
  }
}

export default new AuthService();