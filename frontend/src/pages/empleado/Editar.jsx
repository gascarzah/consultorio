import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { EmpleadoForm } from "../../components/form/EmpleadoForm";
import { getEmpleado } from "../../slices/empleadoSlice";

const EditarEmpleado = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [empleado, setEmpleado] = useState({});

  useEffect(() => {
    dispatch(getEmpleado(id))
      .unwrap()
      .then((resultado) => {
        setEmpleado(resultado);
      })
      .catch((error) => {
        console.error("Error al cargar empleado:", error);
      });
  }, [dispatch, id]);

  return (
    <div className="flex justify-center items-center  flex-col">
      <EmpleadoForm empleado={empleado} />
    </div>
  );
};

export default EditarEmpleado;
