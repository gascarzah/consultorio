import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getMenu } from "../../slices/menuSlice";
import MenuForm from "../../components/form/MenuForm";

const EditarMenu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setError("No se recibió el ID del menú.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    dispatch(getMenu(id))
      .unwrap()
      .then((resultado) => {
        if (isMounted) setMenu(resultado);
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
    return <div className="text-center py-10">Cargando menú...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center  flex-col ">
      <MenuForm menu={menu} />
    </div>
  );
};

export default EditarMenu;
