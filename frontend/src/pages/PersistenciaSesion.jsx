import { VALIDATION_MESSAGES } from "../utils/ValidationMessages";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SweetCrud } from "../utils";
import { 
  getSessionConfig, 
  updateSessionConfig, 
  refreshSession, 
  getActiveSessions, 
  terminateSession, 
  terminateAllSessions,
  updateLastActivity 
} from "../slices/sessionSlice";

/** Convierte ISO string, timestamp o Date a Date (API/Redux serializa fechas como string). */
const parseDate = (value) => {
  if (value == null) return new Date();
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

const PersistenciaSesion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.usuario);
  const { 
    sessionConfig, 
    sessionInfo, 
    activeSessions, 
    loading, 
    error 
  } = useSelector((state) => state.session);

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(getSessionConfig());
    dispatch(getActiveSessions());
  }, [dispatch]);

  // Simular actualización de actividad
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateLastActivity());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...sessionConfig, [key]: value };
    dispatch(updateSessionConfig(newConfig))
      .unwrap()
      .then(() => {
        toast.success(`Configuración ${key} actualizada`);
      })
      .catch((error) => {
        toast.error(error.message || VALIDATION_MESSAGES.ERROR.ERROR_ACTUALIZAR_CONFIG);
      });
  };

  const handleRefreshSession = () => {
    dispatch(refreshSession())
      .unwrap()
      .then(() => {
        toast.success(VALIDATION_MESSAGES.SUCCESS.SESION_REFRESCADA);
      })
      .catch((error) => {
        toast.error(error.message || VALIDATION_MESSAGES.ERROR.ERROR_REFRESCAR_SESION);
      });
  };

  const handleTerminateSession = (sessionId) => {
    dispatch(terminateSession(sessionId))
      .unwrap()
      .then(() => {
        toast.success(VALIDATION_MESSAGES.SUCCESS.SESION_TERMINADA);
      })
      .catch((error) => {
        toast.error(error.message || VALIDATION_MESSAGES.ERROR.ERROR_TERMINAR_SESION);
      });
  };

  const handleTerminateAllSessions = () => {
    dispatch(terminateAllSessions())
      .unwrap()
      .then(() => {
        SweetCrud('Sesiones Terminadas', 'Todas las sesiones excepto la actual han sido terminadas');
      })
      .catch((error) => {
        toast.error(error.message || VALIDATION_MESSAGES.ERROR.ERROR_TERMINAR_SESIONES);
      });
  };

  const formatTimeAgo = (date) => {
    const d = parseDate(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return "Ahora mismo";
  };

  const getSessionStatusColor = (isActive) => {
    return isActive ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-sm text-gray-600 mb-6">
        Administra la persistencia de tu sesión y monitorea la actividad
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Estado de Sesión */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Estado de Sesión Actual
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <span className={`text-sm font-semibold ${getSessionStatusColor(sessionInfo.isActive)}`}>
                    {sessionInfo.isActive ? "Activa" : "Inactiva"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">��ltima actividad:</span>
                  <span className="text-sm text-gray-900">
                    {formatTimeAgo(sessionInfo.lastActivity)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Inicio de sesión:</span>
                  <span className="text-sm text-gray-900">
                    {parseDate(sessionInfo.sessionStart).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Dispositivo:</span>
                  <span className="text-sm text-gray-900 truncate max-w-32">
                    {(sessionInfo.deviceInfo || "").includes("Chrome") ? "Chrome" : "Navegador"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">IP:</span>
                  <span className="text-sm text-gray-900">{sessionInfo.ipAddress || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleRefreshSession}
                  disabled={loading}
                  className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Refrescando..." : "Refrescar Sesión"}
                </button>
              </div>
            </div>
          </div>

          {/* Configuración de Persistencia */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Persistencia
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Mantener sesión activa
                    </label>
                    <p className="text-xs text-gray-500">
                      Evita cierres inesperados
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sessionConfig.keepAlive}
                      onChange={(e) => handleConfigChange('keepAlive', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Tiempo de sesión
                  </label>
                  <select
                    value={sessionConfig.sessionTimeout}
                    onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value={4}>4 horas</option>
                    <option value={8}>8 horas</option>
                    <option value={12}>12 horas</option>
                    <option value={24}>24 horas</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Auto-refresh
                    </label>
                    <p className="text-xs text-gray-500">
                      Renovar automáticamente
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sessionConfig.autoRefresh}
                      onChange={(e) => handleConfigChange('autoRefresh', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Indicador de sesión
                    </label>
                    <p className="text-xs text-gray-500">
                      Mostrar estado activo
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sessionConfig.showSessionIndicator}
                      onChange={(e) => handleConfigChange('showSessionIndicator', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sesiones Activas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sesiones Activas
                </h2>
                <button
                  onClick={handleTerminateAllSessions}
                  disabled={loading}
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Procesando..." : "Terminar Todas"}
                </button>
              </div>
              
              <div className="space-y-3">
                {activeSessions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay sesiones activas
                  </p>
                ) : (
                  activeSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {session.device}
                        </span>
                        {session.isCurrent && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Actual
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">
                        {session.location} ��� ��ltima actividad: {formatTimeAgo(session.lastActivity)}
                      </div>
                      
                      {!session.isCurrent && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          disabled={loading}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Procesando..." : "Terminar"}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información de Seguridad
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Beneficios de la Persistencia:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>��� Evita pérdida de trabajo por cierres inesperados</li>
                <li>��� Reduce tiempos de reconexión</li>
                <li>��� Mantiene continuidad del trabajo clínico</li>
                <li>��� Mejora la experiencia del usuario</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Medidas de Seguridad:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>��� Validación automática de token</li>
                <li>��� Registro de actividad del usuario</li>
                <li>��� Cierre automático por inactividad</li>
                <li>��� Monitoreo de sesiones múltiples</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Volver al Dashboard
          </button>
          
          <button
            onClick={() => {
              // Aquí se implementaría el cierre de sesión
              toast.success(VALIDATION_MESSAGES.SUCCESS.SESION_CERRADA);
              navigate("/");
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
    </div>
  );
};

export default PersistenciaSesion; 