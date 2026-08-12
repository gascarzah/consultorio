/**
 * Mensajes de validación y feedback centralizados.
 * Misma situación → mismo texto en toda la app.
 */

export const FIELD_ERROR_CLASS = "text-red-500 text-sm mt-1";

export const VALIDATION_MESSAGES = {
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
    TIPO_DOCUMENTO: "Debe seleccionar un tipo de documento",
    CELULAR: "El celular es obligatorio",
    CONTACTO: "Debe ingresar al menos un celular o teléfono",
    DIRECCION: "La dirección es obligatoria",
    ROL: "Debe seleccionar un rol",
    TIPO_EMPLEADO: "Debe seleccionar un tipo de empleado",
    EMPRESA: "Debe seleccionar una empresa",
    EMPLEADO: "Debe seleccionar un empleado",
    MEDICO: "Debe seleccionar un médico",
    CLIENTE: "Debe seleccionar un cliente",
    HORARIO: "Debe seleccionar un horario",
    DIA: "Debe seleccionar un día",
    DIAS: "Debe seleccionar al menos un día",
    FECHA_INICIAL: "La fecha inicial es obligatoria",
    FECHA_FINAL: "La fecha final es obligatoria",
    PATH: "El path es obligatorio",
    DESCRIPCION: "La descripción es obligatoria",
    DESCRIPCION_HORARIO: "La descripción del horario es obligatoria",
    CATEGORIA: "La categoría es obligatoria",
    ORDEN: "El orden es obligatorio",
    MOTIVO_CONSULTA: "El motivo de la consulta es obligatorio",
    DIAGNOSTICO: "El diagnóstico es obligatorio",
  },

  FORMAT: {
    EMAIL_INVALID: "El formato del correo electrónico no es válido",
    DNI_LENGTH: "El número de documento debe tener exactamente 8 dígitos",
    DNI_NUMBERS: "El número de documento debe contener solo números",
    DOCUMENTO_INVALIDO: "El número de documento no es válido",
    CELULAR_INVALIDO: "Ingrese un celular válido",
    PASSWORD_MIN: "La contraseña debe tener al menos 6 caracteres",
    PASSWORD_NUEVA_MIN: "La nueva contraseña debe tener al menos 6 caracteres",
    PASSWORD_ACTUAL_MIN: "La contraseña actual debe tener al menos 6 caracteres",
    ORDEN_NUMERICO: "El orden debe ser numérico",
    ORDEN_ENTERO: "El orden debe ser un número entero",
    CATEGORIA_NUMERICA: "Seleccione una categoría",
    FECHA_FINAL_POSTERIOR: "La fecha final debe ser posterior a la fecha inicial",
  },

  ERROR: {
    TITULO: "Error",
    PASSWORD_CORTO: "La contraseña es muy corta, debe tener al menos 6 caracteres",
    USUARIO_NO_EXISTE: "El usuario no existe",
    ERROR_CONEXION: "Error de conexión. Verifique su internet",
    ERROR_SERVIDOR: "Error del servidor. Intente más tarde",
    ERROR_OBTENER_DATOS: "Error al obtener los datos",
    ERROR_OBTENER_CITAS: "Error al obtener las citas",
    ERROR_OBTENER_EMPLEADOS: "Error al obtener la lista de empleados",
    ERROR_OBTENER_HORARIOS: "Error al obtener los horarios",
    ERROR_OBTENER_USUARIO: "Error al obtener datos del usuario",
    ERROR_CAMBIAR_PASSWORD: "Error al cambiar la contraseña. Verifique que la contraseña actual sea correcta",
    ERROR_ACTUALIZAR_CONFIG: "Error al actualizar la configuración",
    ERROR_REFRESCAR_SESION: "Error al refrescar la sesión",
    ERROR_TERMINAR_SESION: "Error al terminar la sesión",
    ERROR_TERMINAR_SESIONES: "Error al terminar las sesiones",
    ERROR_INICIAR_GRABACION: "Error al iniciar la grabación",
    ERROR_DETENER_GRABACION: "Error al detener la grabación",
    ERROR_REINICIAR_GRABACION: "Error al reiniciar la grabación",
    ERROR_INICIAR_DICTADO: "Error al iniciar el dictado",
    ERROR_DETENER_DICTADO: "Error al detener el dictado",
    ERROR_LIMPIAR_DICTADO: "Error al limpiar el texto",
    DICTADO_SOLO_CHROME: "Use Chrome para dictado por voz",
    SELECCIONAR_DIENTE: "Por favor seleccione un diente primero",
    SELECCIONAR_SUPERFICIE: "Por favor seleccione una superficie del diente",
    NO_SE_PUDO_GUARDAR: "No se pudo guardar",
    NO_SE_PUDO_MODIFICAR: "No se pudo modificar",
    NO_SE_PUDO_ELIMINAR: "No se pudo eliminar",
    NO_SE_PUDO_PROCESAR: "No se pudo procesar",
    NO_SE_PUDO_CARGAR: "No se pudo cargar los datos",
    NO_SE_PUDO_BUSCAR: "No se pudo buscar la historia clínica",
    EMPRESA_NO_DETERMINADA: "No se pudo determinar la empresa del usuario. Vuelva a iniciar sesión.",
    EMPRESA_USUARIO: "No se pudo obtener la empresa del usuario",
    ID_NO_ENCONTRADO: "No se pudo obtener el identificador del registro",
    ID_CITA: "No se pudo obtener el ID de la cita",
    ID_EMPLEADO: "No se pudo obtener el ID del empleado",
    ID_HORARIO: "No se pudo obtener el ID del horario",
    ID_HISTORIA_CLINICA: "No se pudo obtener el ID de la historia clínica",
    CLIENTE_LISTA: "Debe seleccionar un cliente de la lista",
    DOCUMENTO_BUSCAR: "Ingrese un número de documento para buscar",
    HISTORIA_NO_ENCONTRADA: "No se encontró historia clínica con ese documento",
    CONSULTA_DATOS_FALTANTES: "Faltan datos de la cita o del paciente. Vuelva a abrir desde la lista de consultas.",
    CONSULTA_HC_PARCIAL: "Consulta guardada, pero no se pudo actualizar la historia clínica",
  },

  PASSWORD: {
    NO_IGUAL_ACTUAL: "La nueva contraseña no puede ser igual a la actual",
    DEBEN_COINCIDIR: "Las contraseñas deben coincidir",
  },

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
    USUARIO_REGISTRADO: "Usuario registrado exitosamente",
    HISTORIA_CARGADA: "Historia clínica cargada",
    CONSULTA_REGISTRADA: "Consulta registrada",
  },

  CONFIRMATION: {
    ELIMINAR_TITULO: "¿Está seguro de eliminarlo?",
    ELIMINAR_TEXTO: "Esta acción no se puede deshacer",
    CONFIRMAR_BOTON: "Sí, eliminar",
    CANCELAR_BOTON: "Cancelar",
  },
};

export const getValidationMessage = (category, key) => {
  return VALIDATION_MESSAGES[category]?.[key] || `Mensaje no encontrado: ${category}.${key}`;
};

export const getRequiredMessage = (field) => {
  return VALIDATION_MESSAGES.REQUIRED[field] || `${field} es obligatorio`;
};

export const getFormatMessage = (field) => {
  return VALIDATION_MESSAGES.FORMAT[field] || `Formato de ${field} no válido`;
};
