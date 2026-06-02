# HISTORIAS DE USUARIO - SISTEMA DE CONSULTORIO DENTAL

## ÍNDICE

1. [Gestión de Autenticación](#gestión-de-autenticación)
2. [Gestión de Usuarios](#gestión-de-usuarios)
3. [Gestión de Empleados](#gestión-de-empleados)
4. [Gestión de Programación](#gestión-de-programación)
5. [Gestión de Citas](#gestión-de-citas)
6. [Gestión de Consultas](#gestión-de-consultas)
7. [Odontograma](#odontograma)
8. [Gestión de Historia Clínica](#gestión-de-historia-clínica)
9. [Gestión de Empresas](#gestión-de-empresas)
10. [Gestión de Roles y Permisos](#gestión-de-roles-y-permisos)
11. [Dashboard y Reportes](#dashboard-y-reportes)
12. [Gestión de Horarios](#gestión-de-horarios)

---

## GESTIÓN DE AUTENTICACIÓN

### HU001: Inicio de Sesión
**Como** usuario del sistema  
**Quiero** iniciar sesión con mi email y contraseña  
**Para** acceder a las funcionalidades del consultorio dental

**Criterios de Aceptación:**
- El sistema debe validar que el email y contraseña sean correctos
- Debe mostrar mensajes de error claros si las credenciales son incorrectas
- Debe redirigir al dashboard principal después del login exitoso
- Debe mantener la sesión activa durante la navegación

**Criterios de Negocio:**
- Solo usuarios activos pueden acceder al sistema
- Las contraseñas deben estar encriptadas
- Se debe registrar el intento de acceso (éxito/fallo)

**Prioridad:** Crítica  
**Estimación:** 8 horas  
**Sprint:** 1

---

### HU002: Recuperación de Contraseña
**Como** usuario del sistema  
**Quiero** recuperar mi contraseña olvidada  
**Para** poder acceder nuevamente al sistema

**Criterios de Aceptación:**
- Debe permitir ingresar el email registrado
- Debe enviar un enlace de recuperación por email
- El enlace debe tener un tiempo de expiración
- Debe permitir establecer una nueva contraseña

**Criterios de Negocio:**
- El enlace debe expirar en 24 horas
- Se debe validar que el email existe en el sistema
- Se debe registrar el intento de recuperación

**Prioridad:** Alta  
**Estimación:** 12 horas  
**Sprint:** 2

---

### HU003: Cambio de Contraseña
**Como** usuario autenticado  
**Quiero** cambiar mi contraseña actual  
**Para** mantener la seguridad de mi cuenta

**Criterios de Aceptación:**
- Debe solicitar la contraseña actual
- Debe solicitar la nueva contraseña dos veces
- Debe validar que la nueva contraseña sea diferente a la actual
- Debe mostrar confirmación del cambio exitoso

**Criterios de Negocio:**
- La nueva contraseña debe cumplir con políticas de seguridad
- Se debe registrar el cambio de contraseña
- Se debe invalidar sesiones activas en otros dispositivos

**Prioridad:** Media  
**Estimación:** 6 horas  
**Sprint:** 3

---

### HU004: Persistencia de Sesión
**Como** usuario autenticado  
**Quiero** que mi sesión se mantenga activa al refrescar la página  
**Para** no tener que volver a iniciar sesión constantemente

**Criterios de Aceptación:**
- La sesión debe mantenerse activa durante la navegación
- Debe validar el token de autenticación en cada petición
- Debe redirigir al login si el token expira
- Debe mostrar indicador de sesión activa

**Criterios de Negocio:**
- El token debe tener un tiempo de expiración configurable
- Se debe registrar la actividad del usuario
- Se debe permitir cerrar sesión manualmente

**Prioridad:** Alta  
**Estimación:** 10 horas  
**Sprint:** 1

---

## GESTIÓN DE USUARIOS

### HU005: Crear Usuario
**Como** administrador del sistema  
**Quiero** crear nuevos usuarios asociándolos a empleados existentes  
**Para** permitir el acceso al sistema a nuevos miembros del equipo

**Criterios de Aceptación:**
- Debe mostrar lista de empleados disponibles
- Debe permitir asociar un empleado a un usuario
- Debe generar credenciales temporales
- Debe enviar email con credenciales al empleado

**Criterios de Negocio:**
- Solo empleados activos pueden ser asociados
- El email debe ser único en el sistema
- Se debe asignar un rol por defecto
- Se debe registrar la creación del usuario

**Prioridad:** Alta  
**Estimación:** 16 horas  
**Sprint:** 2

---

### HU006: Editar Usuario
**Como** administrador del sistema  
**Quiero** editar información de usuarios existentes  
**Para** mantener actualizada la información del sistema

**Criterios de Aceptación:**
- Debe mostrar formulario con datos actuales
- Debe permitir cambiar email y rol
- Debe validar que el email sea único
- Debe mostrar confirmación de cambios

**Criterios de Negocio:**
- No se puede cambiar el empleado asociado
- Se debe registrar la modificación
- Se debe notificar al usuario si cambia su email

**Prioridad:** Media  
**Estimación:** 12 horas  
**Sprint:** 3

---

### HU007: Listar Usuarios
**Como** administrador del sistema  
**Quiero** listar todos los usuarios con paginación y filtros  
**Para** gestionar eficientemente las cuentas del sistema

**Criterios de Aceptación:**
- Debe mostrar lista paginada de usuarios
- Debe permitir filtrar por rol y estado
- Debe mostrar información básica de cada usuario
- Debe permitir acciones rápidas (editar, eliminar)

**Criterios de Negocio:**
- Solo usuarios con permisos de administrador pueden ver la lista
- Se debe mostrar el empleado asociado
- Se debe mostrar el último acceso
- Se debe permitir exportar la lista

**Prioridad:** Media  
**Estimación:** 14 horas  
**Sprint:** 2

---

### HU008: Eliminar Usuario
**Como** administrador del sistema  
**Quiero** eliminar usuarios del sistema  
**Para** mantener la seguridad y limpieza de datos

**Criterios de Aceptación:**
- Debe solicitar confirmación antes de eliminar
- Debe mostrar advertencia si el usuario tiene actividad reciente
- Debe permitir desactivar en lugar de eliminar
- Debe mostrar confirmación de eliminación

**Criterios de Negocio:**
- No se puede eliminar el último administrador
- Se debe mantener historial de actividad
- Se debe notificar al empleado asociado
- Se debe liberar el email para uso futuro

**Prioridad:** Baja  
**Estimación:** 8 horas  
**Sprint:** 4

---

## GESTIÓN DE EMPLEADOS

### HU009: Registrar Empleado
**Como** administrador del sistema  
**Quiero** registrar nuevos empleados con información completa  
**Para** mantener un registro actualizado del personal

**Criterios de Aceptación:**
- Debe capturar información personal (nombres, apellidos, documento)
- Debe capturar información de contacto (teléfono, email)
- Debe permitir asignar tipo de empleado y empresa
- Debe validar que el documento sea único

**Criterios de Negocio:**
- El documento de identidad debe ser único por empresa
- Se debe validar formato de email y teléfono
- Se debe generar un código de empleado automático
- Se debe registrar la fecha de contratación

**Prioridad:** Alta  
**Estimación:** 20 horas  
**Sprint:** 1

---

### HU010: Editar Empleado
**Como** administrador del sistema  
**Quiero** editar información de empleados existentes  
**Para** mantener datos actualizados

**Criterios de Aceptación:**
- Debe mostrar formulario con datos actuales
- Debe permitir modificar información personal y de contacto
- Debe permitir cambiar tipo de empleado
- Debe validar cambios antes de guardar

**Criterios de Negocio:**
- No se puede cambiar el documento de identidad
- Se debe registrar la fecha de modificación
- Se debe notificar cambios importantes al empleado
- Se debe mantener historial de cambios

**Prioridad:** Media  
**Estimación:** 16 horas  
**Sprint:** 2

---

### HU011: Listar Empleados
**Como** administrador del sistema  
**Quiero** listar empleados con filtros por empresa y otros criterios  
**Para** gestionar eficientemente el personal

**Criterios de Aceptación:**
- Debe mostrar lista paginada de empleados
- Debe permitir filtrar por empresa, tipo de empleado y estado
- Debe permitir búsqueda por nombre o documento
- Debe mostrar información relevante de cada empleado

**Criterios de Negocio:**
- Solo se muestran empleados de la empresa del usuario
- Se debe mostrar estado activo/inactivo
- Se debe mostrar fecha de contratación
- Se debe permitir exportar la lista

**Prioridad:** Media  
**Estimación:** 18 horas  
**Sprint:** 2

---

### HU012: Eliminar Empleado
**Como** administrador del sistema  
**Quiero** eliminar empleados del sistema  
**Para** mantener el registro actualizado

**Criterios de Aceptación:**
- Debe solicitar confirmación antes de eliminar
- Debe verificar que no tenga citas o consultas pendientes
- Debe permitir desactivar en lugar de eliminar
- Debe mostrar advertencias sobre dependencias

**Criterios de Negocio:**
- No se puede eliminar empleados con actividad reciente
- Se debe mantener historial de empleo
- Se debe notificar al empleado
- Se debe liberar recursos asociados

**Prioridad:** Baja  
**Estimación:** 10 horas  
**Sprint:** 4

---

## GESTIÓN DE PROGRAMACIÓN

### HU013: Crear Programación
**Como** administrador del sistema  
**Quiero** crear programaciones semanales con fechas de inicio y fin  
**Para** organizar la disponibilidad de médicos

**Criterios de Aceptación:**
- Debe permitir seleccionar fecha de inicio y fin
- Debe validar que las fechas sean coherentes
- Debe generar automáticamente los días de la semana
- Debe mostrar confirmación de creación

**Criterios de Negocio:**
- Solo se puede crear una programación activa por empresa
- Las fechas deben ser futuras
- Se debe registrar quién creó la programación
- Se debe notificar a los médicos sobre la nueva programación

**Prioridad:** Alta  
**Estimación:** 16 horas  
**Sprint:** 3

---

### HU014: Asignar Horarios a Médicos
**Como** administrador del sistema  
**Quiero** asignar horarios específicos a médicos en la programación  
**Para** definir la disponibilidad de cada profesional

**Criterios de Aceptación:**
- Debe mostrar lista de médicos disponibles
- Debe permitir seleccionar días de la semana
- Debe permitir definir horarios específicos
- Debe validar que no haya conflictos de horarios

**Criterios de Negocio:**
- Solo médicos activos pueden ser asignados
- Se debe respetar la capacidad máxima de citas por día
- Se debe notificar al médico sobre su asignación
- Se debe registrar la asignación

**Prioridad:** Alta  
**Estimación:** 24 horas  
**Sprint:** 3

---

### HU015: Visualizar Programaciones
**Como** administrador del sistema  
**Quiero** visualizar todas las programaciones existentes  
**Para** gestionar y revisar la organización del tiempo

**Criterios de Aceptación:**
- Debe mostrar lista de programaciones con fechas
- Debe mostrar estado activo/inactivo
- Debe permitir ver detalles de cada programación
- Debe permitir filtrar por estado y fechas

**Criterios de Negocio:**
- Solo se muestran programaciones de la empresa
- Se debe mostrar número de médicos asignados
- Se debe mostrar número de citas programadas
- Se debe permitir exportar la información

**Prioridad:** Media  
**Estimación:** 20 horas  
**Sprint:** 4

---

### HU016: Eliminar Programación
**Como** administrador del sistema  
**Quiero** eliminar programaciones que ya no sean necesarias  
**Para** mantener el sistema organizado

**Criterios de Aceptación:**
- Debe solicitar confirmación antes de eliminar
- Debe verificar que no tenga citas programadas
- Debe mostrar advertencias sobre dependencias
- Debe permitir desactivar en lugar de eliminar

**Criterios de Negocio:**
- No se puede eliminar programaciones activas con citas
- Se debe notificar a médicos y pacientes afectados
- Se debe mantener historial de programaciones
- Se debe liberar horarios asociados

**Prioridad:** Baja  
**Estimación:** 12 horas  
**Sprint:** 5

---

## GESTIÓN DE CITAS

### HU017: Crear Cita
**Como** recepcionista del consultorio  
**Quiero** crear citas para pacientes con médicos específicos  
**Para** organizar la atención de pacientes

**Criterios de Aceptación:**
- Debe permitir seleccionar médico disponible
- Debe permitir seleccionar fecha y hora disponible
- Debe capturar información del paciente
- Debe validar disponibilidad del horario

**Criterios de Negocio:**
- Solo se pueden crear citas en horarios disponibles
- Se debe verificar que el médico esté asignado ese día
- Se debe generar número de cita único
- Se debe enviar confirmación al paciente

**Prioridad:** Crítica  
**Estimación:** 28 horas  
**Sprint:** 1

---

### HU018: Editar Cita
**Como** recepcionista del consultorio  
**Quiero** editar información de citas existentes  
**Para** actualizar detalles cuando sea necesario

**Criterios de Aceptación:**
- Debe mostrar formulario con datos actuales
- Debe permitir cambiar médico, fecha y hora
- Debe validar nueva disponibilidad
- Debe mostrar confirmación de cambios

**Criterios de Negocio:**
- Se debe notificar al paciente sobre cambios
- Se debe registrar la modificación
- Se debe liberar el horario anterior
- Se debe verificar nueva disponibilidad

**Prioridad:** Alta  
**Estimación:** 20 horas  
**Sprint:** 2

---

### HU019: Listar Citas
**Como** recepcionista del consultorio  
**Quiero** listar todas las citas con filtros y paginación  
**Para** gestionar eficientemente la agenda

**Criterios de Aceptación:**
- Debe mostrar lista paginada de citas
- Debe permitir filtrar por médico, fecha y estado
- Debe permitir búsqueda por paciente
- Debe mostrar información relevante de cada cita

**Criterios de Negocio:**
- Solo se muestran citas de la empresa
- Se debe mostrar estado (confirmada, cancelada, completada)
- Se debe permitir acciones rápidas
- Se debe permitir exportar la agenda

**Prioridad:** Alta  
**Estimación:** 24 horas  
**Sprint:** 2

---

### HU020: Cancelar Cita
**Como** recepcionista del consultorio  
**Quiero** cancelar citas cuando sea necesario  
**Para** liberar horarios y notificar a pacientes

**Criterios de Aceptación:**
- Debe solicitar confirmación antes de cancelar
- Debe permitir especificar motivo de cancelación
- Debe liberar el horario automáticamente
- Debe notificar al paciente sobre la cancelación

**Criterios de Negocio:**
- Se debe registrar la cancelación
- Se debe liberar el horario para nuevas citas
- Se debe notificar al médico
- Se debe mantener historial de cancelaciones

**Prioridad:** Alta  
**Estimación:** 16 horas  
**Sprint:** 3

---

## GESTIÓN DE CONSULTAS

### HU021: Registrar Consulta
**Como** médico del consultorio  
**Quiero** registrar consultas médicas para pacientes  
**Para** mantener un historial completo de atención

**Criterios de Aceptación:**
- Debe permitir seleccionar paciente desde citas del día
- Debe capturar información clínica completa
- Debe permitir adjuntar odontograma
- Debe permitir definir plan de tratamiento

**Criterios de Negocio:**
- Solo se pueden registrar consultas para citas confirmadas
- Se debe generar número de consulta único
- Se debe registrar fecha y hora de atención
- Se debe notificar al paciente sobre la consulta

**Prioridad:** Crítica  
**Estimación:** 32 horas  
**Sprint:** 1

---

### HU022: Acceder Historial de Consultas
**Como** médico del consultorio  
**Quiero** acceder al historial de consultas de un paciente  
**Para** tener contexto completo para la atención

**Criterios de Aceptación:**
- Debe mostrar lista cronológica de consultas
- Debe permitir ver detalles de cada consulta
- Debe mostrar odontogramas asociados
- Debe permitir filtrar por fechas

**Criterios de Negocio:**
- Solo se muestran consultas del médico o de la empresa
- Se debe mostrar información resumida
- Se debe permitir exportar historial
- Se debe mantener confidencialidad

**Prioridad:** Alta  
**Estimación:** 20 horas  
**Sprint:** 2

---

### HU023: Editar Consulta
**Como** médico del consultorio  
**Quiero** editar información de consultas previas  
**Para** corregir o completar información cuando sea necesario

**Criterios de Aceptación:**
- Debe mostrar formulario con datos actuales
- Debe permitir modificar información clínica
- Debe permitir actualizar odontograma
- Debe registrar la modificación

**Criterios de Negocio:**
- Solo se pueden editar consultas propias
- Se debe mantener historial de cambios
- Se debe notificar sobre modificaciones importantes
- Se debe validar cambios antes de guardar

**Prioridad:** Media  
**Estimación:** 18 horas  
**Sprint:** 3

---

## ODONTOGRAMA

### HU024: Crear Odontograma
**Como** médico del consultorio  
**Quiero** crear odontogramas para pacientes mostrando dientes de adulto y niño  
**Para** registrar el estado dental completo

**Criterios de Aceptación:**
- Debe mostrar representación visual de dientes adultos y temporales
- Debe permitir seleccionar dientes individuales
- Debe mostrar números de dientes claramente
- Debe permitir guardar el odontograma

**Criterios de Negocio:**
- Debe mostrar disposición estándar (18-28, 55-25, 85-75, 48-38)
- Se debe asociar al paciente específico
- Se debe registrar fecha de creación
- Se debe mantener versiones del odontograma

**Prioridad:** Alta  
**Estimación:** 40 horas  
**Sprint:** 3

---

### HU025: Aplicar Procedimientos Dentales
**Como** médico del consultorio  
**Quiero** aplicar procedimientos dentales específicos a dientes individuales  
**Para** registrar tratamientos realizados

**Criterios de Aceptación:**
- Debe mostrar lista de procedimientos disponibles
- Debe permitir seleccionar diente específico
- Debe aplicar color o símbolo al diente
- Debe registrar el procedimiento aplicado

**Criterios de Negocio:**
- Se debe mostrar procedimientos básicos y avanzados
- Se debe registrar fecha de aplicación
- Se debe mantener historial de procedimientos
- Se debe permitir deshacer procedimientos

**Prioridad:** Alta  
**Estimación:** 36 horas  
**Sprint:** 3

---

### HU026: Seleccionar Superficies Dentales
**Como** médico del consultorio  
**Quiero** seleccionar superficies específicas de los dientes para tratamientos  
**Para** registrar tratamientos precisos

**Criterios de Aceptación:**
- Debe mostrar superficies disponibles (vestibular, mesial, oclusal, distal, lingual)
- Debe permitir seleccionar múltiples superficies
- Debe aplicar procedimientos a superficies específicas
- Debe mostrar visualmente las superficies seleccionadas

**Criterios de Negocio:**
- Solo ciertos procedimientos requieren selección de superficie
- Se debe registrar superficie específica tratada
- Se debe mantener historial por superficie
- Se debe permitir editar superficies tratadas

**Prioridad:** Media  
**Estimación:** 28 horas  
**Sprint:** 4

---

### HU027: Visualizar Historial de Procedimientos
**Como** médico del consultorio  
**Quiero** visualizar el historial de procedimientos aplicados a cada diente  
**Para** tener contexto completo del tratamiento

**Criterios de Aceptación:**
- Debe mostrar lista de procedimientos por diente
- Debe mostrar fechas de aplicación
- Debe mostrar superficies tratadas
- Debe permitir filtrar por tipo de procedimiento

**Criterios de Negocio:**
- Se debe mostrar procedimientos en orden cronológico
- Se debe permitir ver detalles de cada procedimiento
- Se debe permitir exportar historial
- Se debe mantener confidencialidad

**Prioridad:** Media  
**Estimación:** 24 horas  
**Sprint:** 4

---

## GESTIÓN DE HISTORIA CLÍNICA

### HU028: Crear Historia Clínica
**Como** médico del consultorio  
**Quiero** crear historias clínicas completas para pacientes  
**Para** mantener registro médico integral

**Criterios de Aceptación:**
- Debe capturar información personal del paciente
- Debe capturar antecedentes médicos
- Debe permitir adjuntar documentos
- Debe permitir registrar alergias y medicamentos

**Criterios de Negocio:**
- Se debe generar número de historia clínica único
- Se debe registrar fecha de creación
- Se debe mantener confidencialidad
- Se debe permitir actualizaciones

**Prioridad:** Alta  
**Estimación:** 32 horas  
**Sprint:** 2

---

### HU029: Editar Historia Clínica
**Como** médico del consultorio  
**Quiero** editar historias clínicas existentes  
**Para** mantener información actualizada

**Criterios de Aceptación:**
- Debe mostrar formulario con datos actuales
- Debe permitir modificar información médica
- Debe permitir agregar nuevos antecedentes
- Debe registrar modificaciones

**Criterios de Negocio:**
- Solo se pueden editar historias propias o de la empresa
- Se debe mantener historial de cambios
- Se debe notificar sobre modificaciones importantes
- Se debe validar cambios antes de guardar

**Prioridad:** Media  
**Estimación:** 24 horas  
**Sprint:** 3

---

### HU030: Acceder Historial Médico
**Como** médico del consultorio  
**Quiero** acceder al historial médico completo de un paciente  
**Para** tener contexto completo para la atención

**Criterios de Aceptación:**
- Debe mostrar información personal del paciente
- Debe mostrar antecedentes médicos
- Debe mostrar consultas previas
- Debe mostrar odontogramas asociados

**Criterios de Negocio:**
- Solo se muestra información del paciente específico
- Se debe mantener confidencialidad
- Se debe permitir exportar historial
- Se debe mostrar información en orden cronológico

**Prioridad:** Alta  
**Estimación:** 28 horas  
**Sprint:** 2

---

## GESTIÓN DE EMPRESAS

### HU031: Registrar Empresa
**Como** administrador del sistema  
**Quiero** registrar nuevas empresas en el sistema  
**Para** permitir la gestión multi-empresa

**Criterios de Aceptación:**
- Debe capturar información básica de la empresa
- Debe permitir configurar parámetros específicos
- Debe generar código único de empresa
- Debe permitir asignar administrador

**Criterios de Negocio:**
- El nombre de empresa debe ser único
- Se debe registrar fecha de creación
- Se debe configurar parámetros por defecto
- Se debe notificar al administrador asignado

**Prioridad:** Alta  
**Estimación:** 20 horas  
**Sprint:** 1

---

### HU032: Editar Empresa
**Como** administrador del sistema  
**Quiero** editar información de empresas existentes  
**Para** mantener datos actualizados

**Criterios de Aceptación:**
- Debe mostrar formulario con datos actuales
- Debe permitir modificar información básica
- Debe permitir cambiar configuración
- Debe validar cambios antes de guardar

**Criterios de Negocio:**
- No se puede cambiar el código de empresa
- Se debe registrar la modificación
- Se debe notificar cambios importantes
- Se debe mantener historial de cambios

**Prioridad:** Media  
**Estimación:** 16 horas  
**Sprint:** 2

---

### HU033: Listar Empresas
**Como** administrador del sistema  
**Quiero** listar todas las empresas registradas  
**Para** gestionar la configuración multi-empresa

**Criterios de Aceptación:**
- Debe mostrar lista de empresas con información básica
- Debe permitir filtrar por estado
- Debe mostrar número de empleados por empresa
- Debe permitir acciones rápidas

**Criterios de Negocio:**
- Solo administradores globales pueden ver todas las empresas
- Se debe mostrar estado activo/inactivo
- Se debe mostrar fecha de creación
- Se debe permitir exportar la lista

**Prioridad:** Baja  
**Estimación:** 12 horas  
**Sprint:** 4

---

## GESTIÓN DE ROLES Y PERMISOS

### HU034: Crear Rol
**Como** administrador del sistema  
**Quiero** crear roles con permisos específicos  
**Para** controlar el acceso a funcionalidades

**Criterios de Aceptación:**
- Debe permitir definir nombre y descripción del rol
- Debe permitir asignar permisos específicos
- Debe validar que el nombre sea único
- Debe mostrar confirmación de creación

**Criterios de Negocio:**
- Se debe registrar quién creó el rol
- Se debe permitir duplicar roles existentes
- Se debe validar permisos antes de guardar
- Se debe notificar sobre nuevos roles

**Prioridad:** Alta  
**Estimación:** 24 horas  
**Sprint:** 2

---

### HU035: Asignar Menús a Roles
**Como** administrador del sistema  
**Quiero** asignar menús específicos a cada rol  
**Para** personalizar la interfaz según el usuario

**Criterios de Aceptación:**
- Debe mostrar lista de menús disponibles
- Debe permitir seleccionar múltiples menús
- Debe mostrar vista previa de la asignación
- Debe validar la asignación antes de guardar

**Criterios de Negocio:**
- Se debe registrar la asignación
- Se debe notificar a usuarios del rol
- Se debe mantener historial de cambios
- Se debe validar dependencias entre menús

**Prioridad:** Alta  
**Estimación:** 20 horas  
**Sprint:** 2

---

### HU036: Editar Permisos de Roles
**Como** administrador del sistema  
**Quiero** editar permisos de roles existentes  
**Para** ajustar el acceso según necesidades

**Criterios de Aceptación:**
- Debe mostrar permisos actuales del rol
- Debe permitir agregar/quitar permisos
- Debe mostrar impacto de los cambios
- Debe validar cambios antes de guardar

**Criterios de Negocio:**
- Se debe registrar la modificación
- Se debe notificar a usuarios afectados
- Se debe mantener historial de cambios
- Se debe validar que no se afecten funcionalidades críticas

**Prioridad:** Media  
**Estimación:** 18 horas  
**Sprint:** 3

---

## DASHBOARD Y REPORTES

### HU037: Dashboard Administrativo
**Como** administrador del sistema  
**Quiero** visualizar estadísticas generales del consultorio  
**Para** tomar decisiones informadas

**Criterios de Aceptación:**
- Debe mostrar métricas clave (citas, consultas, ingresos)
- Debe mostrar gráficos de tendencias
- Debe permitir filtrar por períodos
- Debe mostrar alertas importantes

**Criterios de Negocio:**
- Solo se muestran datos de la empresa
- Se debe actualizar en tiempo real
- Se debe permitir exportar reportes
- Se debe mantener confidencialidad

**Prioridad:** Alta  
**Estimación:** 32 horas  
**Sprint:** 3

---

### HU038: Agenda Médica
**Como** médico del consultorio  
**Quiero** ver mi agenda de citas del día  
**Para** organizar mi trabajo diario

**Criterios de Aceptación:**
- Debe mostrar citas del día ordenadas por hora
- Debe mostrar información del paciente
- Debe permitir ver detalles de cada cita
- Debe mostrar estado de cada cita

**Criterios de Negocio:**
- Solo se muestran citas propias
- Se debe actualizar automáticamente
- Se debe permitir marcar citas como completadas
- Se debe notificar sobre citas próximas

**Prioridad:** Alta  
**Estimación:** 24 horas  
**Sprint:** 2

---

### HU039: Gestión de Citas Recepción
**Como** recepcionista del consultorio  
**Quiero** ver las citas pendientes y confirmadas  
**Para** gestionar la agenda eficientemente

**Criterios de Aceptación:**
- Debe mostrar todas las citas del día
- Debe permitir filtrar por médico y estado
- Debe permitir confirmar/cancelar citas
- Debe mostrar información del paciente

**Criterios de Negocio:**
- Solo se muestran citas de la empresa
- Se debe permitir contactar pacientes
- Se debe registrar acciones realizadas
- Se debe notificar cambios a médicos

**Prioridad:** Alta  
**Estimación:** 28 horas  
**Sprint:** 2

---

## GESTIÓN DE HORARIOS

### HU040: Configurar Horarios
**Como** administrador del sistema  
**Quiero** configurar horarios de trabajo para empleados  
**Para** definir disponibilidad del personal

**Criterios de Aceptación:**
- Debe permitir definir días de trabajo
- Debe permitir definir horarios de entrada y salida
- Debe permitir configurar descansos
- Debe validar que no haya conflictos

**Criterios de Negocio:**
- Se debe respetar leyes laborales
- Se debe registrar quién configuró el horario
- Se debe notificar al empleado
- Se debe mantener historial de cambios

**Prioridad:** Media  
**Estimación:** 24 horas  
**Sprint:** 3

---

### HU041: Editar Horarios
**Como** administrador del sistema  
**Quiero** editar horarios existentes  
**Para** ajustar disponibilidad según necesidades

**Criterios de Aceptación:**
- Debe mostrar horario actual
- Debe permitir modificar días y horarios
- Debe validar cambios antes de guardar
- Debe mostrar impacto en programación

**Criterios de Negocio:**
- Se debe verificar que no afecte citas existentes
- Se debe notificar al empleado
- Se debe registrar la modificación
- Se debe mantener historial de cambios

**Prioridad:** Media  
**Estimación:** 20 horas  
**Sprint:** 3

---

### HU042: Listar Horarios
**Como** administrador del sistema  
**Quiero** listar todos los horarios configurados  
**Para** gestionar la disponibilidad del personal

**Criterios de Aceptación:**
- Debe mostrar lista de horarios por empleado
- Debe permitir filtrar por empleado y estado
- Debe mostrar información resumida
- Debe permitir acciones rápidas

**Criterios de Negocio:**
- Solo se muestran horarios de la empresa
- Se debe mostrar estado activo/inactivo
- Se debe mostrar fecha de configuración
- Se debe permitir exportar la lista

**Prioridad:** Baja  
**Estimación:** 16 horas  
**Sprint:** 4

---

## RESUMEN DE PRIORIDADES

### **Prioridad Crítica (Sprint 1)**
- HU001: Inicio de Sesión
- HU017: Crear Cita
- HU021: Registrar Consulta
- HU031: Registrar Empresa

### **Prioridad Alta (Sprint 2)**
- HU002: Recuperación de Contraseña
- HU004: Persistencia de Sesión
- HU005: Crear Usuario
- HU009: Registrar Empleado
- HU013: Crear Programación
- HU014: Asignar Horarios a Médicos
- HU018: Editar Cita
- HU019: Listar Citas
- HU020: Cancelar Cita
- HU022: Acceder Historial de Consultas
- HU024: Crear Odontograma
- HU025: Aplicar Procedimientos Dentales
- HU028: Crear Historia Clínica
- HU030: Acceder Historial Médico
- HU034: Crear Rol
- HU035: Asignar Menús a Roles
- HU038: Agenda Médica
- HU039: Gestión de Citas Recepción

### **Prioridad Media (Sprint 3)**
- HU003: Cambio de Contraseña
- HU006: Editar Usuario
- HU007: Listar Usuarios
- HU010: Editar Empleado
- HU011: Listar Empleados
- HU015: Visualizar Programaciones
- HU023: Editar Consulta
- HU026: Seleccionar Superficies Dentales
- HU027: Visualizar Historial de Procedimientos
- HU029: Editar Historia Clínica
- HU032: Editar Empresa
- HU036: Editar Permisos de Roles
- HU037: Dashboard Administrativo
- HU040: Configurar Horarios
- HU041: Editar Horarios

### **Prioridad Baja (Sprint 4-5)**
- HU008: Eliminar Usuario
- HU012: Eliminar Empleado
- HU016: Eliminar Programación
- HU033: Listar Empresas
- HU042: Listar Horarios

---

**Total de Historias de Usuario:** 42  
**Tiempo Estimado Total:** ~1,200 horas  
**Sprints Estimados:** 5 sprints de 2 semanas cada uno 