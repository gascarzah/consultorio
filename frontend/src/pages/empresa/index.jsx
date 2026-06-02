import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Modal from "react-modal";
import { Link, Outlet } from "react-router-dom";
import { eliminarEmpresa, getEmpresasPaginado } from "../../slices/empresaSlice";
import { SweetDelete } from "../../utils";

import {Pagination} from "../../components";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { toast } from "react-toastify";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};
// Modal.setAppElement("#root");
const ListarEmpresa = () => {
  const { empresas, prev, next, total, loading } = useSelector((state) => state.empresa);
  const [listEmpresas, setListEmpresas] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [disabledPrev, setDisabledPrev] = useState(false);
  const [disabledNext, setDisabledNext] = useState(false);
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();

  const fetchEmpresas = useCallback(() => {
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchTerm?.trim()) {
      params.search = searchTerm.trim();
    }
    dispatch(getEmpresasPaginado(params));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  // Debounce: texto de búsqueda aplicado al backend
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm((globalFilter || "").trim());
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [globalFilter]);

  // Actualizar lista cuando cambien los datos
  useEffect(() => {
    if (empresas) {
      setListEmpresas(empresas);
    }
  }, [empresas]);

  // Manejar cambio de página
  const handlePageChange = (e) => {
    setCurrentPage(e.page);
    setItemsPerPage(e.rows);
  };

  const handleEliminar = (idEmpresa) => {
    if (!idEmpresa) return;
    SweetDelete(idEmpresa, async (id) => {
      try {
        await dispatch(eliminarEmpresa(id)).unwrap();
        fetchEmpresas();
      } catch (error) {
        toast.error(error?.message || "No se pudo eliminar la empresa");
      }
    });
  };

  return (
    <>

        {/* PrimeReact DataTable */}
        <Card title="Lista de Empresas" className="mt-4">
          {/* Barra de búsqueda */}
          <div className="mb-6 p-6 bg-gradient-to-r  rounded-xl border  shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-lg">
                <div className="search-input-container">
                  <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar empresas por nombre..."
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
                  <div className="mt-2 text-sm text-sky-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Buscando: "{searchTerm}"
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Link to={"agregar-empresa"}>
                  <Button 
                    icon="pi pi-plus" 
                    className="p-button-sm p-button-success" 
                    tooltip="Agregar Empresa"
                  />
                </Link>
                <Button 
                  icon="pi pi-refresh" 
                  className="p-button-sm p-button-outlined" 
                  tooltip="Actualizar"
                  loading={loading}
                  onClick={() => fetchEmpresas()}
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
            value={listEmpresas}
            paginator
            rows={itemsPerPage}
            totalRecords={total || 0}
            lazy={true}
            onPage={handlePageChange}
            className="p-datatable-sm"
            emptyMessage={searchTerm ? `No se encontraron empresas que coincidan con "${searchTerm}"` : "No hay empresas registradas"}
            loading={loading}
            rowsPerPageOptions={[5, 10, 25, 50]}
            first={currentPage * itemsPerPage}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate={`Mostrando {first} a {last} de {totalRecords} empresas${searchTerm ? ` (filtradas por "${searchTerm}")` : ''}`}
          >
            <Column 
              field="idEmpresa" 
              header="#"
              body={(rowData) => rowData?.idEmpresa || 'Sin ID'}
            ></Column>
            <Column 
              field="nombre" 
              header="Nombre"
              body={(rowData) => rowData?.nombre || 'Sin nombre'}
            ></Column>
            <Column 
              header="Acciones" 
              body={(rowData) => (
                <div className="flex gap-2">
                  <Link to={`editar-empresa/${rowData?.idEmpresa}`}>
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
                    onClick={() => handleEliminar(rowData?.idEmpresa)}
                  />
                </div>
              )}
            ></Column>
          </DataTable>
        </Card>
      
    </>
  );
};

export default ListarEmpresa;
