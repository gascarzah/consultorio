// Helper para implementar búsqueda en servidor en listados
export const createListadoLogic = (sliceName, getPaginadoAction, searchFields = []) => {
  return {
    // Estados necesarios
    states: {
      searchTerm: '',
      currentPage: 0,
      itemsPerPage: 5
    },

    // Efectos necesarios
    effects: {
      // Cargar datos inicial
      initialLoad: (dispatch, itemsPerPage) => {
        const params = { page: 0, size: itemsPerPage };
        dispatch(getPaginadoAction(params));
      },

      // Debounce para búsqueda
      debounceSearch: (globalFilter, searchTerm, itemsPerPage, dispatch, getPaginadoAction) => {
        if (globalFilter === searchTerm) return null;
        
        const timeoutId = setTimeout(() => {
          const params = { page: 0, size: itemsPerPage };
          
          if (globalFilter && globalFilter.trim()) {
            params.search = globalFilter.trim();
          }
          
          dispatch(getPaginadoAction(params));
        }, 500);

        return () => clearTimeout(timeoutId);
      },

      // Manejar cambio de página
      handlePageChange: (e, searchTerm, dispatch, getPaginadoAction) => {
        const newPage = e.page;
        const newSize = e.rows;
        
        const params = { page: newPage, size: newSize };
        
        if (searchTerm && searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        
        dispatch(getPaginadoAction(params));
        
        return { newPage, newSize };
      }
    },

    // Configuración del DataTable
    dataTableConfig: (listData, total, loading, searchTerm, currentPage, itemsPerPage, handlePageChange) => ({
      value: listData,
      paginator: true,
      rows: itemsPerPage,
      totalRecords: total || 0,
      lazy: true,
      onPage: handlePageChange,
      className: "p-datatable-sm",
      emptyMessage: searchTerm ? `No se encontraron registros que coincidan con "${searchTerm}"` : "No hay registros",
      loading: loading,
      rowsPerPageOptions: [5, 10, 25, 50],
      first: currentPage * itemsPerPage,
      paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
      currentPageReportTemplate: `Mostrando {first} a {last} de {totalRecords} registros${searchTerm ? ` (filtrados por "${searchTerm}")` : ''}`
    }),

    // Configuración de la barra de búsqueda
    searchBarConfig: (globalFilter, setGlobalFilter, searchTerm, total, loading, placeholder = "Buscar...") => ({
      globalFilter,
      setGlobalFilter,
      searchTerm,
      total,
      loading,
      placeholder
    })
  };
};

