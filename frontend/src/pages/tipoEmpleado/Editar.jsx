import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import TipoEmpleadoForm from "../../components/form/TipoEmpleadoForm";

import { getTipoEmpleado } from "../../slices/tipoEmpleadoSlice";

const EditarTipoEmpleado = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [tipoEmpleado, setTipoEmpleado] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setError("No se recibió el ID del tipo de empleado.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    dispatch(getTipoEmpleado(id))
      .unwrap()
      .then((resultado) => {
        if (isMounted) setTipoEmpleado(resultado);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_CARGAR);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center py-10">Cargando tipo de empleado...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center  flex-col ">
      <TipoEmpleadoForm tipoEmpleado={tipoEmpleado} />
    </div>
  );
};

export default EditarTipoEmpleado;
