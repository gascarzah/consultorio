import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getHorario } from "../../slices/horarioSlice";
import {HorarioForm} from "../../components";
const EditarHorario = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setError("No se recibió el ID del horario.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    dispatch(getHorario(id))
      .unwrap()
      .then((resultado) => {
        if (isMounted) setHorario(resultado);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "No se pudo cargar el horario.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center py-10">Cargando horario...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center  flex-col ">
      <HorarioForm horario={horario} />
    </div>
  );
};

export default EditarHorario;
