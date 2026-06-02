
import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { ITEMS_POR_PAGINA } from "../utils";

export const usePagination= (elementos, prev, next, functionPaginado, idEmpresa) => {
    const [listElementos, setListElementos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_POR_PAGINA);
    const [disabledPrev, setDisabledPrev] = useState(false);
    const [disabledNext, setDisabledNext] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
      if (!idEmpresa) {
        dispatch(functionPaginado({ page: currentPage, size: itemsPerPage }));
      } else {
        dispatch(functionPaginado({ idEmpresa, page: currentPage, size: itemsPerPage }));
      }
    }, [currentPage, dispatch, functionPaginado, idEmpresa, itemsPerPage]);

    useEffect(() => {
        if (elementos) {
          setListElementos(elementos);
          setDisabledPrev(prev);
          setDisabledNext(next);
        }
      }, [elementos, next, prev]);
    

    
      const handlePrev = () => {
        if (!disabledPrev) {
          setCurrentPage(currentPage - 1);
        }
      };
      const handleNext = () => {
        if (!disabledNext) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      return {
        handlePrev,
        handleNext,
        currentPage,
        setCurrentPage,
        listElementos,
        setListElementos,
        itemsPerPage,
        disabledPrev,
        setDisabledPrev,
        disabledNext,
        setDisabledNext
      }
}