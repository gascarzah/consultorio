/**
 * Título de página según la ruta del dashboard (un solo título en el header).
 */
const PAGE_TITLES = [
  { test: (p) => p === "/dashboard" || p === "/dashboard/", title: "Dashboard" },
  { test: (p) => p.includes("/cambiar-password"), title: "Cambiar contraseña" },
  { test: (p) => p.includes("/persistencia-sesion"), title: "Gestión de sesión" },
  { test: (p) => p.includes("/editar-historia-clinica"), title: "Editar historia clínica" },
  { test: (p) => p.includes("/agregar-historia-clinica"), title: "Agregar historia clínica" },
  { test: (p) => p.includes("/listar-historia-clinica"), title: "Historias clínicas" },
  { test: (p) => p.includes("/editar-empleado"), title: "Editar empleado" },
  { test: (p) => p.includes("/agregar-empleado"), title: "Agregar empleado" },
  { test: (p) => p.includes("/listar-empleado"), title: "Empleados" },
  { test: (p) => p.includes("/editar-programacion-detalle"), title: "Editar programación detalle" },
  { test: (p) => p.includes("/agregar-programacion-detalle"), title: "Agregar programación detalle" },
  { test: (p) => p.includes("/listar-programacion-detalle"), title: "Programaciones detalle" },
  { test: (p) => p.includes("/editar-programacion"), title: "Editar programación" },
  { test: (p) => p.includes("/agregar-programacion"), title: "Agregar programación" },
  { test: (p) => p.includes("/listar-programacion"), title: "Programaciones" },
  { test: (p) => p.includes("/editar-horario"), title: "Editar horario" },
  { test: (p) => p.includes("/agregar-horario"), title: "Agregar horario" },
  { test: (p) => p.includes("/listar-horario"), title: "Horarios" },
  { test: (p) => p.includes("/editar-cita"), title: "Editar cita" },
  { test: (p) => p.includes("/agregar-cita"), title: "Agregar cita" },
  { test: (p) => p.includes("/listar-cita"), title: "Citas" },
  { test: (p) => p.includes("/listar-consulta/") || p.includes("/agregar-consulta"), title: "Registrar consulta" },
  { test: (p) => p.includes("/listar-consulta"), title: "Consultas" },
  { test: (p) => p.includes("/editar-usuario"), title: "Editar usuario" },
  { test: (p) => p.includes("/agregar-usuario"), title: "Agregar usuario" },
  { test: (p) => p.includes("/listar-usuario"), title: "Usuarios" },
  { test: (p) => p.includes("/editar-tipo-empleado"), title: "Editar tipo de empleado" },
  { test: (p) => p.includes("/agregar-tipo-empleado"), title: "Agregar tipo de empleado" },
  { test: (p) => p.includes("/listar-tipo-empleado"), title: "Tipos de empleado" },
  { test: (p) => p.includes("/editar-empresa"), title: "Editar empresa" },
  { test: (p) => p.includes("/agregar-empresa"), title: "Agregar empresa" },
  { test: (p) => p.includes("/listar-empresa"), title: "Empresas" },
  { test: (p) => p.includes("/editar-rol"), title: "Editar rol" },
  { test: (p) => p.includes("/agregar-rol"), title: "Agregar rol" },
  { test: (p) => p.includes("/listar-rol"), title: "Roles" },
  { test: (p) => p.includes("/editar-menu"), title: "Editar menú" },
  { test: (p) => p.includes("/agregar-menu"), title: "Agregar menú" },
  { test: (p) => p.includes("/listar-menu"), title: "Menús" },
  { test: (p) => p.includes("/editar-categoria-menu"), title: "Editar categoría de menú" },
  { test: (p) => p.includes("/agregar-categoria-menu"), title: "Agregar categoría de menú" },
  { test: (p) => p.includes("/listar-categoria-menu"), title: "Categorías de menú" },
  { test: (p) => p.includes("/rol-menu") || p.includes("/mantenimiento-rol-menu"), title: "Menús por rol" },
  { test: (p) => p.includes("/odontograma"), title: "Odontograma" },
];

export function getPageTitle(pathname = "") {
  const path = pathname.replace(/\/+$/, "") || "/";
  const match = PAGE_TITLES.find((entry) => entry.test(path));
  return match?.title || "Consultorio";
}
