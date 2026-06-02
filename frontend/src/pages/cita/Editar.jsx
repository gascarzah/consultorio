import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";


import { getCita } from "../../slices/citaSlice";
import { CitaForm } from "../../components";

const EditarCita = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cita, loading } = useSelector((state) => state.cita);
  useEffect(() => {
    
    if (id) {
      dispatch(getCita(id));
    } else {
      console.error("No se recibió ID para cargar la cita");
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <CitaForm cita={cita} />
    </div>
  );
};

export default EditarCita;
