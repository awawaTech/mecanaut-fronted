/**
 * Servicio para gestionar el tema de la aplicación (claro/oscuro)
 */
class ThemeService {
  constructor() {
    this.themeKey = 'app-theme';
    this.defaultTheme = 'light';
    this.listeners = [];
    this.initialize();
  }

  /**
   * Inicializa el tema basado en preferencias guardadas o del sistema
   */
  initialize() {
    // Intentar recuperar tema guardado
    const savedTheme = localStorage.getItem(this.themeKey);
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Detectar preferencia del sistema
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      
      if (prefersDarkScheme.matches) {
        this.setTheme('dark');
      } else {
        this.setTheme(this.defaultTheme);
      }
      
      // Escuchar cambios en la preferencia del sistema
      prefersDarkScheme.addEventListener('change', (e) => {
        // Solo cambiar automáticamente si no hay preferencia guardada
        if (!localStorage.getItem(this.themeKey)) {
          const newTheme = e.matches ? 'dark' : 'light';
          this.setTheme(newTheme);
        }
      });
    }
  }

  /**
   * Establece el tema actual
   * @param {string} theme - 'light' o 'dark'
   */
  setTheme(theme) {
    // Aplicar tema al documento
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Guardar preferencia
    localStorage.setItem(this.themeKey, theme);
    
    // Notificar a los listeners
    this.notifyListeners(theme);
  }

  /**
   * Obtiene el tema actual
   * @returns {string} 'light' o 'dark'
   */
  getTheme() {
    return document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
  }

  /**
   * Alterna entre los temas claro y oscuro
   * @returns {string} El nuevo tema aplicado
   */
  toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Suscribe una función para recibir notificaciones cuando cambia el tema
   * @param {Function} callback - Función a llamar cuando cambia el tema
   * @returns {Function} Función para cancelar la suscripción
   */
  subscribe(callback) {
    this.listeners.push(callback);
    
    // Notificar inmediatamente con el tema actual
    callback(this.getTheme());
    
    // Retornar función para cancelar suscripción
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notifica a todos los listeners sobre un cambio de tema
   * @param {string} theme - El tema actual
   */
  notifyListeners(theme) {
    this.listeners.forEach(listener => listener(theme));
  }
}

// Exportar una instancia única del servicio
export const themeService = new ThemeService();
