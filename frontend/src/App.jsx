import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { Suspense, lazy, useEffect } from 'react';
import store from "./store";
import SetupInterceptors from "./config/SetupInterceptors";
import { checkAuth } from "./slices/authSlice";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Lazy loaded components
const LoginLazy = lazy(() => import("./pages/Login"));
const AuthLayoutLazy = lazy(() => import("./layout/AuthLayout"));
const OlvidePasswordLazy = lazy(() => import("./pages/OlvidePassword"));
const ConfirmarCuentaLazy = lazy(() => import("./pages/ConfirmarCuenta"));
const NuevoPasswordLazy = lazy(() => import("./pages/NuevoPassword"));
const RegistrarUsuarioLazy = lazy(() => import("./pages/RegistrarUsuario"));
const CambiarPasswordLazy = lazy(() => import("./pages/CambiarPassword"));
const PersistenciaSesionLazy = lazy(() => import("./pages/PersistenciaSesion"));
const RutaProtegidaLazy = lazy(() => import("./layout/RutaProtegida"));
const DashboardLazy = lazy(() => import("./pages/Dashboard"));
const ListarEmpleadoLazy = lazy(() => import("./pages/empleado"));
const ListarProgramacionLazy = lazy(() => import("./pages/programacion"));
const AgregarProgramacionLazy = lazy(() => import("./pages/programacion/Agregar"));
const EditarProgramacionLazy = lazy(() => import("./pages/programacion/Editar"));
const ListarHorarioLazy = lazy(() => import("./pages/horario"));
const AgregarHorarioLazy = lazy(() => import("./pages/horario/Agregar"));
const EditarHorarioLazy = lazy(() => import("./pages/horario/Editar"));
const ListarCitaLazy = lazy(() => import("./pages/cita"));
const AgregarCitaLazy = lazy(() => import("./pages/cita/Agregar.jsx"));
const EditarCitaLazy = lazy(() => import("./pages/cita/Editar"));
const ListarConsultaLazy = lazy(() => import("./pages/consulta"));
const AgregarConsultaLazy = lazy(() => import("./pages/consulta/Agregar"));
const OdontogramaLazy = lazy(() => import("./pages/odontograma"));

// Non-lazy loaded components
import ListarHistoriaClinica from "./pages/historiaClinica";
import AgregarHistoriaClinica from "./pages/historiaClinica/Agregar";
import EditarHistoriaClinica from "./pages/historiaClinica/Editar";
import AgregarEmpleado from "./pages/empleado/Agregar";
import ListarProgramacionDetalle from "./pages/programacionDetalle";
import AgregarProgramacionDetalle from "./pages/programacionDetalle/Agregar";
import EditarProgramacionDetalle from "./pages/programacionDetalle/Editar";
import ListarUsuario from "./pages/usuario";
import AgregarUsuario from "./pages/usuario/Agregar";
import EditarUsuario from "./pages/usuario/Editar";
import ListarTipoEmpleado from "./pages/tipoEmpleado";
import AgregarTipoEmpleado from "./pages/tipoEmpleado/Agregar";
import EditarTipoEmpleado from "./pages/tipoEmpleado/Editar";
import ListarEmpresa from "./pages/empresa";
import AgregarEmpresa from "./pages/empresa/Agregar";
import EditarEmpresa from "./pages/empresa/Editar";
import ListarRol from "./pages/rol";
import AgregarRol from "./pages/rol/Agregar";
import EditarRol from "./pages/rol/Editar";
import ListarMenu from "./pages/menu";
import AgregarMenu from "./pages/menu/Agregar";
import EditarMenu from "./pages/menu/Editar";
import MantenimientoRolMenu from "./pages/rolMenu";
import EditarEmpleado from "./pages/empleado/Editar";
import ListarCategoriaMenu from "./pages/categoriaMenu";
import AgregarCategoriaMenu from "./pages/categoriaMenu/Agregar";
import EditarCategoriaMenu from "./pages/categoriaMenu/Editar";

function NavigateFunctionComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuth());
    SetupInterceptors(navigate);
  }, [dispatch, navigate]);
  
  return null;
}

