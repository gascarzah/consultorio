import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Modal from "react-modal";
import { eliminarEmpleado, getEmpleadosPaginado } from "../../slices/empleadoSlice";

import { Link, useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { toast } from "react-toastify";
import { SweetDelete } from "../../utils";

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     transform: "translate(-50%, -50%)",
//   },
// };
// Modal.setAppElement("#root");
const ListarEmpleado = () => {
  const { empleados, total, loading } = useSelector(
    (state) => state.empleado
  );
  const [listEmpleados, setListEmpleados] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // const [modal, setModal] = useState(false); // NO UTILIZADO ACTUALMENTE
  // const [informe, setInforme] = useState(null); // NO UTILIZADO ACTUALMENTE

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchEmpleados = useCallback(() => {
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchTerm?.trim()) {
      params.search = searchTerm.trim();
    }
    dispatch(getEmpleadosPaginado(params));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  // Debounce: texto de búsqueda aplicado al backend
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm((globalFilter || "").trim());
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [globalFilter]);

  const handleEditar = (empleado) => {
    
    if (empleado.idEmpleado) {
      navigate(`/dashboard/listar-empleado/editar-empleado/${empleado.idEmpleado}`);
    } else {
      toast.error('No se pudo obtener el ID del empleado');
    }
  };

  // Actualizar listEmpleados cuando cambien los empleados del store
  useEffect(() => {
    if (empleados) {
      setListEmpleados(empleados);
    }
  }, [empleados, loading]);

  // Manejar cambio de página
  const handlePageChange = (e) => {
    setCurrentPage(e.page);
    setItemsPerPage(e.rows);
  };

  const recargarEmpleados = () => {
    fetchEmpleados();
  };

  const handleEliminar = (idEmpleado) => {
    if (!idEmpleado) return;
    SweetDelete(idEmpleado, async (id) => {
      try {
        await dispatch(eliminarEmpleado(id)).unwrap();
        recargarEmpleados();
      } catch (error) {
        toast.error(error?.message || "No se pudo eliminar el empleado");
      }
    });
  };

  // Funciones de paginación personalizada - DESHABILITADAS (usando PrimeReact)
  // const handlePrev = () => {
  //   if (!disabledPrev) {
  //     const pagina = currentPage - 1;
  //     setCurrentPage(currentPage - 1);
  //     pagination(pagina);
  //   }
  // };
  // const handleNext = () => {
  //   if (!disabledNext) {
  //     const pagina = currentPage + 1;
  //     setCurrentPage(pagina);
  //     pagination(pagina);
  //   }
  // };

  // Función de paginación personalizada - DESHABILITADA (usando PrimeReact)
  // const pagination = (pagina) => {
  //   dispatch(
  //     getEmpleadosPaginado({
  //       page: pagina,
  //       size: itemsPerPage,
  //     })
  //   );
  // };

  // Funciones de modal - NO UTILIZADAS ACTUALMENTE
  // const handleChangeModal = (informe) => {
  //   setModal(!modal);
  //   setInforme(informe);
  // };
  // function closeModal() {
  //   setModal(false);
  // }

  return (
    <>
      {/* PrimeReact DataTable */}
        <Card title="Lista de Empleados" className="mt-4">
          {/* Barra de búsqueda */}
          <div className="mb-6 p-6 bg-gradient-to-r  rounded-xl border  shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-lg">

                <div className="search-input-container">
                  <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar empleados por nombre, apellido, email..."
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
                <Link to={"agregar-empleado"}>
                  <Button 
                    icon="pi pi-plus" 
                    className="p-button-sm p-button-success" 
                    tooltip="Agregar Empleado"
                  />
                </Link>
                <Button 
                  icon="pi pi-refresh" 
                  className="p-button-sm p-button-outlined" 
                  tooltip="Actualizar"
                  loading={loading}
                  onClick={() => fetchEmpleados()}
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
            value={listEmpleados}
            paginator
            rows={itemsPerPage}
            totalRecords={total || 0}
            lazy={true}
            onPage={handlePageChange}
            className="p-datatable-sm"
            emptyMessage={searchTerm ? `No se encontraron empleados que coincidan con "${searchTerm}"` : "No hay empleados registrados"}
            loading={loading}
            rowsPerPageOptions={[5, 10, 25, 50]}
            first={currentPage * itemsPerPage}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate={`Mostrando {first} a {last} de {totalRecords} empleados${searchTerm ? ` (filtrados por "${searchTerm}")` : ''}`}
          >
            <Column 
              field="apellidoPaterno" 
              header="Apellido Paterno"
            ></Column>
            <Column 
              field="apellidoMaterno" 
              header="Apellido Materno"
            ></Column>
            <Column 
              field="nombres" 
              header="Nombres"
            ></Column>
            {/* <Column 
              field="email" 
              header="Email"
            ></Column> */}
            <Column 
              field="direccion" 
              header="Dirección"
            ></Column>
            <Column 
              header="Estado" 
              body={() => (
                <Tag 
                  value="Activo" 
                  severity="success" 
                  icon="pi pi-check"
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
                      onClick={() => handleEliminar(rowData?.idEmpleado)}
                    />
                  </div>
                );
              }}
            ></Column>
          </DataTable>
          
        </Card>
        {/* Paginación personalizada - DESHABILITADA (usando PrimeReact) */}
        {/* {total && total > ITEMS_POR_PAGINA && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Mostrando {listEmpleados.length} de {total} empleados
            </div>
            <Pagination
              totalPosts={total}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              handlePrev={handlePrev}
              handleNext={handleNext}
              disabledPrev={disabledPrev}
              setDisabledPrev={setDisabledPrev}
              disabledNext={disabledNext}
              setDisabledNext={setDisabledNext}
            />
          </div>
        )} */}

      {/* {modal && (
        <Modal
          isOpen={modal}
          style={customStyles}
          onRequestClose={closeModal}
          contentLabel="Detalle 24/09/2021"
        >
          <AgregarCliente />
        </Modal>
      )} */}
    </>
  );
};

export default ListarEmpleado;
