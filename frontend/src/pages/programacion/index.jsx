import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { eliminarProgramacion, getProgramacionesPaginado } from "../../slices/programacionSlice";
import { SweetDelete } from "../../utils";
import { toast } from "react-toastify";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';

const ListarProgramacion = () => {
  const { programaciones, total, loading } = useSelector((state) => state.programacion);
  const { user } = useSelector((state) => state.usuario);
  const [listProgramaciones, setListProgramaciones] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const { rol } = useSelector((state) => state.auth);
  const isSuper = String(rol?.nombre || "").toUpperCase() === "SUPER";
  const empresaId = user?.idEmpresa || null;

  const recargarProgramaciones = () => {
    if (!empresaId && !isSuper) return;
    dispatch(getProgramacionesPaginado({
      page: currentPage,
      size: itemsPerPage,
      idEmpresa: empresaId || 1,
      ...(searchTerm?.trim() ? { search: searchTerm.trim() } : {}),
    }));
  };

  useEffect(() => {
    if (!empresaId && !isSuper) return;
    const params = { 
      page: currentPage, 
      size: itemsPerPage,
      idEmpresa: empresaId || 1,
      ...(searchTerm?.trim() ? { search: searchTerm.trim() } : {}),
    };
    dispatch(getProgramacionesPaginado(params));
  }, [dispatch, currentPage, itemsPerPage, empresaId, searchTerm, isSuper]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      setSearchTerm(globalFilter);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [globalFilter]);
  const handleEliminarProgramacion = (idProgramacion) => {
    if (!idProgramacion) return;

    SweetDelete(idProgramacion, async (id) => {
      try {
        await dispatch(eliminarProgramacion(id)).unwrap();
        recargarProgramaciones();
      } catch (error) {
        toast.error(error?.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_ELIMINAR);
      }
    });
  };


  useEffect(() => {
    
    if (programaciones) {
      setListProgramaciones(programaciones);
    }
  }, [programaciones]);


  return (
    <>

        {/* PrimeReact DataTable */}
        <Card className="shadow-sm border border-gray-200">
          {/* Barra de búsqueda */}
          <div className="mb-6 p-6 bg-gradient-to-r  rounded-xl border  shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-lg">
                <div className="search-input-container">
                  <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar programaciones por fecha, estado..."
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
              <div className="flex gap-2">
                <Link to={"agregar-programacion"}>
                  <Button 
                    icon="pi pi-plus" 
                    className="p-button-sm p-button-success" 
                    tooltip="Generar Programación"
                  />
                </Link>
                <Button 
                  icon="pi pi-refresh" 
                  className="p-button-sm p-button-outlined" 
                  tooltip="Actualizar"
                  onClick={recargarProgramaciones}
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
            value={listProgramaciones}
            paginator
            rows={itemsPerPage}
            totalRecords={total || 0}
            lazy
            onPage={(e) => {
              setCurrentPage(e.page);
              setItemsPerPage(e.rows);
            }}
            className="p-datatable-sm"
            emptyMessage={globalFilter ? "No se encontraron resultados para la búsqueda." : "No hay programaciones registradas"}
            loading={loading}
            rowsPerPageOptions={[5, 10, 25, 50]}
            first={currentPage * itemsPerPage}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} programaciones"
            globalFilter={globalFilter}
            globalFilterFields={['idProgramacion', 'strFechaInicial', 'strFechaFinal', 'rango']}
          >
            <Column 
              field="idProgramacion" 
              header="#"
              body={(rowData) => rowData?.idProgramacion || 'Sin ID'}
            ></Column>
            <Column 
              field="strFechaInicial" 
              header="Fecha Inicio"
              body={(rowData) => rowData?.strFechaInicial || 'Sin fecha'}
            ></Column>
            <Column 
              field="strFechaFinal" 
              header="Fecha Fin"
              body={(rowData) => rowData?.strFechaFinal || 'Sin fecha'}
            ></Column>
            <Column 
              header="Estado" 
              body={(rowData) => (
                <Tag 
                  value={rowData?.activo ? "ACTIVO" : "DESACTIVO"} 
                  severity={rowData?.activo ? "success" : "danger"} 
                  icon={rowData?.activo ? "pi pi-check" : "pi pi-times"}
                />
              )}
            ></Column>
            <Column 
              header="Acciones" 
              body={(rowData) => (
                <div className="flex gap-2">
                  <Link to={`editar-programacion/${rowData?.idProgramacion}`}>
                    <Button 
                      icon="pi pi-pencil" 
                      className="p-button-sm p-button-text p-button-warning" 
                      tooltip="Editar"
                      tooltipOptions={{ position: 'top' }}
                    />
                  </Link>
                  <Button 
                    icon="pi pi-trash" 
                    className="p-button-sm p-button-text p-button-danger" 
                    tooltip="Eliminar"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => handleEliminarProgramacion(rowData?.idProgramacion)}
                  />
                </div>
              )}
            ></Column>
          </DataTable>
        </Card>
     
    </>
  );
};

export default ListarProgramacion;
