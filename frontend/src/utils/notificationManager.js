import { toast } from 'react-toastify';
import { VALIDATION_MESSAGES } from './ValidationMessages';

/**
 * Manejador unificado de notificaciones
 * Centraliza todas las notificaciones de la aplicación
 */
export class NotificationManager {
  /**
   * Muestra notificación de éxito
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones adicionales
   */
  static success(message, options = {}) {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  /**
   * Muestra notificación de error
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones adicionales
   */
  static error(message, options = {}) {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  /**
   * Muestra notificación de advertencia
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones adicionales
   */
  static warning(message, options = {}) {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  /**
   * Muestra notificación informativa
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones adicionales
   */
  static info(message, options = {}) {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  /**
   * Notificaciones específicas del negocio
   */
  static business = {
    // Operaciones CRUD
    saved: (entity = 'registro') => {
      NotificationManager.success(`${entity} guardado exitosamente`);
    },
    
    updated: (entity = 'registro') => {
      NotificationManager.success(`${entity} actualizado exitosamente`);
    },
    
    deleted: (entity = 'registro') => {
      NotificationManager.success(`${entity} eliminado exitosamente`);
    },
    
    // Validaciones
    validationError: (message = 'Por favor corrija los errores del formulario') => {
      NotificationManager.error(message);
    },
    
    // Autenticación
    loginSuccess: () => {
      NotificationManager.success('Inicio de sesión exitoso');
    },
    
    logoutSuccess: () => {
      NotificationManager.success('Sesión cerrada exitosamente');
    },
    
    passwordChanged: () => {
      NotificationManager.success('Contraseña actualizada correctamente');
    },
    
    // Configuración
    configUpdated: (key) => {
      NotificationManager.success(`Configuración ${key} actualizada`);
    },
    
    sessionRefreshed: () => {
      NotificationManager.success('Sesión refrescada exitosamente');
    },
    
    sessionTerminated: () => {
      NotificationManager.success('Sesión terminada exitosamente');
    }
  };

  /**
   * Notificaciones de carga
   */
  static loading = {
    start: (message = 'Cargando...') => {
      return toast.loading(message, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false
      });
    },
    
    stop: (toastId) => {
      toast.dismiss(toastId);
    },
    
    update: (toastId, message) => {
      toast.update(toastId, {
        render: message,
        type: "info",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  /**
   * Notificaciones de confirmación
   */
  static confirm = {
    delete: (entity = 'elemento') => {
      return new Promise((resolve) => {
        toast.warning(
          `¿Está seguro de eliminar este ${entity}?`,
          {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            onClick: () => {
              resolve(true);
              toast.dismiss();
            }
          }
        );
      });
    }
  };
}

/**
 * Hook para manejo de notificaciones en componentes
 * @returns {Object} - Métodos para manejo de notificaciones
 */
export const useNotificationManager = () => {
  return {
    success: NotificationManager.success,
    error: NotificationManager.error,
    warning: NotificationManager.warning,
    info: NotificationManager.info,
    business: NotificationManager.business,
    loading: NotificationManager.loading,
    confirm: NotificationManager.confirm
  };
};

