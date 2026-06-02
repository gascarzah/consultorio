import { toast } from 'react-toastify';
import { VALIDATION_MESSAGES } from './ValidationMessages';

/**
 * Manejador unificado de errores y notificaciones
 * Centraliza el manejo de errores en toda la aplicación
 */
export class ErrorHandler {
  /**
   * Maneja errores de validación de formularios
   * @param {Object} errors - Objeto con errores por campo
   * @param {boolean} showToast - Si mostrar toast de error
   */
  static validation(errors, showToast = true) {
    const errorMessages = Object.values(errors).filter(Boolean);
    
    if (errorMessages.length > 0 && showToast) {
      // Mostrar solo el primer error para no saturar al usuario
      toast.error(errorMessages[0]);
    }
  }

  /**
   * Maneja errores de API
   * @param {Error} error - Error de la API
   * @param {string} defaultMessage - Mensaje por defecto
   */
  static api(error, defaultMessage = null) {
    let message = defaultMessage || VALIDATION_MESSAGES.ERROR.ERROR_SERVIDOR;
    
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }
    
    toast.error(message);
    console.error('API Error:', error);
  }

  /**
   * Maneja errores de negocio
   * @param {string} message - Mensaje de error
   * @param {string} type - Tipo de notificación (error, warning, info)
   */
  static business(message, type = 'error') {
    switch (type) {
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast.error(message);
    }
  }

  /**
   * Maneja errores de red/conexión
   * @param {Error} error - Error de red
   */
  static network(error) {
    const message = VALIDATION_MESSAGES.ERROR.ERROR_CONEXION;
    toast.error(message);
    console.error('Network Error:', error);
  }

  /**
   * Maneja errores de autenticación
   * @param {Error} error - Error de autenticación
   */
  static auth(error) {
    const message = VALIDATION_MESSAGES.ERROR.USUARIO_NO_EXISTE;
    toast.error(message);
    console.error('Auth Error:', error);
  }

  /**
   * Maneja errores de validación de contraseña
   * @param {string} password - Contraseña a validar
   * @returns {string|null} - Mensaje de error o null
   */
  static password(password) {
    if (!password) {
      return VALIDATION_MESSAGES.REQUIRED.PASSWORD;
    }
    if (password.length < 6) {
      return VALIDATION_MESSAGES.FORMAT.PASSWORD_MIN;
    }
    return null;
  }

  /**
   * Maneja errores de validación de email
   * @param {string} email - Email a validar
   * @returns {string|null} - Mensaje de error o null
   */
  static email(email) {
    if (!email) {
      return VALIDATION_MESSAGES.REQUIRED.EMAIL;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID;
    }
    return null;
  }

  /**
   * Maneja errores de validación de DNI
   * @param {string} dni - DNI a validar
   * @returns {string|null} - Mensaje de error o null
   */
  static dni(dni) {
    if (!dni) {
      return VALIDATION_MESSAGES.REQUIRED.DNI;
    }
    if (dni.length !== 8) {
      return VALIDATION_MESSAGES.FORMAT.DNI_LENGTH;
    }
    if (!/^[0-9]+$/.test(dni)) {
      return VALIDATION_MESSAGES.FORMAT.DNI_NUMBERS;
    }
    return null;
  }
}

/**
 * Hook para manejo de errores en componentes
 * @returns {Object} - Métodos para manejo de errores
 */
export const useErrorHandler = () => {
  return {
    handleValidationError: ErrorHandler.validation,
    handleApiError: ErrorHandler.api,
    handleBusinessError: ErrorHandler.business,
    handleNetworkError: ErrorHandler.network,
    handleAuthError: ErrorHandler.auth,
    validatePassword: ErrorHandler.password,
    validateEmail: ErrorHandler.email,
    validateDni: ErrorHandler.dni
  };
};

