import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { toast } from "react-toastify";
import { SweetDelete } from "../../utils";
import {
  eliminarCategoriaMenu,
  getCategoriasMenuPaginado,
} from "../../slices/categoriaMenuSlice";

const ListarCategoriaMenu = () => {
  const { categoriasMenu, total, loading } = useSelector((state) => state.categoriaMenu);
  const [listCategorias, setListCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getCategoriasMenuPaginado({
        page: currentPage,
        size: itemsPerPage,
        ...(searchTerm?.trim() ? { search: searchTerm.trim() } : {}),
      })
    );
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      setSearchTerm(globalFilter);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [globalFilter]);

  useEffect(() => {
    if (categoriasMenu) {
      setListCategorias(categoriasMenu);
    }
  }, [categoriasMenu]);

  const recargar = () => {
    dispatch(
      getCategoriasMenuPaginado({
        page: currentPage,
        size: itemsPerPage,
        ...(searchTerm?.trim() ? { search: searchTerm.trim() } : {}),
      })
    );
  };

  const handleEliminar = (idCategoria) => {
    SweetDelete(idCategoria, async (id) => {
      try {
        await dispatch(eliminarCategoriaMenu(id)).unwrap();
        recargar();
      } catch (error) {
        toast.error(error?.message || "No se pudo eliminar la categoría");
      }
    });
  };

  return (
    <Card title="Lista de Categorías de Menú" className="mt-4">
      <div className="mb-6 p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-lg">
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar categorías por nombre..."
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Link to="agregar-categoria-menu">
              <Button icon="pi pi-plus" className="p-button-sm p-button-success" tooltip="Agregar Categoría" />
            </Link>
            <Button icon="pi pi-refresh" className="p-button-sm p-button-outlined" tooltip="Actualizar" onClick={recargar} />
          </div>
        </div>
      </div>

      <DataTable
        value={listCategorias}
        paginator
        rows={itemsPerPage}
        totalRecords={total || 0}
        lazy
        onPage={(e) => {
          setCurrentPage(e.page);
          setItemsPerPage(e.rows);
        }}
        className="p-datatable-sm"
        emptyMessage="No hay categorías registradas"
        loading={loading}
        rowsPerPageOptions={[5, 10, 25, 50]}
        first={currentPage * itemsPerPage}
      >
        <Column field="idCategoria" header="#" />
        <Column field="nombre" header="Nombre" />
        <Column field="orden" header="Orden" />
        <Column
          header="Estado"
          body={(rowData) => (
            <Tag
              value={rowData?.activo ? "ACTIVO" : "INACTIVO"}
              severity={rowData?.activo ? "success" : "danger"}
            />
          )}
        />
        <Column
          header="Acciones"
          body={(rowData) => (
            <div className="flex gap-2">
              <Link to={`editar-categoria-menu/${rowData?.idCategoria}`}>
                <Button icon="pi pi-pencil" className="p-button-sm p-button-text p-button-warning" />
              </Link>
              <Button
                icon="pi pi-trash"
                className="p-button-sm p-button-text p-button-danger"
                onClick={() => handleEliminar(rowData?.idCategoria)}
              />
            </div>
          )}
        />
      </DataTable>
    </Card>
  );
};

export default ListarCategoriaMenu;
