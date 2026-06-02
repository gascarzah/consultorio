import { configureStore } from '@reduxjs/toolkit'
import usuario from './slices/usuarioSlice'
import rol from './slices/rolSlice'
import auth from './slices/authSlice'
import cliente from './slices/clienteSlice'
import empleado from './slices/empleadoSlice'
import programacion from './slices/programacionSlice'
import programacionDetalle from './slices/programacionDetalleSlice'
import cita from './slices/citaSlice'
import empresa from './slices/empresaSlice'
import horario from './slices/horarioSlice'
import rolMenu from './slices/rolMenuSlice'
import consultorio from './slices/consultorioSlice'
import historiaClinica from './slices/historiaClinicaSlice'
import dashboard from './slices/dashboardSlice'
import maestra from './slices/maestraSlice'
import tipoEmpleado from './slices/tipoEmpleadoSlice'
import menu from './slices/menuSlice'
import session from './slices/sessionSlice'
import categoriaMenu from './slices/categoriaMenuSlice'

export default configureStore({
  reducer: {
    usuario,
    rol,
    auth,
    cliente,
    empleado,
    programacion,
    cita,
    programacionDetalle,
    empresa,
    horario,
    consultorio,
    rolMenu,
    historiaClinica,
    dashboard,
    maestra,
    tipoEmpleado,
    menu,
    session,
    categoriaMenu,
  }
})