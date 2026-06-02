
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { eliminarCita, getCitasPaginado } from "../../slices/citaSlice";
import { SweetDelete } from "../../utils";
import { toast } from "react-toastify";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';


const ListarCita = () => {
  const { citas, total, loading } = useSelector((state) => state.cita);
  const [listCitas, setListCitas] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditar = (cita) => {
    
    if (cita.idCita) {
      const url = `/dashboard/listar-cita/editar-cita/${cita.idCita}`;
      navigate(url);
    } else {
      toast.error('No se pudo obtener el ID de la cita');
    }
  };

  const fetchCitas = useCallback(() => {
    setIsSearching(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchTerm?.trim()) {
      params.search = searchTerm.trim();
    }
    dispatch(getCitasPaginado(params));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  const handleEliminar = (rowData) => {
    if (!rowData?.idCita) return;
    SweetDelete(rowData.idCita, async () => {
      try {
        await dispatch(eliminarCita({ idCita: rowData.idCita })).unwrap();
        fetchCitas();
      } catch (error) {
        toast.error(error?.message || "No se pudo eliminar la cita");
      }
    });
  };

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  // Debounce: texto de búsqueda aplicado al backend
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm((globalFilter || "").trim());
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [globalFilter]);

  // Actualizar listCitas cuando cambien las citas del store
  useEffect(() => {
    if (citas) {
      setListCitas(citas);
    }
    setIsSearching(false);
  }, [citas, loading]);

  // Manejar cambio de página
  const handlePageChange = (e) => {
    setCurrentPage(e.page);
    setItemsPerPage(e.rows);
  };
  
   
  
  return (
    <>
      

        {/* PrimeReact DataTable */}
        <Card title="Lista de Citas" className="mt-4">
          {/* Barra de búsqueda */}
          <div className="mb-6 p-6 bg-gradient-to-r  rounded-xl border  shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-lg">
                <div className="search-input-container">
                  <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar citas por cliente, doctor, especialidad..."
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
                {searchTerm && (
                  <div className="mt-2 text-sm text-sky-600 flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Buscando: "{searchTerm}"
                      {isSearching && (
                        <div className="ml-2 animate-spin">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="text-xs bg-sky-100 px-2 py-1 rounded-full">
                      {total || 0} resultado{(total || 0) !== 1 ? 's' : ''} encontrado{(total || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Link to={"agregar-cita"}>
                  <Button 
                    icon="pi pi-plus" 
                    className="p-button-sm p-button-success" 
                    tooltip="Agregar Cita"
                  />
        </Link>
                <Button 
                  icon="pi pi-refresh" 
                  className="p-button-sm p-button-outlined" 
                  tooltip="Actualizar"
                  loading={loading}
                  onClick={() => fetchCitas()}
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
            value={listCitas}
            paginator
            rows={itemsPerPage}
            totalRecords={total || 0}
            lazy={true}
            onPage={handlePageChange}
            className="p-datatable-sm"
            emptyMessage={searchTerm ? `No se encontraron citas que coincidan con "${searchTerm}"` : "No hay citas registradas"}
            loading={loading}
            rowsPerPageOptions={[5, 10, 25, 50]}
            first={currentPage * itemsPerPage}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate={`Mostrando {first} a {last} de {totalRecords} citas${searchTerm ? ` (filtradas por "${searchTerm}")` : ''}`}
          >
            <Column 
              field="dia" 
              header="Día"
              body={(rowData) => rowData?.programacionDetalle?.diaSemana || 'Sin día'}
            ></Column>
            <Column 
              field="fecha" 
              header="Fecha"
              body={(rowData) => {
                const fecha = rowData?.programacionDetalle?.fecha;
                if (!fecha) return 'Sin fecha';
                
                // Convertir de yyyy-mm-dd a dd/mm/yyyy
                const fechaFormateada = fecha.split('-').reverse().join('/');
                return fechaFormateada;
              }}
            ></Column>
            <Column 
              field="horario" 
              header="Horario"
              body={(rowData) => rowData?.horario?.descripcion || 'Sin horario'}
            ></Column>
            <Column 
              field="cliente" 
              header="Cliente"
              body={(rowData) => {
                const apellidoPaterno = rowData?.historiaClinica?.apellidoPaterno || '';
                const apellidoMaterno = rowData?.historiaClinica?.apellidoMaterno || '';
                const nombres = rowData?.historiaClinica?.nombres || '';
                return `${apellidoPaterno} ${apellidoMaterno} ${nombres}`.trim() || 'Sin cliente';
              }}
            ></Column>
            <Column 
              field="doctor" 
              header="Doctor"
              body={(rowData) => {
                const apellidoPaterno = rowData?.programacionDetalle?.empleado?.apellidoPaterno || '';
                const apellidoMaterno = rowData?.programacionDetalle?.empleado?.apellidoMaterno || '';
                const nombres = rowData?.programacionDetalle?.empleado?.nombres || '';
                return `${apellidoPaterno} ${apellidoMaterno} ${nombres}`.trim() || 'Sin doctor';
              }}
            ></Column>
            <Column 
              field="especialidad" 
              header="Especialidad"
              body={(rowData) => rowData?.programacionDetalle?.empleado?.tipoEmpleado?.nombre || 'Sin especialidad'}
            ></Column>
            <Column 
              header="Estado" 
              body={() => (
                <Tag 
                  value="Programada" 
                  severity="info" 
                  icon="pi pi-calendar"
                />
              )}
            ></Column>
            <Column 
              header="Acciones" 
              body={(rowData) => {
                return (
                  <div className="flex gap-2">
                    <Button 
                      icon="pi pi-pencil" 
                      className="p-button-sm p-button-text p-button-warning" 
                      tooltip="Editar"
                      tooltipOptions={{ position: 'top' }}
                      onClick={() => handleEditar(rowData)}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-sm p-button-text p-button-danger"
                      tooltip="Eliminar"
                      tooltipOptions={{ position: 'top' }}
                      onClick={() => handleEliminar(rowData)}
                    />
                  </div>
                );
              }}
            ></Column>
          </DataTable>
        </Card>
     
    </>
  );
};

export default ListarCita;
