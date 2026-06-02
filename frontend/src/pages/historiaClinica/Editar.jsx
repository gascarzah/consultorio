import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {HistoriaClinicaForm} from "../../components";

import { useDispatch } from "react-redux";
import { getHistoriaClinica } from "../../slices/historiaClinicaSlice";

const EditarHistoriaClinica = () => {
  const { numeroDocumento } = useParams();
  const dispatch = useDispatch();
  const [historiaclinica, setHistoriaClinica] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!numeroDocumento) {
      setError("No se recibió el número de documento.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    dispatch(getHistoriaClinica(numeroDocumento))
      .unwrap()
      .then((resultado) => {
        if (isMounted) setHistoriaClinica(resultado);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "No se pudo cargar la historia clínica.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [dispatch, numeroDocumento]);

  if (loading) {
    return <div className="text-center py-10">Cargando historia clínica...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <>
      <h1 className=" text-sky-600 font-black text-3xl capitalize text-center">
        Editar HistoriaClinica
      </h1>

      <HistoriaClinicaForm historiaclinica={historiaclinica} />
    </>
  );
};

export default EditarHistoriaClinica;
