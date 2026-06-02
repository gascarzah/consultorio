import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getEmpresa } from "../../slices/empresaSlice";
import EmpresaForm from "../../components/form/EmpresaForm";

const EditarEmpresa = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [empresa, setEmpresa] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setError("No se recibió el ID de la empresa.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    dispatch(getEmpresa(id))
      .unwrap()
      .then((resultado) => {
        if (isMounted) setEmpresa(resultado);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "No se pudo cargar la empresa.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center py-10">Cargando empresa...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center  flex-col">

      <EmpresaForm empresa={empresa} />
    </div>
  );
};

export default EditarEmpresa;
