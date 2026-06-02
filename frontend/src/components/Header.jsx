import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import { getUsuario } from "../slices/usuarioSlice";
import { headerResetState } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export  const Header = () => {
  // const state = useSelector(state => state)
  const { email } = useSelector((state) => state.auth);
  // const { user } = useSelector((state) => state.usuario);
  const [user, setUser] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getUsuario(email))
      .unwrap()
      .then((resultado) => {
        setUser(resultado);
      })
      .catch((errores) => {
        toast.error(errores.message);
      });
  }, [dispatch, email]);

  const handleCerrarSesion = () => {
    headerResetState();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="px-4 py-5 bg-white border-b">
      <div className="md:flex md:justify-between">
        <div>
          <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">
            Consultorio
          </h2>
          <p className="text-xl font-bold">
            {user?.empleado?.apellidoPaterno +
              " " +
              user?.empleado?.apellidoMaterno +
              " " +
              user?.empleado?.nombres}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={handleCerrarSesion}
            type="button"
            className="text-white bg-sky-600 text-sm p-3 rounded-md uppercase font-bold"
          >
            Cerrar session
          </button>
          {/* <div>Header {user.nombreCompleto}</div> */}
        </div>
      </div>
    </header>
  );
};


