import { useEffect, useState, useMemo, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { PageContainer } from '../components/PageContainer';
import { MyCalendar } from "../components";
import { citasHoy } from "../slices/dashboardSlice";
import { toast } from "react-toastify";

const DashboardCard = memo(({ title, value, icon, color }) => (
  <div className="card">
    <div className={`card-body flex items-center space-x-4 ${color}`}>
      <div className="p-3 rounded-full bg-opacity-20">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
));

const Dashboard = () => {
  const [listadoCitasHoy, setListadoCitasHoy] = useState([]);
  const dispatch = useDispatch();

  const getCitasHoy = useCallback((today) => {
    dispatch(citasHoy(today))
      .unwrap()
      .then((resultado) => {
        setListadoCitasHoy(resultado);
      })
      .catch((errores) => {
        setListadoCitasHoy([]);
        toast.error(errores.message);
      });
  }, [dispatch]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    getCitasHoy(today);
  }, [getCitasHoy]);

  const totalCitasDia = useMemo(() =>
    listadoCitasHoy.reduce((acc, cita) => acc + cita.citados.length, 0), 
    [listadoCitasHoy]
  );

  const totalMedicosDia = useMemo(
    () => listadoCitasHoy.length,
    [listadoCitasHoy]
  );

  const medicosConAgenda = useMemo(
    () => listadoCitasHoy.filter((cita) => cita.citados.length > 0).length,
    [listadoCitasHoy]
  );

  const promedioCitasPorMedico = useMemo(() => {
    if (totalMedicosDia === 0) return "0.0";
    return (totalCitasDia / totalMedicosDia).toFixed(1);
  }, [totalCitasDia, totalMedicosDia]);

  const stats = useMemo(() => [
    {
      title: "Citas Hoy",
      value: totalCitasDia,
      icon: (
        <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-sky-50"
    },
    {
      title: "Médicos del Día",
      value: totalMedicosDia,
      icon: (
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V4H2v16h5m10 0v-2a3 3 0 00-3-3H10a3 3 0 00-3 3v2m10 0H7m10-8a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "bg-red-50"
    },
    {
      title: "Médicos con Agenda",
      value: medicosConAgenda,
      icon: (
        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3m6 8h6m-3-3v6" />
        </svg>
      ),
      color: "bg-yellow-50"
    },
    {
      title: "Prom. Citas/Médico",
      value: promedioCitasPorMedico,
      icon: (
        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V7a1 1 0 012 0v4h4a1 1 0 010 2h-4v4a1 1 0 11-2 0v-4H7a1 1 0 110-2h4z" />
        </svg>
      ),
      color: "bg-purple-50"
    }
  ], [totalCitasDia, totalMedicosDia, medicosConAgenda, promedioCitasPorMedico]);

  return (
    <PageContainer 
      title="Dashboard"
      actionButton={
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            const today = new Date().toISOString().split("T")[0];
            getCitasHoy(today);
          }}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      }
    >
      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <DashboardCard key={index} {...stat} />
          ))}
        </div>

        {/* Acceso Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/dashboard/odontograma"
            className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="card-body flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Odontograma</p>
                <p className="text-sm text-gray-600">Registro dental profesional</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/listar-historia-clinica"
            className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="card-body flex items-center space-x-4 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Historia Clínica</p>
                <p className="text-sm text-gray-600">Gestión de pacientes</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/listar-cita"
            className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="card-body flex items-center space-x-4 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Citas</p>
                <p className="text-sm text-gray-600">Programación de citas</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Contenedor principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendario */}
          <div className="lg:col-span-4">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-sky-900">Calendario</h3>
              </div>
              <div className="card-body">
                <MyCalendar setFechaSelected={() => {}} getCitasHoy={getCitasHoy} />
              </div>
            </div>
          </div>

          {/* Listado de citas */}
          <div className="lg:col-span-8">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-sky-900">Citas del Día</h3>
              </div>
              <div className="card-body">
                {/* Listado de citas del día */}
                {listadoCitasHoy.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Médico
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Horario
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Paciente
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {listadoCitasHoy.flatMap(cita => 
                          cita.citados.map((patient, index) => (
                            <tr key={`${cita.medico}-${index}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cita.medico}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {patient.horario}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {patient.paciente}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                  to={`/dashboard/agregar-consulta/${patient.idCita}/${encodeURIComponent(patient.numeroDocumento ?? "")}`}
                                  className="text-sky-600 hover:text-sky-900"
                                >
                                  Registrar consulta
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas programadas</h3>
                    <p className="mt-1 text-sm text-gray-500">No se encontraron citas para hoy.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;