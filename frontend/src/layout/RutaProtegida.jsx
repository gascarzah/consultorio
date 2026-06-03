import { Outlet, Navigate, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/Sidebar';
import { useEffect, useState, useRef } from 'react';
import { loadAuthProfile, logout } from '../slices/authSlice';
import { getUsuario } from '../slices/usuarioSlice';

const RutaProtegida = () => {
  const { logged, email, rol } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.email);

  const getInitials = (emailValue) => {
    if (!emailValue) return 'U';
    const parts = emailValue.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return emailValue[0].toUpperCase();
  };

  const handleCerrarSesion = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (logged && email && !rol?.idRol) {
      dispatch(loadAuthProfile(email));
      dispatch(getUsuario(email));
    }
  }, [logged, email, rol?.idRol, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!logged) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                Consultorio Médico
              </p>
              <p className="hidden truncate text-xs text-gray-500 sm:block">
                Panel de administración
              </p>
            </div>
          </div>

          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white shadow-sm">
                {getInitials(userEmail)}
              </div>
              <span className="hidden max-w-[180px] truncate text-sm font-medium text-gray-700 sm:inline">
                {userEmail || 'Usuario'}
              </span>
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5">
                <Link
                  to="/dashboard/cambiar-password"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Cambiar contraseña
                </Link>
                <Link
                  to="/dashboard/persistencia-sesion"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Gestión de sesión
                </Link>
                <button
                  type="button"
                  onClick={handleCerrarSesion}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="app-page min-w-0 flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RutaProtegida;
