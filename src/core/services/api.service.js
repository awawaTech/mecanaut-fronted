import axios from 'axios';

/**
 * Servicio base para realizar peticiones HTTP
 */
class ApiService {
  constructor(baseURL = '') {
    this.client = axios.create({
      baseURL: baseURL || 'https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/v1',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 segundos de timeout
    });

    // Interceptor para agregar el token a las peticiones
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de autenticación
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log('🔍 Interceptor de respuesta - Error:', error.response?.status, error.message);
        
        if (error.response?.status === 401) {
          console.log('❌ Error 401 - Token expirado o inválido');
          // Token expirado o inválido
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Solo redirigir si no estamos ya en login
          if (window.location.pathname !== '/authentication/sign-in') {
            console.log('🔄 Redirigiendo a login desde interceptor');
            // Usar router en lugar de window.location para evitar reinicio
            if (window.router) {
              window.router.push('/authentication/sign-in');
            } else {
              // Fallback si el router no está disponible
              window.location.href = '/authentication/sign-in';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Realiza una petición GET
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} params - Parámetros de la petición
   * @param {Object} options - Opciones adicionales (skipAuth, etc.)
   * @returns {Promise} - Promesa con la respuesta
   */
  async get(endpoint, params = {}, options = {}) {
    try {
      let config = { params };
      
      // Si se especifica skipAuth, crear una configuración sin el interceptor de autorización
      if (options.skipAuth) {
        config = {
          params,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        // Usar axios directamente sin el interceptor
        const response = await axios.get(this.client.defaults.baseURL + endpoint, config);
        return response;
      } else {
        // Usar el cliente con interceptores
        const response = await this.client.get(endpoint, { params });
        return response;
      }
    } catch (error) {
      console.error('Error en petición GET:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} data - Datos a enviar
   * @param {Object} options - Opciones adicionales (skipAuth, etc.)
   * @returns {Promise} - Promesa con la respuesta
   */
  async post(endpoint, data = {}, options = {}) {
    try {
      let config = {};
      
      // Si se especifica skipAuth, crear una configuración sin el interceptor de autorización
      if (options.skipAuth) {
        config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        // Usar axios directamente sin el interceptor
        const fullUrl = this.client.defaults.baseURL + endpoint;
        console.log('🌐 URL completa para POST:', fullUrl);
        console.log('📤 Datos enviados:', data);
        const response = await axios.post(fullUrl, data, config);
        console.log('📥 Respuesta recibida:', response.status, response.data);
        return response;
      } else {
        // Usar el cliente con interceptores
        const response = await this.client.post(endpoint, data);
        return response;
      }
    } catch (error) {
      console.error('Error en petición POST:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  /**
   * Realiza una petición PUT
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Promesa con la respuesta
   */
  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      return response;
    } catch (error) {
      console.error('Error en petición PUT:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE
   * @param {string} endpoint - Endpoint a consultar
   * @returns {Promise} - Promesa con la respuesta
   */
  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      return response;
    } catch (error) {
      console.error('Error en petición DELETE:', error);
      throw error;
    }
  }

  /**
   * Configura el token de autenticación
   * @param {string} token - Token de autenticación
   */
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Token configurado en headers:', token.substring(0, 20) + '...');
    } else {
      delete this.client.defaults.headers.common['Authorization'];
      console.log('🔑 Token removido de headers');
    }
  }

  /**
   * Inicializa el token desde localStorage si existe
   */
  initializeAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔑 Inicializando token desde localStorage');
      this.setAuthToken(token);
    }
  }
}

export default ApiService; 