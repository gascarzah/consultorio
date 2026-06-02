/**
 * Mensajes de validación centralizados y estandarizados
 * Este archivo contiene todos los mensajes de validación del proyecto
 * para mantener consistencia y facilitar el mantenimiento
 */

export const VALIDATION_MESSAGES = {
  // Campos obligatorios
  REQUIRED: {
    NOMBRE: "El nombre es obligatorio",
    NOMBRE_EMPLEADO: "El nombre del empleado es obligatorio",
    NOMBRE_CLIENTE: "El nombre del cliente es obligatorio",
    NOMBRE_HISTORIA_CLINICA: "El nombre del paciente es obligatorio",
    APELLIDO_PATERNO: "El apellido paterno es obligatorio",
    APELLIDO_MATERNO: "El apellido materno es obligatorio",
    EMAIL: "El correo electrónico es obligatorio",
    PASSWORD: "La contraseña es obligatoria",
    PASSWORD_ACTUAL: "La contraseña actual es obligatoria",
    PASSWORD_NUEVA: "La nueva contraseña es obligatoria",
    PASSWORD_CONFIRMACION: "Debe confirmar la nueva contraseña",
    DNI: "El número de documento es obligatorio",
    DIRECCION: "La dirección es obligatoria",
    ROL: "Debe seleccionar un rol",
    TIPO_EMPLEADO: "Debe seleccionar un tipo de empleado",
    EMPRESA: "Debe seleccionar una empresa",
    MEDICO: "Debe seleccionar un médico",
    HORARIO: "Debe seleccionar un horario",
    DIA: "Debe seleccionar un día",
    FECHA_INICIAL: "La fecha inicial es obligatoria",
    FECHA_FINAL: "La fecha final es obligatoria",
    PATH: "El path es obligatorio",
    DESCRIPCION: "La descripción es obligatoria",
    DESCRIPCION_HORARIO: "La descripción del horario es obligatoria"
  },

  // Validaciones de formato
  FORMAT: {
    EMAIL_INVALID: "El formato del correo electrónico no es válido",
    DNI_LENGTH: "El número de documento debe tener exactamente 8 dígitos",
    DNI_NUMBERS: "El número de documento debe contener solo números",
    PASSWORD_MIN: "La contraseña debe tener al menos 6 caracteres",
    PASSWORD_NUEVA_MIN: "La nueva contraseña debe tener al menos 6 caracteres",
    PASSWORD_ACTUAL_MIN: "La contraseña actual debe tener al menos 6 caracteres"
  },

  // Mensajes de error específicos
  ERROR: {
    PASSWORD_CORTO: "La contraseña es muy corta, debe tener al menos 6 caracteres",
    USUARIO_NO_EXISTE: "El usuario no existe",
    ERROR_CONEXION: "Error de conexión. Verifique su internet",
    ERROR_SERVIDOR: "Error del servidor. Intente más tarde",
    ERROR_OBTENER_DATOS: "Error al obtener los datos",
    ERROR_OBTENER_CITAS: "Error al obtener las citas",
    ERROR_OBTENER_EMPLEADOS: "Error al obtener la lista de empleados",
    ERROR_OBTENER_HORARIOS: "Error al obtener los horarios",
    ERROR_CAMBIAR_PASSWORD: "Error al cambiar la contraseña. Verifique que la contraseña actual sea correcta",
    ERROR_ACTUALIZAR_CONFIG: "Error al actualizar la configuración",
    ERROR_REFRESCAR_SESION: "Error al refrescar la sesión",
    ERROR_TERMINAR_SESION: "Error al terminar la sesión",
    ERROR_TERMINAR_SESIONES: "Error al terminar las sesiones",
    ERROR_INICIAR_GRABACION: "Error al iniciar la grabación",
    ERROR_DETENER_GRABACION: "Error al detener la grabación",
    ERROR_REINICIAR_GRABACION: "Error al reiniciar la grabación",
    SELECCIONAR_DIENTE: "Por favor seleccione un diente primero",
    SELECCIONAR_SUPERFICIE: "Por favor seleccione una superficie del diente"
  },

  // Validaciones de contraseña
  PASSWORD: {
    NO_IGUAL_ACTUAL: "La nueva contraseña no puede ser igual a la actual",
    DEBEN_COINCIDIR: "Las contraseñas deben coincidir"
  },

  // Mensajes de éxito
  SUCCESS: {
    GUARDADO: "Se guardó correctamente",
    MODIFICADO: "Se modificó correctamente",
    ELIMINADO: "Se eliminó correctamente",
    CONFIGURACION_ACTUALIZADA: "Configuración actualizada",
    SESION_REFRESCADA: "Sesión refrescada exitosamente",
    SESION_TERMINADA: "Sesión terminada exitosamente",
    SESION_CERRADA: "Sesión cerrada exitosamente",
    PASSWORD_ACTUALIZADA: "Contraseña actualizada correctamente",
    ODONTOGRAMA_GUARDADO: "Odontograma guardado exitosamente",
    EXPORTANDO_PDF: "Exportando a PDF...",
    USUARIO_REGISTRADO: "Usuario registrado exitosamente"
  },

  // Mensajes de confirmación
  CONFIRMATION: {
    ELIMINAR_TITULO: "¿Está seguro de eliminarlo?",
    ELIMINAR_TEXTO: "Esta acción no se puede deshacer",
    CONFIRMAR_BOTON: "Sí, eliminar",
    CANCELAR_BOTON: "Cancelar"
  }
};

/**
 * Función helper para obtener mensajes de validación
 * @param {string} category - Categoría del mensaje (REQUIRED, FORMAT, ERROR, SUCCESS)
 * @param {string} key - Clave específica del mensaje
 * @returns {string} - Mensaje de validación
 */
export const getValidationMessage = (category, key) => {
  return VALIDATION_MESSAGES[category]?.[key] || `Mensaje no encontrado: ${category}.${key}`;
};

/**
 * Función helper para mensajes de campos obligatorios
 * @param {string} field - Nombre del campo
 * @returns {string} - Mensaje de campo obligatorio
 */
export const getRequiredMessage = (field) => {
  return VALIDATION_MESSAGES.REQUIRED[field] || `${field} es obligatorio`;
};

/**
 * Función helper para mensajes de formato
 * @param {string} field - Nombre del campo
 * @returns {string} - Mensaje de formato
 */
export const getFormatMessage = (field) => {
  return VALIDATION_MESSAGES.FORMAT[field] || `Formato de ${field} no válido`;
};
