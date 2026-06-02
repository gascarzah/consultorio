import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { eliminarCita, getListaCitados, resetState } from "../../slices/citaSlice";
import { getUsuario } from "../../slices/usuarioSlice";
import { SweetDelete } from "../../utils";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';


const weekday = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

function format(inputDate) {
  let date, month, year;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();

  date = date.toString().padStart(2, "0");

  month = month.toString().padStart(2, "0");

  return `${date}/${month}/${year}`;
}


const ListarConsulta = () => {
  const [globalFilter, setGlobalFilter] = useState('');

  const { user } = useSelector((state) => state.usuario);
  const { email } = useSelector((state) => state.auth);
  const { citas, loading } = useSelector((state) => state.cita);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetState());

    if (email) {
      dispatch(getUsuario(email))
        .unwrap()
        .then((resultado) => {
          if (resultado?.empleado?.empresa?.idEmpresa) {
            dispatch(
              getListaCitados({
                idEmpresa: resultado.empleado.empresa.idEmpresa,
              })
            );
          } else {
            console.error("Falta empresa del usuario");
            toast.error(
              "No se encontró la empresa del usuario. Debe estar vinculado a un empleado con empresa."
            );
          }
        })
        .catch((error) => {
          console.error("Error al obtener usuario:", error);
          toast.error("Error al obtener datos del usuario");
        });
    }
  }, [email, dispatch]);

  const recargarConsultas = () => {
    if (user?.idEmpresa) {
      dispatch(getListaCitados({ idEmpresa: user.idEmpresa }));
    }
  };

  // Regla de negocio definida: "Borrar" en consultas anula la cita asociada.
  const handleEliminarConsulta = (rowData) => {
    if (!rowData?.idCita) return;
    SweetDelete(rowData.idCita, async () => {
      try {
        await dispatch(eliminarCita({ idCita: rowData.idCita })).unwrap();
        recargarConsultas();
      } catch (error) {
        toast.error(error?.message || "No se pudo eliminar la consulta");
      }
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            {/* PrimeReact DataTable */}
            <Card className="mt-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Lista de Consultas</h1>
                <div className="text-sm text-gray-600 font-medium">
                  {weekday[new Date().getDay()]} {format(new Date())}
                </div>
              </div>
              {/* Barra de búsqueda */}
              <div className="mb-6 p-6 bg-gradient-to-r  rounded-xl border  shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex-1 max-w-lg">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="search-input-container">
                          <InputText
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Buscar consultas por paciente, horario..."
                            className="w-full"
                          />
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          {globalFilter && (
                            <button
                              onClick={() => setGlobalFilter('')}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center clear-button"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {globalFilter && (
                          <div className="mt-2 text-sm text-sky-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Buscando: "{globalFilter}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      icon="pi pi-refresh" 
                      className="p-button-sm p-button-outlined" 
                      tooltip="Actualizar"
                      onClick={() => recargarConsultas()}
                    />
                    <Button 
                      icon="pi pi-download" 
                      className="p-button-sm p-button-outlined" 
                      tooltip="Exportar"
                    />
                  </div>
                </div>
              </div>
              
              <DataTable 
                value={citas}
                className="p-datatable-sm"
                emptyMessage={globalFilter ? "No se encontraron resultados para la búsqueda." : "No hay consultas programadas para hoy"}
                globalFilter={globalFilter}
                globalFilterFields={[
                  'horario.descripcion',
                  'programacionDetalle.empleado.nombres',
                  'programacionDetalle.empleado.apellidoPaterno',
                  'programacionDetalle.empleado.apellidoMaterno',
                  'historiaClinica.nombres',
                  'historiaClinica.apellidoPaterno',
                  'historiaClinica.apellidoMaterno',
                  'historiaClinica.numeroDocumento',
                ]}
                loading={loading}
              >
                {/* Debug: Log de citas */}
                <Column 
                  field="horario" 
                  header="Horario"
                  body={(rowData) => rowData?.horario?.descripcion || 'Sin horario'}
                ></Column>
                <Column
                  header="Médico"
                  body={(rowData) => {
                    const e = rowData?.programacionDetalle?.empleado;
                    if (!e) return '—';
                    return `${e.apellidoPaterno ?? ''} ${e.apellidoMaterno ?? ''} ${e.nombres ?? ''}`.trim() || '—';
                  }}
                />
                <Column 
                  field="paciente" 
                  header="Paciente"
                  body={(rowData) => (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-sky-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-sky-800">
                          {rowData?.historiaClinica?.nombres?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {rowData?.historiaClinica?.apellidoPaterno} {rowData?.historiaClinica?.apellidoMaterno}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rowData?.historiaClinica?.nombres}
                        </div>
                      </div>
                    </div>
                  )}
                ></Column>
                <Column 
                  header="Estado" 
                  body={(rowData) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rowData?.atendido 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rowData?.atendido ? 'Atendido' : 'Pendiente'}
                    </span>
                  )}
                ></Column>
                <Column 
                  header="Acciones" 
                  body={(rowData) => (
                    <div className="flex gap-2">
                      {!rowData?.atendido && (
                        <Link
                          to={`/dashboard/agregar-consulta/${rowData?.idCita}/${encodeURIComponent(rowData?.historiaClinica?.numeroDocumento ?? "")}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Registrar Consulta
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => handleEliminarConsulta(rowData)}
                        className="inline-flex items-center px-3 py-2 border border-red-200 text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                      >
                        <i className="pi pi-trash mr-2" />
                        Borrar
                      </button>
                    </div>
                  )}
                ></Column>
              </DataTable>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListarConsulta;
