const fs = require('fs');

// Función para obtener la maqueta HTML visual de la pantalla para cada HU
function getComponentVisualHTML(huId) {
  const visualHTML = {
    'HU001': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:400px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Inicia Sesión</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:30%;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="ejemplo@email.com" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Password:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="password" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="••••••••" /></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Iniciar Sesión</button></td></tr>
    <tr><td colspan="2" style="padding:10px;border:1px solid #ddd;text-align:center;"><a href="#" style="color:#0ea5e9;">Olvidé mi password</a></td></tr>
  </table>
</div>
`,
    'HU002': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:400px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Recuperar Contraseña</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:30%;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="email" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="tu@email.com" /></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Enviar Enlace</button></td></tr>
  </table>
  <p style="text-align:center;color:#6b7280;font-size:14px;margin-top:15px;">Se enviará un enlace de recuperación a tu email</p>
</div>
`,
    'HU003': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:400px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Cambiar Contraseña</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:40%;"><strong>Contraseña Actual:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="password" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="••••••••" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Nueva Contraseña:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="password" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="••••••••" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Confirmar:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="password" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="••••••••" /></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Cambiar Contraseña</button></td></tr>
  </table>
</div>
`,
    'HU004': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Persistencia de Sesión</h3>
  <div style="background:#f0f9ff;padding:15px;border:1px solid #0ea5e9;border-radius:4px;margin:20px 0;">
    <p style="text-align:center;color:#0ea5e9;font-weight:bold;">Sesión activa detectada</p>
    <p style="text-align:center;color:#64748b;font-size:14px;">Usuario: juan.perez@consultorio.com</p>
    <p style="text-align:center;color:#64748b;font-size:14px;">Último acceso: 15/01/2024 08:30 AM</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Mantener sesión:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="checkbox" checked /> Recordar mis credenciales</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tiempo de sesión:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>8 horas</option><option>24 horas</option><option>7 días</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;">
      <button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin-right:10px;">Continuar Sesión</button>
      <button style="background:#ef4444;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Cerrar Sesión</button>
    </td></tr>
  </table>
</div>
`,
    'HU005': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Crear Usuario</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Empleado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar empleado</option><option>Juan Pérez - Médico</option><option>María López - Recepcionista</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="email" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="email@consultorio.com" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Rol:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar rol</option><option>Administrador</option><option>Médico</option><option>Recepcionista</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Crear Usuario</button></td></tr>
  </table>
</div>
`,
    'HU006': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Editar Usuario</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Usuario:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar usuario</option><option>juan.perez@consultorio.com</option><option>maria.lopez@consultorio.com</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="email" style="width:100%;padding:8px;border:1px solid #ccc;" value="juan.perez@consultorio.com" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Rol:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Médico</option><option>Administrador</option><option>Recepcionista</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Actualizar Usuario</button></td></tr>
  </table>
</div>
`,
    'HU007': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Lista de Usuarios</h3>
  <div style="margin-bottom:15px;display:flex;gap:10px;justify-content:center;">
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los roles</option><option>Médico</option><option>Recepcionista</option><option>Administrador</option></select>
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los estados</option><option>Activo</option><option>Inactivo</option></select>
    <input type="text" placeholder="Buscar..." style="padding:8px;border:1px solid #ccc;border-radius:4px;width:200px;" />
  </div>
  <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>ID</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Nombre</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Email</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Rol</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Estado</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Último Acceso</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:center;"><strong>Acciones</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">1</td>
        <td style="padding:10px;border:1px solid #ddd;">Dr. Juan Pérez</td>
        <td style="padding:10px;border:1px solid #ddd;">juan@clinic.com</td>
        <td style="padding:10px;border:1px solid #ddd;">Médico</td>
        <td style="padding:10px;border:1px solid #ddd;"><span style="color:#059669;font-weight:bold;">Activo</span></td>
        <td style="padding:10px;border:1px solid #ddd;">15/01/2025 09:30</td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Eliminar</button>
        </td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">2</td>
        <td style="padding:10px;border:1px solid #ddd;">María García</td>
        <td style="padding:10px;border:1px solid #ddd;">maria@clinic.com</td>
        <td style="padding:10px;border:1px solid #ddd;">Recepcionista</td>
        <td style="padding:10px;border:1px solid #ddd;"><span style="color:#059669;font-weight:bold;">Activo</span></td>
        <td style="padding:10px;border:1px solid #ddd;">15/01/2025 08:15</td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top:15px;text-align:center;">
    <button style="background:#059669;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">+ Nuevo Usuario</button>
    <button style="background:#f59e0b;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">Exportar</button>
  </div>
</div>`,
    'HU008': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#ef4444;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Eliminar Usuario</h3>
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:4px;padding:15px;margin-bottom:20px;">
    <p style="color:#dc2626;text-align:center;font-weight:bold;">¿Está seguro que desea eliminar este usuario?</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Usuario:</strong></td><td style="padding:10px;border:1px solid #ddd;">juan.perez@consultorio.com</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Empleado:</strong></td><td style="padding:10px;border:1px solid #ddd;">Juan Pérez</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Rol:</strong></td><td style="padding:10px;border:1px solid #ddd;">Médico</td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;">
      <button style="background:#ef4444;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin-right:10px;">Confirmar Eliminación</button>
      <button style="background:#6b7280;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Cancelar</button>
    </td></tr>
  </table>
</div>
`,
    'HU009': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Registrar Empleado</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Nombres:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombres completos" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Apellidos:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Apellidos completos" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Documento:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="DNI o documento" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Teléfono:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="tel" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="+51 999 999 999" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="email" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="email@ejemplo.com" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tipo:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar tipo</option><option>Médico</option><option>Recepcionista</option><option>Administrador</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Empresa:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar empresa</option><option>Consultorio Dental ABC</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Registrar Empleado</button></td></tr>
  </table>
</div>
`,
    'HU010': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Editar Empleado</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Empleado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar empleado</option><option>Juan Pérez - Médico</option><option>María López - Recepcionista</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Nombres:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="Juan Carlos" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Apellidos:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="Pérez García" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Documento:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="12345678" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Teléfono:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="tel" style="width:100%;padding:8px;border:1px solid #ccc;" value="+51 999 123 456" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="email" style="width:100%;padding:8px;border:1px solid #ccc;" value="juan.perez@consultorio.com" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tipo:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Médico</option><option>Recepcionista</option><option>Administrador</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Actualizar Empleado</button></td></tr>
  </table>
</div>
`,
    'HU011': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Lista de Empleados</h3>
  <div style="margin-bottom:15px;display:flex;gap:10px;justify-content:center;">
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los tipos</option><option>Médico</option><option>Recepcionista</option><option>Administrador</option></select>
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los estados</option><option>Activo</option><option>Inactivo</option></select>
    <input type="text" placeholder="Buscar por nombre..." style="padding:8px;border:1px solid #ccc;border-radius:4px;width:200px;" />
  </div>
  <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>ID</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Nombre</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Documento</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Tipo</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Teléfono</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Estado</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:center;"><strong>Acciones</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">1</td>
        <td style="padding:10px;border:1px solid #ddd;">Dr. Juan Pérez</td>
        <td style="padding:10px;border:1px solid #ddd;">12345678</td>
        <td style="padding:10px;border:1px solid #ddd;">Médico</td>
        <td style="padding:10px;border:1px solid #ddd;">+57 300 123 4567</td>
        <td style="padding:10px;border:1px solid #ddd;"><span style="color:#059669;font-weight:bold;">Activo</span></td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Eliminar</button>
        </td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">2</td>
        <td style="padding:10px;border:1px solid #ddd;">María García</td>
        <td style="padding:10px;border:1px solid #ddd;">87654321</td>
        <td style="padding:10px;border:1px solid #ddd;">Recepcionista</td>
        <td style="padding:10px;border:1px solid #ddd;">+57 300 987 6543</td>
        <td style="padding:10px;border:1px solid #ddd;"><span style="color:#059669;font-weight:bold;">Activo</span></td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top:15px;text-align:center;">
    <button style="background:#059669;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">+ Nuevo Empleado</button>
    <button style="background:#f59e0b;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">Exportar</button>
  </div>
</div>`,
    'HU012': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#ef4444;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Eliminar Empleado</h3>
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:4px;padding:15px;margin-bottom:20px;">
    <p style="color:#dc2626;text-align:center;font-weight:bold;">¿Está seguro que desea eliminar este empleado?</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Empleado:</strong></td><td style="padding:10px;border:1px solid #ddd;">Juan Carlos Pérez García</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Documento:</strong></td><td style="padding:10px;border:1px solid #ddd;">12345678</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tipo:</strong></td><td style="padding:10px;border:1px solid #ddd;">Médico</td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;">
      <button style="background:#ef4444;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin-right:10px;">Confirmar Eliminación</button>
      <button style="background:#6b7280;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Cancelar</button>
    </td></tr>
  </table>
</div>
`,
    'HU013': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Crear Programación</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar médico</option><option>Dr. García</option><option>Dr. Rodríguez</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha Inicio:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha Fin:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Horario:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar horario</option><option>Mañana (8:00-12:00)</option><option>Tarde (14:00-18:00)</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Crear Programación</button></td></tr>
  </table>
</div>
`,
    'HU014': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:700px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Asignar Horarios a Médicos</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar médico</option><option>Dr. Juan Pérez</option><option>Dr. Carlos Rodríguez</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Horario:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar horario</option><option>Mañana (8:00-12:00)</option><option>Tarde (14:00-18:00)</option><option>Noche (18:00-22:00)</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Días:</strong></td><td style="padding:10px;border:1px solid #ddd;">
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Lunes</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Martes</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Miércoles</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Jueves</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Viernes</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" /> Sábado</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" /> Domingo</label>
      </div>
    </td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Asignar Horario</button></td></tr>
  </table>
</div>
`,
    'HU015': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:900px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Visualizar Programaciones</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr style="background:#0ea5e9;color:white;">
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">ID</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Médico</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Horario</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Días</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Fecha Inicio</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Fecha Fin</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Estado</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Acciones</th>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">1</td>
      <td style="padding:10px;border:1px solid #ddd;">Dr. Juan Pérez</td>
      <td style="padding:10px;border:1px solid #ddd;">Mañana (8:00-12:00)</td>
      <td style="padding:10px;border:1px solid #ddd;">Lun-Vie</td>
      <td style="padding:10px;border:1px solid #ddd;">01/01/2024</td>
      <td style="padding:10px;border:1px solid #ddd;">31/12/2024</td>
      <td style="padding:10px;border:1px solid #ddd;"><span style="background:#10b981;color:white;padding:4px 8px;border-radius:4px;font-size:12px;">Activo</span></td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">
        <button style="background:#f59e0b;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Editar</button>
        <button style="background:#ef4444;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Eliminar</button>
      </td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">2</td>
      <td style="padding:10px;border:1px solid #ddd;">Dr. Carlos Rodríguez</td>
      <td style="padding:10px;border:1px solid #ddd;">Tarde (14:00-18:00)</td>
      <td style="padding:10px;border:1px solid #ddd;">Lun-Vie</td>
      <td style="padding:10px;border:1px solid #ddd;">01/01/2024</td>
      <td style="padding:10px;border:1px solid #ddd;">31/12/2024</td>
      <td style="padding:10px;border:1px solid #ddd;"><span style="background:#10b981;color:white;padding:4px 8px;border-radius:4px;font-size:12px;">Activo</span></td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">
        <button style="background:#f59e0b;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Editar</button>
        <button style="background:#ef4444;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Eliminar</button>
      </td>
    </tr>
  </table>
</div>
`,
    'HU016': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#ef4444;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Eliminar Programación</h3>
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:4px;padding:15px;margin-bottom:20px;">
    <p style="color:#dc2626;text-align:center;font-weight:bold;">¿Está seguro que desea eliminar esta programación?</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;">Dr. Juan Pérez</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Horario:</strong></td><td style="padding:10px;border:1px solid #ddd;">Mañana (8:00-12:00)</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Días:</strong></td><td style="padding:10px;border:1px solid #ddd;">Lunes a Viernes</td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;">
      <button style="background:#ef4444;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin-right:10px;">Confirmar Eliminación</button>
      <button style="background:#6b7280;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Cancelar</button>
    </td></tr>
  </table>
</div>
`,
    'HU017': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Crear Nueva Cita</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:30%;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombre del paciente" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar médico</option><option>Dr. García</option><option>Dr. Rodríguez</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Hora:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar hora</option><option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tipo de Cita:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar tipo</option><option>Consulta</option><option>Limpieza</option><option>Extracción</option><option>Ortodoncia</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Observaciones:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Observaciones adicionales..."></textarea></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:12px 30px;border:none;border-radius:4px;font-weight:bold;font-size:16px;">Crear Cita</button></td></tr>
  </table>
</div>
`,
    'HU018': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Editar Cita</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Cita:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar cita</option><option>Cita #001 - Juan Pérez</option><option>Cita #002 - María López</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="Juan Pérez" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Dr. García</option><option>Dr. Rodríguez</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" value="2024-01-15" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Hora:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tipo de Cita:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Consulta</option><option>Limpieza</option><option>Extracción</option><option>Ortodoncia</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Programada</option><option>Confirmada</option><option>Cancelada</option><option>Completada</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Actualizar Cita</button></td></tr>
  </table>
</div>
`,
    'HU019': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Lista de Citas</h3>
  <div style="margin-bottom:15px;display:flex;gap:10px;justify-content:center;">
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los estados</option><option>Confirmada</option><option>Pendiente</option><option>Cancelada</option></select>
    <input type="date" style="padding:8px;border:1px solid #ccc;border-radius:4px;" />
    <input type="text" placeholder="Buscar paciente..." style="padding:8px;border:1px solid #ccc;border-radius:4px;width:200px;" />
  </div>
  <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>ID</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Paciente</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Médico</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Fecha</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Hora</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Estado</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:center;"><strong>Acciones</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">1</td>
        <td style="padding:10px;border:1px solid #ddd;">Carlos López</td>
        <td style="padding:10px;border:1px solid #ddd;">Dr. Juan Pérez</td>
        <td style="padding:10px;border:1px solid #ddd;">15/01/2025</td>
        <td style="padding:10px;border:1px solid #ddd;">09:00 AM</td>
        <td style="padding:10px;border:1px solid #ddd;"><span style="color:#059669;font-weight:bold;">Confirmada</span></td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Cancelar</button>
        </td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">2</td>
        <td style="padding:10px;border:1px solid #ddd;">Ana Rodríguez</td>
        <td style="padding:10px;border:1px solid #ddd;">Dra. María García</td>
        <td style="padding:10px;border:1px solid #ddd;">15/01/2025</td>
        <td style="padding:10px;border:1px solid #ddd;">10:30 AM</td>
        <td style="padding:10px;border:1px solid #ddd;"><span style="color:#f59e0b;font-weight:bold;">Pendiente</span></td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Cancelar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top:15px;text-align:center;">
    <button style="background:#059669;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">+ Nueva Cita</button>
    <button style="background:#f59e0b;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">Exportar</button>
  </div>
</div>`,
    'HU020': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#ef4444;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Cancelar Cita</h3>
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:4px;padding:15px;margin-bottom:20px;">
    <p style="color:#dc2626;text-align:center;font-weight:bold;">¿Está seguro que desea cancelar esta cita?</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Cita:</strong></td><td style="padding:10px;border:1px solid #ddd;">#001</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;">Juan Pérez</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;">Dr. García</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;">15/01/2024 - 09:00 AM</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Motivo:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Motivo de la cancelación..."></textarea></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;">
      <button style="background:#ef4444;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin-right:10px;">Confirmar Cancelación</button>
      <button style="background:#6b7280;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Cancelar</button>
    </td></tr>
  </table>
</div>
`,
    'HU021': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Registrar Consulta</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:30%;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombre del paciente" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar médico</option><option>Dr. García</option><option>Dr. Rodríguez</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Motivo:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Motivo de la consulta..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Diagnóstico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Diagnóstico..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tratamiento:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Tratamiento recomendado..."></textarea></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:12px 30px;border:none;border-radius:4px;font-weight:bold;font-size:16px;">Registrar Consulta</button></td></tr>
  </table>
</div>
`,
    'HU024': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Odontograma</h3>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr><td colspan="16" style="background:#0ea5e9;color:white;text-align:center;padding:15px;font-weight:bold;font-size:16px;">Dientes Superiores Adultos</td></tr>
    <tr>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">18</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">17</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">16</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">15</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">14</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">13</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">12</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">11</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">21</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">22</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">23</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">24</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">25</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">26</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">27</td>
      <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">28</td>
    </tr>
  </table>
  <div style="background:#f0f9ff;padding:15px;border:1px solid #0ea5e9;border-radius:4px;margin:20px 0;">
    <strong>Procedimientos disponibles:</strong> Caries (●), Restauración (■), Extracción (✕), Corona (◎), Endodoncia (▲), Implante (⬡), Sellante (⬒), Fractura (↯)
  </div>
</div>
`,
    'HU027': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Registrar Historia Clínica</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombre del paciente" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Antecedentes:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Antecedentes médicos..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Alergias:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Alergias conocidas..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Medicamentos:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Medicamentos actuales..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Observaciones:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Observaciones adicionales..."></textarea></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:12px 30px;border:none;border-radius:4px;font-weight:bold;font-size:16px;">Registrar Historia</button></td></tr>
  </table>
</div>
`,
    'HU030': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Registrar Empresa</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Nombre:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombre de la empresa" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>RUC:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="12345678901" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Dirección:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Dirección completa" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Teléfono:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="tel" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="+51 1 234 5678" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="email" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="contacto@empresa.com" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Registrar Empresa</button></td></tr>
  </table>
</div>
`,
    'HU037': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Dashboard - Estadísticas del Consultorio</h3>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr><td colspan="4" style="background:#0ea5e9;color:white;text-align:center;padding:15px;font-weight:bold;font-size:16px;">Estadísticas Principales</td></tr>
    <tr>
      <td style="border:1px solid #ddd;padding:15px;text-align:center;background:#f0f9ff;">
        <div style="font-size:24px;font-weight:bold;color:#0ea5e9;">12</div>
        <div style="color:#64748b;font-weight:bold;">Citas Hoy</div>
      </td>
      <td style="border:1px solid #ddd;padding:15px;text-align:center;background:#fef3c7;">
        <div style="font-size:24px;font-weight:bold;color:#f59e0b;">5</div>
        <div style="color:#64748b;font-weight:bold;">Citas Pendientes</div>
      </td>
      <td style="border:1px solid #ddd;padding:15px;text-align:center;background:#ecfdf5;">
        <div style="font-size:24px;font-weight:bold;color:#10b981;">30</div>
        <div style="color:#64748b;font-weight:bold;">Pacientes Activos</div>
      </td>
      <td style="border:1px solid #ddd;padding:15px;text-align:center;background:#f3e8ff;">
        <div style="font-size:24px;font-weight:bold;color:#8b5cf6;">S/ 2,500</div>
        <div style="color:#64748b;font-weight:bold;">Ingresos del Mes</div>
      </td>
    </tr>
  </table>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr><td colspan="2" style="background:#0ea5e9;color:white;text-align:center;padding:12px;font-weight:bold;">Citas Recientes</td></tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">Juan Pérez - 09:00 AM</td>
      <td style="padding:10px;border:1px solid #ddd;"><span style="background:#f59e0b;color:white;padding:4px 8px;border-radius:4px;font-size:12px;">Programada</span></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">María López - 10:00 AM</td>
      <td style="padding:10px;border:1px solid #ddd;"><span style="background:#10b981;color:white;padding:4px 8px;border-radius:4px;font-size:12px;">Confirmada</span></td>
    </tr>
  </table>
</div>
`,
    'HU040': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Configurar Horarios</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Nombre:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Mañana" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Hora Inicio:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="time" style="width:100%;padding:8px;border:1px solid #ccc;" value="08:00" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Hora Fin:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="time" style="width:100%;padding:8px;border:1px solid #ccc;" value="12:00" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Duración Cita:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>30 minutos</option><option>45 minutos</option><option>60 minutos</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Crear Horario</button></td></tr>
  </table>
</div>
`,
    'HU022': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:900px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Historial de Consultas</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr style="background:#0ea5e9;color:white;">
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">ID</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Paciente</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Médico</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Fecha</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Motivo</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Acciones</th>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">001</td>
      <td style="padding:10px;border:1px solid #ddd;">Juan Pérez</td>
      <td style="padding:10px;border:1px solid #ddd;">Dr. García</td>
      <td style="padding:10px;border:1px solid #ddd;">15/01/2024</td>
      <td style="padding:10px;border:1px solid #ddd;">Dolor de muelas</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">
        <button style="background:#f59e0b;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Ver</button>
        <button style="background:#0ea5e9;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Editar</button>
      </td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">002</td>
      <td style="padding:10px;border:1px solid #ddd;">María López</td>
      <td style="padding:10px;border:1px solid #ddd;">Dr. Rodríguez</td>
      <td style="padding:10px;border:1px solid #ddd;">14/01/2024</td>
      <td style="padding:10px;border:1px solid #ddd;">Limpieza dental</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">
        <button style="background:#f59e0b;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Ver</button>
        <button style="background:#0ea5e9;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Editar</button>
      </td>
    </tr>
  </table>
</div>
`,
    'HU023': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Editar Consulta</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Consulta:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar consulta</option><option>Consulta #001 - Juan Pérez</option><option>Consulta #002 - María López</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="Juan Pérez" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Dr. García</option><option>Dr. Rodríguez</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" value="2024-01-15" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Motivo:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Motivo de la consulta...">Dolor de muelas</textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Diagnóstico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Diagnóstico...">Caries dental</textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tratamiento:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Tratamiento recomendado...">Restauración dental</textarea></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Actualizar Consulta</button></td></tr>
  </table>
</div>
`,
    'HU025': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Aplicar Procedimientos Dentales</h3>
  <div style="background:#f0f9ff;padding:15px;border:1px solid #0ea5e9;border-radius:4px;margin:20px 0;">
    <strong>Diente seleccionado:</strong> Diente #16 (Superior derecho)
  </div>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr style="background:#0ea5e9;color:white;">
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Procedimiento</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Símbolo</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Color</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Acción</th>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">Caries</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;font-size:20px;">●</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><div style="width:20px;height:20px;background:#FF4444;border-radius:50%;margin:0 auto;"></div></td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#FF4444;color:white;padding:4px 8px;border:none;border-radius:4px;">Aplicar</button></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">Restauración</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;font-size:20px;">■</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><div style="width:20px;height:20px;background:#4444FF;border-radius:2px;margin:0 auto;"></div></td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#4444FF;color:white;padding:4px 8px;border:none;border-radius:4px;">Aplicar</button></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">Corona</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;font-size:20px;">◎</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><div style="width:20px;height:20px;background:#FFD700;border-radius:50%;margin:0 auto;"></div></td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#FFD700;color:white;padding:4px 8px;border:none;border-radius:4px;">Aplicar</button></td>
    </tr>
  </table>
</div>
`,
    'HU026': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Seleccionar Superficies Dentales</h3>
  <div style="background:#f0f9ff;padding:15px;border:1px solid #0ea5e9;border-radius:4px;margin:20px 0;">
    <strong>Diente seleccionado:</strong> Diente #16 (Superior derecho)
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr style="background:#0ea5e9;color:white;">
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Superficie</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Descripción</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Acción</th>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><strong>Vestibular</strong></td>
      <td style="padding:10px;border:1px solid #ddd;">Cara externa del diente</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:4px 8px;border:none;border-radius:4px;">Seleccionar</button></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><strong>Mesial</strong></td>
      <td style="padding:10px;border:1px solid #ddd;">Cara hacia el centro</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:4px 8px;border:none;border-radius:4px;">Seleccionar</button></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><strong>Oclusal</strong></td>
      <td style="padding:10px;border:1px solid #ddd;">Cara de masticación</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:4px 8px;border:none;border-radius:4px;">Seleccionar</button></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><strong>Distal</strong></td>
      <td style="padding:10px;border:1px solid #ddd;">Cara hacia atrás</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:4px 8px;border:none;border-radius:4px;">Seleccionar</button></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><strong>Lingual</strong></td>
      <td style="padding:10px;border:1px solid #ddd;">Cara interna del diente</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:4px 8px;border:none;border-radius:4px;">Seleccionar</button></td>
    </tr>
  </table>
</div>
`,
    'HU028': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Crear Historia Clínica</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombre del paciente" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Antecedentes:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Antecedentes médicos..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Alergias:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Alergias conocidas..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Medicamentos:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Medicamentos actuales..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Observaciones:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Observaciones adicionales..."></textarea></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:12px 30px;border:none;border-radius:4px;font-weight:bold;font-size:16px;">Crear Historia</button></td></tr>
  </table>
</div>
`,
    'HU029': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Editar Historia Clínica</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Historia:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar historia</option><option>Historia #001 - Juan Pérez</option><option>Historia #002 - María López</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="Juan Pérez" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" value="2024-01-15" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Antecedentes:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Antecedentes médicos...">Diabetes tipo 2</textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Alergias:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Alergias conocidas...">Penicilina</textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Medicamentos:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Medicamentos actuales...">Metformina</textarea></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Actualizar Historia</button></td></tr>
  </table>
</div>
`,
    'HU031': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Registrar Empresa</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Nombre:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombre de la empresa" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>RUC:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="12345678901" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Dirección:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Dirección completa" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Teléfono:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="tel" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="+51 1 234 5678" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="email" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="contacto@empresa.com" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Registrar Empresa</button></td></tr>
  </table>
</div>
`,
    'HU032': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Editar Empresa</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Empresa:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar empresa</option><option>Consultorio Dental ABC</option><option>Clínica Dental XYZ</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Nombre:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="Consultorio Dental ABC" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>RUC:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="12345678901" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Dirección:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="Av. Principal 123, Lima" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Teléfono:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="tel" style="width:100%;padding:8px;border:1px solid #ccc;" value="+51 1 234 5678" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="email" style="width:100%;padding:8px;border:1px solid #ccc;" value="contacto@consultorioabc.com" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Actualizar Empresa</button></td></tr>
  </table>
</div>
`,
    'HU033': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Lista de Empresas</h3>
  <div style="margin-bottom:15px;display:flex;gap:10px;justify-content:center;">
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los estados</option><option>Activo</option><option>Inactivo</option></select>
    <input type="text" placeholder="Buscar empresa..." style="padding:8px;border:1px solid #ccc;border-radius:4px;width:200px;" />
  </div>
  <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>ID</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Nombre</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>NIT</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Teléfono</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Email</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:center;"><strong>Acciones</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">1</td>
        <td style="padding:10px;border:1px solid #ddd;">Empresa ABC S.A.</td>
        <td style="padding:10px;border:1px solid #ddd;">900.123.456-7</td>
        <td style="padding:10px;border:1px solid #ddd;">+57 1 234 5678</td>
        <td style="padding:10px;border:1px solid #ddd;">contacto@abc.com</td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Eliminar</button>
        </td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">2</td>
        <td style="padding:10px;border:1px solid #ddd;">Corporación XYZ Ltda.</td>
        <td style="padding:10px;border:1px solid #ddd;">800.987.654-3</td>
        <td style="padding:10px;border:1px solid #ddd;">+57 1 876 5432</td>
        <td style="padding:10px;border:1px solid #ddd;">info@xyz.com</td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top:15px;text-align:center;">
    <button style="background:#059669;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">+ Nueva Empresa</button>
    <button style="background:#f59e0b;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">Exportar</button>
  </div>
</div>`,
    'HU034': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:500px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Crear Rol</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Nombre:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombre del rol" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Descripción:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Descripción del rol..."></textarea></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Crear Rol</button></td></tr>
  </table>
</div>
`,
    'HU035': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:700px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Asignar Menús a Roles</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Rol:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar rol</option><option>Administrador</option><option>Médico</option><option>Recepcionista</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Menús:</strong></td><td style="padding:10px;border:1px solid #ddd;">
      <div style="display:flex;flex-direction:column;gap:10px;">
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Dashboard</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Gestión de Usuarios</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Gestión de Empleados</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Gestión de Citas</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Gestión de Consultas</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Odontograma</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Historia Clínica</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" /> Configuración</label>
      </div>
    </td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Asignar Menús</button></td></tr>
  </table>
</div>
`,
    'HU036': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:700px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Editar Permisos de Roles</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Rol:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar rol</option><option>Administrador</option><option>Médico</option><option>Recepcionista</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Permisos:</strong></td><td style="padding:10px;border:1px solid #ddd;">
      <div style="display:flex;flex-direction:column;gap:10px;">
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Crear</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Leer</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Actualizar</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" checked /> Eliminar</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" /> Exportar</label>
        <label style="display:flex;align-items:center;gap:5px;"><input type="checkbox" /> Imprimir</label>
      </div>
    </td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Actualizar Permisos</button></td></tr>
  </table>
</div>
`,
    'HU038': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Agenda Médica</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr style="background:#0ea5e9;color:white;">
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Hora</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Paciente</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Tipo de Cita</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:left;">Estado</th>
      <th style="padding:12px;border:1px solid #ddd;text-align:center;">Acciones</th>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">08:00 AM</td>
      <td style="padding:10px;border:1px solid #ddd;">Juan Pérez</td>
      <td style="padding:10px;border:1px solid #ddd;">Consulta General</td>
      <td style="padding:10px;border:1px solid #ddd;"><span style="background:#f59e0b;color:white;padding:4px 8px;border-radius:4px;font-size:12px;">Programada</span></td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">
        <button style="background:#10b981;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Iniciar</button>
        <button style="background:#f59e0b;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Editar</button>
      </td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">09:00 AM</td>
      <td style="padding:10px;border:1px solid #ddd;">María López</td>
      <td style="padding:10px;border:1px solid #ddd;">Limpieza Dental</td>
      <td style="padding:10px;border:1px solid #ddd;"><span style="background:#10b981;color:white;padding:4px 8px;border-radius:4px;font-size:12px;">Confirmada</span></td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">
        <button style="background:#10b981;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Iniciar</button>
        <button style="background:#f59e0b;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Editar</button>
      </td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #ddd;">10:00 AM</td>
      <td style="padding:10px;border:1px solid #ddd;">Carlos Ruiz</td>
      <td style="padding:10px;border:1px solid #ddd;">Extracción</td>
      <td style="padding:10px;border:1px solid #ddd;"><span style="background:#6b7280;color:white;padding:4px 8px;border-radius:4px;font-size:12px;">Pendiente</span></td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">
        <button style="background:#10b981;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Iniciar</button>
        <button style="background:#f59e0b;color:white;padding:4px 8px;border:none;border-radius:4px;margin:2px;">Editar</button>
      </td>
    </tr>
  </table>
</div>
`,
    'HU039': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Gestión de Citas - Recepción</h3>
  <div style="display:flex;gap:20px;margin-bottom:20px;">
    <div style="flex:1;background:white;padding:15px;border-radius:8px;border:1px solid #ddd;">
      <h4 style="color:#059669;margin-bottom:10px;">Citas de Hoy</h4>
      <div style="background:#f0fdf4;padding:10px;border-radius:5px;margin-bottom:10px;">
        <strong>09:00 AM</strong> - Carlos López (Dr. Pérez)
      </div>
      <div style="background:#f0fdf4;padding:10px;border-radius:5px;margin-bottom:10px;">
        <strong>10:30 AM</strong> - Ana Rodríguez (Dra. García)
      </div>
      <div style="background:#f0fdf4;padding:10px;border-radius:5px;">
        <strong>02:00 PM</strong> - Luis Martínez (Dr. Pérez)
      </div>
    </div>
    <div style="flex:1;background:white;padding:15px;border-radius:8px;border:1px solid #ddd;">
      <h4 style="color:#dc2626;margin-bottom:10px;">Pendientes</h4>
      <div style="background:#fef2f2;padding:10px;border-radius:5px;margin-bottom:10px;">
        <strong>11:00 AM</strong> - María Silva (Confirmar)
      </div>
      <div style="background:#fef2f2;padding:10px;border-radius:5px;">
        <strong>03:30 PM</strong> - Pedro Gómez (Confirmar)
      </div>
    </div>
  </div>
  <div style="text-align:center;">
    <button style="background:#059669;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">+ Nueva Cita</button>
    <button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">Ver Calendario</button>
    <button style="background:#f59e0b;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">Reportes</button>
  </div>
</div>`,
    'HU041': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:600px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Editar Horarios</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:35%;"><strong>Horario:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar horario</option><option>Mañana (8:00-12:00)</option><option>Tarde (14:00-18:00)</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Nombre:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" value="Mañana" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Hora Inicio:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="time" style="width:100%;padding:8px;border:1px solid #ccc;" value="08:00" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Hora Fin:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="time" style="width:100%;padding:8px;border:1px solid #ccc;" value="12:00" /></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Duración Cita:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>30 minutos</option><option>45 minutos</option><option>60 minutos</option></select></td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Estado:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Activo</option><option>Inactivo</option></select></td></tr>
    <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Actualizar Horario</button></td></tr>
  </table>
</div>
`,
    'HU042': `
<div style="background:#f8f9fa;padding:20px;border:2px solid #e5e7eb;border-radius:8px;max-width:800px;margin:20px auto;">
  <h3 style="color:#0ea5e9;text-align:center;font-weight:bold;font-size:18px;margin-bottom:20px;">Lista de Horarios</h3>
  <div style="margin-bottom:15px;display:flex;gap:10px;justify-content:center;">
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los médicos</option><option>Dr. Juan Pérez</option><option>Dra. María García</option></select>
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los días</option><option>Lunes</option><option>Martes</option><option>Miércoles</option><option>Jueves</option><option>Viernes</option></select>
    <select style="padding:8px;border:1px solid #ccc;border-radius:4px;"><option>Todos los estados</option><option>Activo</option><option>Inactivo</option></select>
  </div>
  <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>ID</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Médico</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Día</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Hora Inicio</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Hora Fin</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:left;"><strong>Estado</strong></th>
        <th style="padding:12px;border:1px solid #ddd;text-align:center;"><strong>Acciones</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">1</td>
        <td style="padding:10px;border:1px solid #ddd;">Dr. Juan Pérez</td>
        <td style="padding:10px;border:1px solid #ddd;">Lunes</td>
        <td style="padding:10px;border:1px solid #ddd;">08:00 AM</td>
        <td style="padding:10px;border:1px solid #ddd;">05:00 PM</td>
        <td style="padding:10px;border:1px solid #ddd;"><span style="color:#059669;font-weight:bold;">Activo</span></td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Eliminar</button>
        </td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">2</td>
        <td style="padding:10px;border:1px solid #ddd;">Dra. María García</td>
        <td style="padding:10px;border:1px solid #ddd;">Martes</td>
        <td style="padding:10px;border:1px solid #ddd;">09:00 AM</td>
        <td style="padding:10px;border:1px solid #ddd;">06:00 PM</td>
        <td style="padding:10px;border:1px solid #ddd;"><span style="color:#059669;font-weight:bold;">Activo</span></td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <button style="background:#0ea5e9;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Editar</button>
          <button style="background:#dc2626;color:white;padding:5px 10px;border:none;border-radius:3px;margin:2px;">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top:15px;text-align:center;">
    <button style="background:#059669;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">+ Nuevo Horario</button>
    <button style="background:#f59e0b;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;margin:5px;">Exportar</button>
  </div>
</div>`
  };
  return visualHTML[huId] || '';
}

// Función para agregar visualizaciones al HTML existente
function addVisualizationsToHTML() {
  try {
    // Leer el archivo HTML existente
    const htmlContent = fs.readFileSync('Historias_Usuario_Consultorio_Dental.html', 'utf8');
    
    // Buscar cada HU y agregar la visualización correspondiente
    let updatedContent = htmlContent;
    
    // Mapeo de HUs con sus IDs
    const huMappings = [
      { pattern: /<h3>HU001: Inicio de Sesión<\/h3>/g, id: 'HU001' },
      { pattern: /<h3>HU002: Recuperación de Contraseña<\/h3>/g, id: 'HU002' },
      { pattern: /<h3>HU003: Cambio de Contraseña<\/h3>/g, id: 'HU003' },
      { pattern: /<h3>HU004: Persistencia de Sesión<\/h3>/g, id: 'HU004' },
      { pattern: /<h3>HU005: Crear Usuario<\/h3>/g, id: 'HU005' },
      { pattern: /<h3>HU006: Editar Usuario<\/h3>/g, id: 'HU006' },
      { pattern: /<h3>HU007: Listar Usuarios<\/h3>/g, id: 'HU007' },
      { pattern: /<h3>HU008: Eliminar Usuario<\/h3>/g, id: 'HU008' },
      { pattern: /<h3>HU009: Registrar Empleado<\/h3>/g, id: 'HU009' },
      { pattern: /<h3>HU010: Editar Empleado<\/h3>/g, id: 'HU010' },
      { pattern: /<h3>HU011: Listar Empleados<\/h3>/g, id: 'HU011' },
      { pattern: /<h3>HU012: Eliminar Empleado<\/h3>/g, id: 'HU012' },
      { pattern: /<h3>HU013: Crear Programación<\/h3>/g, id: 'HU013' },
      { pattern: /<h3>HU014: Asignar Horarios a Médicos<\/h3>/g, id: 'HU014' },
      { pattern: /<h3>HU015: Visualizar Programaciones<\/h3>/g, id: 'HU015' },
      { pattern: /<h3>HU016: Eliminar Programación<\/h3>/g, id: 'HU016' },
      { pattern: /<h3>HU017: Crear Cita<\/h3>/g, id: 'HU017' },
      { pattern: /<h3>HU018: Editar Cita<\/h3>/g, id: 'HU018' },
      { pattern: /<h3>HU019: Listar Citas<\/h3>/g, id: 'HU019' },
      { pattern: /<h3>HU020: Cancelar Cita<\/h3>/g, id: 'HU020' },
      { pattern: /<h3>HU021: Registrar Consulta<\/h3>/g, id: 'HU021' },
      { pattern: /<h3>HU022: Acceder Historial de Consultas<\/h3>/g, id: 'HU022' },
      { pattern: /<h3>HU023: Editar Consulta<\/h3>/g, id: 'HU023' },
      { pattern: /<h3>HU024: Crear Odontograma<\/h3>/g, id: 'HU024' },
      { pattern: /<h3>HU025: Aplicar Procedimientos Dentales<\/h3>/g, id: 'HU025' },
      { pattern: /<h3>HU026: Seleccionar Superficies Dentales<\/h3>/g, id: 'HU026' },
      { pattern: /<h3>HU027: Visualizar Historial de Procedimientos<\/h3>/g, id: 'HU027' },
      { pattern: /<h3>HU028: Crear Historia Clínica<\/h3>/g, id: 'HU028' },
      { pattern: /<h3>HU029: Editar Historia Clínica<\/h3>/g, id: 'HU029' },
      { pattern: /<h3>HU030: Acceder Historial Médico<\/h3>/g, id: 'HU030' },
      { pattern: /<h3>HU031: Registrar Empresa<\/h3>/g, id: 'HU031' },
      { pattern: /<h3>HU032: Editar Empresa<\/h3>/g, id: 'HU032' },
      { pattern: /<h3>HU033: Listar Empresas<\/h3>/g, id: 'HU033' },
      { pattern: /<h3>HU034: Crear Rol<\/h3>/g, id: 'HU034' },
      { pattern: /<h3>HU035: Asignar Menús a Roles<\/h3>/g, id: 'HU035' },
      { pattern: /<h3>HU036: Editar Permisos de Roles<\/h3>/g, id: 'HU036' },
      { pattern: /<h3>HU037: Dashboard Administrativo<\/h3>/g, id: 'HU037' },
      { pattern: /<h3>HU038: Agenda Médica<\/h3>/g, id: 'HU038' },
      { pattern: /<h3>HU039: Gestión de Citas Recepción<\/h3>/g, id: 'HU039' },
      { pattern: /<h3>HU040: Configurar Horarios<\/h3>/g, id: 'HU040' },
      { pattern: /<h3>HU041: Editar Horarios<\/h3>/g, id: 'HU041' },
      { pattern: /<h3>HU042: Listar Horarios<\/h3>/g, id: 'HU042' }
    ];
    
    // Agregar visualizaciones para cada HU
    huMappings.forEach(mapping => {
      const visualHTML = getComponentVisualHTML(mapping.id);
      if (visualHTML) {
        // Buscar el patrón y agregar la visualización después
        updatedContent = updatedContent.replace(
          mapping.pattern,
          `$&<div style="margin:20px 0;page-break-inside:avoid;"><h4 style="color:#0ea5e9;margin:15px 0;font-size:14pt;">📱 Visualización de la Pantalla:</h4>${visualHTML}</div>`
        );
      }
    });
    
    // Guardar el nuevo archivo
    const outputFile = 'Historias_Usuario_Consultorio_Dental_Con_Visualizaciones.html';
    fs.writeFileSync(outputFile, updatedContent, 'utf8');
    
    console.log(`✅ Archivo actualizado exitosamente: ${outputFile}`);
    console.log(`📱 Se agregaron visualizaciones HTML para las pantallas principales`);
    console.log(`🎯 HUs con visualizaciones: HU001, HU002, HU003, HU004, HU005, HU006, HU007, HU008, HU009, HU010, HU011, HU012, HU013, HU014, HU015, HU016, HU017, HU018, HU019, HU020, HU021, HU024, HU027, HU030, HU037, HU040, HU022, HU023, HU025, HU026, HU028, HU029, HU031, HU032, HU033, HU034, HU035, HU036, HU038, HU039, HU041, HU042`);
    
  } catch (error) {
    console.error('❌ Error al procesar el archivo:', error.message);
  }
}

// Ejecutar la función
addVisualizationsToHTML();