import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { useState, useEffect, useRef } from "react";

import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getProgramacionDetallePorId } from "../../slices/programacionDetalleSlice";
import {ProgramacionDetalleForm} from "../../components";

const EditarProgramacionDetalle = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [programacionDetalle, setProgramacionDetalle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestedIdRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setError("No se recibió el ID de programación detalle.");
      setLoading(false);
      return;
    }
    if (requestedIdRef.current === id) {
      return;
    }
    requestedIdRef.current = id;

    setLoading(true);
    setError("");
    dispatch(getProgramacionDetallePorId(id))
      .unwrap()
      .then((resultado) => {
        if (isMounted) setProgramacionDetalle(resultado);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err?.status === 404) {
          setError(err?.message || "No existe programación detalle para este ID.");
          return;
        }
        setError(err?.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_CARGAR);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center py-10">Cargando programación detalle...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center  flex-col ">
      <ProgramacionDetalleForm programacionDetalle={programacionDetalle} />
    </div>
  );
};

export default EditarProgramacionDetalle;
