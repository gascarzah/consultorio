import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ProgramacionForm } from "../../components";
import { getProgramacion } from "../../slices/programacionSlice";

const EditarProgramacion = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [programacion, setProgramacion] = useState({});

  useEffect(() => {
    dispatch(getProgramacion(id))
      .unwrap()
      .then((resultado) => {
        setProgramacion(resultado);
      })
      .catch((error) => {
        console.error("Error al cargar programación:", error);
      });
  }, [dispatch, id]);

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <ProgramacionForm programacion={programacion} />
    </div>
  );
};

export default EditarProgramacion;