const allowPublicRegister = import.meta.env.VITE_ALLOW_PUBLIC_REGISTER !== "false";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <NavigateFunctionComponent />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        }>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<AuthLayoutLazy />}>
              <Route index element={<LoginLazy />} />
              {allowPublicRegister && (
                <Route path="registrar" element={<RegistrarUsuarioLazy />} />
              )}
            </Route>

            {/* Protected Routes */}
            <Route path="/dashboard" element={<RutaProtegidaLazy />}>
              <Route index element={<DashboardLazy />} />
              
              {/* Cambio de Contraseña Route */}
              <Route path="cambiar-password" element={<CambiarPasswordLazy />} />
              
              {/* Persistencia de Sesión Route */}
              <Route path="persistencia-sesion" element={<PersistenciaSesionLazy />} />
              
              {/* Historia Clínica Routes */}
              <Route path="listar-historia-clinica" element={<ListarHistoriaClinica />} />
              <Route path="listar-historia-clinica/agregar-historia-clinica" element={<AgregarHistoriaClinica />} />
              <Route path="listar-historia-clinica/editar-historia-clinica/:numeroDocumento" element={<EditarHistoriaClinica />} />

              {/* Empleado Routes */}
              <Route path="listar-empleado" element={<ListarEmpleadoLazy />} />
              <Route path="listar-empleado/agregar-empleado" element={<AgregarEmpleado />} />
              <Route path="listar-empleado/editar-empleado/:id" element={<EditarEmpleado />} />
              {/* Programación Routes */}
              <Route path="listar-programacion" element={<ListarProgramacionLazy />} />
              <Route path="listar-programacion/agregar-programacion" element={<AgregarProgramacionLazy />} />
              <Route path="listar-programacion/editar-programacion/:id" element={<EditarProgramacionLazy />} />

              {/* Programación Detalle Routes */}
              <Route path="listar-programacion-detalle" element={<ListarProgramacionDetalle />} />
              <Route path="listar-programacion-detalle/agregar-programacion-detalle" element={<AgregarProgramacionDetalle />} />
              <Route path="listar-programacion-detalle/editar-programacion-detalle/:id" element={<EditarProgramacionDetalle />} />

              {/* Horario Routes */}
              <Route path="listar-horario" element={<ListarHorarioLazy />} />
              <Route path="listar-horario/agregar-horario" element={<AgregarHorarioLazy />} />
              <Route path="listar-horario/editar-horario/:id" element={<EditarHorarioLazy />} />

              {/* Cita Routes */}
              <Route path="listar-cita" element={<ListarCitaLazy />} />
              <Route path="listar-cita/agregar-cita" element={<AgregarCitaLazy />} />
              <Route path="listar-cita/editar-cita/:id" element={<EditarCitaLazy />} />

              {/* Consulta Routes */}
              <Route path="listar-consulta" element={<ListarConsultaLazy />} />
              <Route path="agregar-consulta" element={<Navigate to="/dashboard/listar-consulta" replace />} />
              <Route path="agregar-consulta/:idCita/:numeroDocumento" element={<AgregarConsultaLazy />} />

              {/* Odontograma Routes */}
              <Route path="odontograma" element={<OdontogramaLazy />} />

              {/* Usuario Routes */}
              <Route path="listar-usuario" element={<ListarUsuario />} />
              <Route path="listar-usuario/agregar-usuario" element={<AgregarUsuario />} />
              <Route path="listar-usuario/editar-usuario/:id" element={<EditarUsuario />} />

              {/* Tipo Empleado Routes */}
              <Route path="listar-tipo-empleado" element={<ListarTipoEmpleado />} />
              <Route path="listar-tipoempleado" element={<Navigate to="/dashboard/listar-tipo-empleado" replace />} />
              <Route path="listar-tipo-empleado/agregar-tipo-empleado" element={<AgregarTipoEmpleado />} />
              <Route path="listar-tipo-empleado/editar-tipo-empleado/:id" element={<EditarTipoEmpleado />} />

              {/* Empresa Routes */}
              <Route path="listar-empresa" element={<ListarEmpresa />} />
              <Route path="listar-empresa/agregar-empresa" element={<AgregarEmpresa />} />
              <Route path="listar-empresa/editar-empresa/:id" element={<EditarEmpresa />} />

              {/* Rol Routes */}
              <Route path="listar-rol" element={<ListarRol />} />
              <Route path="listar-rol/agregar-rol" element={<AgregarRol />} />
              <Route path="listar-rol/editar-rol/:id" element={<EditarRol />} />

              {/* Menu Routes */}
              <Route path="listar-menu" element={<ListarMenu />} />
              <Route path="listar-menu/agregar-menu" element={<AgregarMenu />} />
              <Route path="listar-menu/editar-menu/:id" element={<EditarMenu />} />

              {/* Rol Menu Routes */}
              <Route path="listar-rol-menu" element={<MantenimientoRolMenu />} />

              {/* Categoria Menu Routes */}
              <Route path="listar-categoria-menu" element={<ListarCategoriaMenu />} />
              <Route path="listar-categoria-menu/agregar-categoria-menu" element={<AgregarCategoriaMenu />} />
              <Route path="listar-categoria-menu/editar-categoria-menu/:id" element={<EditarCategoriaMenu />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
