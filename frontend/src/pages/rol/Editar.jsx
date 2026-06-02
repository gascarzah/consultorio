import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getRol } from "../../slices/rolSlice";
import RolForm from "../../components/form/RolForm";

const EditarRol = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [rol, setRol] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setError("No se recibió el ID del rol.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    dispatch(getRol(id))
      .unwrap()
      .then((resultado) => {
        if (isMounted) setRol(resultado);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "No se pudo cargar el rol.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center py-10">Cargando rol...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center  flex-col ">
      <RolForm rol={rol} />
    </div>
  );
};

export default EditarRol;
