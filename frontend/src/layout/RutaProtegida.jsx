import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/Sidebar';
import { useEffect, useState, useRef } from 'react';
import { loadAuthProfile, logout } from '../slices/authSlice';
import { getUsuario } from '../slices/usuarioSlice';
import { getPageTitle } from '../utils/pageTitles';

const RutaProtegida = () => {
  const { logged, email, rol } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = useSelector((state) => state.auth.email);
  const pageTitle = getPageTitle(location.pathname);

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
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      <main className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              <div>
                <p className="text-xs text-gray-500 leading-none mb-0.5">Consultorio</p>
                <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                  {pageTitle}
                </h1>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 pl-4 focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-white">
                    {getInitials(userEmail)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {userEmail || 'Usuario'}
                  </span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-30">
                    <Link
                      to="/dashboard/cambiar-password"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span>Cambiar Contraseña</span>
                    </Link>
                    <Link
                      to="/dashboard/persistencia-sesion"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span>Gestión de Sesión</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleCerrarSesion}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="w-full p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RutaProtegida;
