import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { eliminarUsuario, getUsuariosPaginado } from "../../slices/usuarioSlice";
import { toast } from "react-toastify";
import { SweetDelete } from "../../utils";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';

const ListarUsuario = () => {
  const { usuarios, total, loading } = useSelector((state) => state.usuario);
  const [listUsuarios, setListUsuarios] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();

  const fetchUsuarios = useCallback(() => {
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchTerm?.trim()) {
      params.search = searchTerm.trim();
    }
    dispatch(getUsuariosPaginado(params));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Debounce: texto de búsqueda aplicado al backend (mismo patrón que otros listados)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm((globalFilter || "").trim());
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [globalFilter]);

  // Actualizar listUsuarios cuando cambien los usuarios del store
  useEffect(() => {
    if (usuarios) {
      setListUsuarios(usuarios);
    }
  }, [usuarios, loading]);

  // Manejar cambio de página
  const handlePageChange = (e) => {
    setCurrentPage(e.page);
    setItemsPerPage(e.rows);
  };

  const recargarUsuarios = () => {
    fetchUsuarios();
  };

  const handleEliminar = (idUsuario) => {
    if (!idUsuario) return;
    SweetDelete(idUsuario, async (id) => {
      try {
        await dispatch(eliminarUsuario(id)).unwrap();
        recargarUsuarios();
      } catch (error) {
        toast.error(error?.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_ELIMINAR);
      }
    });
  };


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
                    placeholder="Buscar usuarios por nombre, empresa, rol..."
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
                      {loading && (
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
                <Link to="/dashboard/listar-usuario/agregar-usuario">
                  <Button 
                    icon="pi pi-plus" 
                    className="p-button-sm p-button-success" 
                    tooltip="Agregar Usuario"
                  />
                </Link>
                <Button 
                  icon="pi pi-refresh" 
                  className="p-button-sm p-button-outlined" 
                  tooltip="Actualizar"
                  loading={loading}
                  onClick={() => fetchUsuarios()}
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
            value={listUsuarios}
            paginator
            rows={itemsPerPage}
            totalRecords={total || 0}
            lazy={true}
            onPage={handlePageChange}
            className="p-datatable-sm"
            emptyMessage={searchTerm ? `No se encontraron usuarios que coincidan con "${searchTerm}"` : "No hay usuarios registrados"}
            loading={loading}
            rowsPerPageOptions={[5, 10, 25, 50]}
            first={currentPage * itemsPerPage}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate={`Mostrando {first} a {last} de {totalRecords} usuarios${searchTerm ? ` (filtrados por "${searchTerm}")` : ''}`}
          >
            {/* <Column 
              field="idUsuario" 
              header="#"
              body={(rowData) => rowData?.idUsuario || 'Sin ID'}
            ></Column> */}
            <Column 
              field="email" 
              header="Email"
              body={(rowData) => rowData?.email || 'Sin email'}
            ></Column>
            <Column 
              field="empresa" 
              header="Empresa"
              body={(rowData) => rowData?.empleado?.empresa?.nombre || 'Sin empresa'}
            ></Column>
            <Column 
              field="documento" 
              header="Documento"
              body={(rowData) => rowData?.empleado?.numeroDocumento || 'Sin documento'}
            ></Column>
            <Column 
              field="nombre" 
              header="Nombre"
              body={(rowData) => {
                const apellidoPaterno = rowData?.empleado?.apellidoPaterno || '';
                const apellidoMaterno = rowData?.empleado?.apellidoMaterno || '';
                const nombres = rowData?.empleado?.nombres || '';
                return `${apellidoPaterno} ${apellidoMaterno}, ${nombres}`.trim() || 'Sin nombre';
              }}
            ></Column>
            <Column 
              field="rol" 
              header="Rol"
              body={(rowData) =>  rowData?.roles?.[0]?.nombre || 'Sin rol'}
            ></Column>
            <Column 
              header="Acciones" 
              body={(rowData) => (
                <div className="flex gap-2">
                  <Link to={`/dashboard/listar-usuario/editar-usuario/${rowData?.idUsuario}`}>
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
                    onClick={() => handleEliminar(rowData?.idUsuario)}
                  />
                </div>
              )}
            ></Column>
          </DataTable>
        </Card>
    </>
  );
};

export default ListarUsuario;
