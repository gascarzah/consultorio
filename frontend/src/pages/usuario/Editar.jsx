import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import UsuarioForm from "../../components/form/UsuarioForm";
import { getUsuarioPorId } from "../../slices/usuarioSlice";

const EditarUsuario = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { usuario, loading } = useSelector((state) => state.usuario);

  useEffect(() => {
    if (id) {
      dispatch(getUsuarioPorId(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <UsuarioForm usuario={usuario} />
    </div>
  );
};

export default EditarUsuario;
