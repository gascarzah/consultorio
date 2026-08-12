import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CategoriaMenuForm from "../../components/form/CategoriaMenuForm";
import { getCategoriaMenu } from "../../slices/categoriaMenuSlice";

const EditarCategoriaMenu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [categoriaMenu, setCategoriaMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (!id) {
      setError("No se recibió el ID de la categoría.");
      setLoading(false);
      return;
    }

    dispatch(getCategoriaMenu(id))
      .unwrap()
      .then((resultado) => {
        if (isMounted) setCategoriaMenu(resultado);
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

  if (loading) return <div className="text-center py-10">Cargando categoría...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="flex justify-center items-center flex-col">
      <CategoriaMenuForm categoriaMenu={categoriaMenu} />
    </div>
  );
};

export default EditarCategoriaMenu;
