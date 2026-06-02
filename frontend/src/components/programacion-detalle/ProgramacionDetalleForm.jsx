import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Switch from "react-switch";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { useDispatch, useSelector } from "react-redux";

import { getEmpleadosPorEmpresa,  } from "../../slices/empleadoSlice";
import { getUsuario } from "../../slices/usuarioSlice";

import {
  modificarProgramacionDetalle,
  registrarProgramacionDetalle,
  resetState
} from "../../slices/programacionDetalleSlice";
import { getProgramacionActivo } from "../../slices/programacionSlice";
import { LISTAR_PROGRAMACION_DETALLE, MENSAJE_GUARDADO_EXITOSO, MENSAJE_MODIFICADO_EXITOSO } from "../../utils";
import { SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";

import { toast } from "react-toastify";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

registerLocale("es", es);

const programacionDetalleSchema = Yup.object().shape({
  idEmpleado: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.MEDICO),
});

export const ProgramacionDetalleForm = ({ programacionDetalle }) => {
  const { empleados } = useSelector((state) => state.empleado);
  const { user } = useSelector((state) => state.usuario);
  const { email } = useSelector((state) => state.auth);
  const arrChecked = programacionDetalle?.listaDias ?? "";
  const [programacion, setProgramacion] = useState();
  const [dias, setDias] = useState([]);
  const [checkedLunes, setCheckedLunes] = useState(false);
  const [checkedMartes, setCheckedMartes] = useState(false);
  const [checkedMiercoles, setCheckedMiercoles] = useState(false);
  const [checkedJueves, setCheckedJueves] = useState(false);
  const [checkedViernes, setCheckedViernes] = useState(false);
  const [checkedSabado, setCheckedSabado] = useState(false);
  const [checkedState, setCheckedState] = useState(
    new Array(dias.length).fill(false)
  );

  const estado = true;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChangeLunes = (checked) => {
    setCheckedLunes(checked);
  };
  const handleChangeMartes = (checked) => {
    setCheckedMartes(checked);
  };
  const handleChangeMiercoles = (checked) => {
    setCheckedMiercoles(checked);
  };
  const handleChangeJueves = (checked) => {
    setCheckedJueves(checked);
  };
  const handleChangeViernes = (checked) => {
    setCheckedViernes(checked);
  };
  const handleChangeSabado = (checked) => {
    setCheckedSabado(checked);
  };
  useEffect(() => {
    dispatch(getProgramacionActivo())
      .unwrap()
      .then((resultado) => {
        setProgramacion(resultado);
      })
      .catch((errores) => {
        // Manejo de errores silencioso
      });
  }, [dispatch]);

  useEffect(() => {
    if (email) {
      dispatch(getUsuario(email));
    }
  }, [dispatch, email]);

  useEffect(() => {
    if (user?.idEmpresa) {
      dispatch(getEmpleadosPorEmpresa(user.idEmpresa));
    }
  }, [dispatch, user?.idEmpresa]);

  useEffect(() => {
    if (arrChecked) {
      setCheckedLunes(arrChecked[0]);
      setCheckedMartes(arrChecked[1]);
      setCheckedMiercoles(arrChecked[2]);
      setCheckedJueves(arrChecked[3]);
      setCheckedViernes(arrChecked[4]);
      setCheckedSabado(arrChecked[5]);
    }
  }, [arrChecked]);

  const handleSubmit = (values, resetForm) => {
    if (!user?.idEmpresa) {
      toast.error("No se pudo obtener la empresa del usuario");
      return;
    }

    values.checked = [
      checkedLunes ? 0 : "",
      checkedMartes ? 1 : "",
      checkedMiercoles ? 2 : "",
      checkedJueves ? 3 : "",
      checkedViernes ? 4 : "",
      checkedSabado ? 5 : "",
    ];

    if (!programacionDetalle) {
      dispatch(
        registrarProgramacionDetalle({ ...values, idEmpresa: user.idEmpresa })
      )
        .unwrap()
        .then((resultado) => {
          resetForm();
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
          dispatch(resetState());
          navigate(LISTAR_PROGRAMACION_DETALLE);
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo guardar');
        });
    } else {
      dispatch(
        modificarProgramacionDetalle({ ...values, idEmpresa: user.idEmpresa })
      )
        .unwrap()
        .then((resultado) => {
          resetForm();
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS);
          dispatch(resetState());
          navigate(LISTAR_PROGRAMACION_DETALLE);
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo modificar');
        });
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          // numeroDocumento:
          //   programacionDetalle?.empleado?.idEmpleado.numeroDocumento ?? "",
          idEmpleado: programacionDetalle?.empleado?.idEmpleado ?? "",
          checked: [],
          idProgramacion: programacion?.idProgramacion,
          idProgramacionDetalle: programacion?.idProgramacion,
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
          //resetForm();
        }}
        validationSchema={programacionDetalleSchema}
      >
        {({ errors, touched, values, handleChange, setFieldValue }) => {
          return (
            <Form className="my-10 bg-white shadow rounded p-10 w-2/5  ">
              <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
                {programacionDetalle?.idProgramacionDetalle ? "Editar Programación Detalle" : "Registrar Programación Detalle"}
              </h1>
              <div className="flex flex-row gap-10">
                <div className="my-3 flex flex-col justify-evenly ">
                  <label
                    htmlFor="rango"
                    className="uppercase text-gray-600 block font-bold"
                  >
                    Fechas programadas
                  </label>
                  <span className="flex flex-row gap-7 mt-6">
                    {"Del"}
                    <h3 className="font-bold">
                      {programacion?.strFechaInicial}
                    </h3>
                    {"al"}
                    <h3 className="font-bold">{programacion?.strFechaFinal}</h3>
                  </span>
                </div>
              </div>
              <div className="my-3">
                <label
                  htmlFor="numeroDocumento"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Medico
                </label>
                <select
                  name="idEmpleado"
                  value={values.idEmpleado}
                  onChange={async (e) => {
                    const { value } = e.target;
                    setFieldValue("idEmpleado", value);
                    // handleVerificarProgramacion(value);
                  }}
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  style={{ display: "block" }}
                >
                  <option value="" label="Selecciona medico">
                    Selecciona un Medico{" "}
                  </option>

                  {empleados.length > 0 &&
                    empleados?.map((empleado, index) => {
                      
                      return (
                        <option
                          key={empleado.idEmpleado}
                          value={empleado.idEmpleado}
                        >
                          {empleado.apellidoPaterno}{" "}
                          {empleado.apellidoMaterno},{" "}
                          {empleado.nombres}
                        </option>
                      );
                    })}
                </select>
                <ErrorMessage
                  name="idEmpleado"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-3   ">
                <label
                  htmlFor="nombre"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Horario
                </label>
              </div>

              <div className="flex justify-between py-4">
                <label>
                  <Switch
                    checked={checkedLunes}
                    onChange={handleChangeLunes}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    className="react-switch"
                  />
                  Lunes
                </label>
                <label>
                  <Switch
                    checked={checkedMartes}
                    onChange={handleChangeMartes}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    className="react-switch"
                  />
                  Martes
                </label>
                <label>
                  <Switch
                    checked={checkedMiercoles}
                    onChange={handleChangeMiercoles}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    className="react-switch"
                  />
                  Miercoles
                </label>
                <label>
                  <Switch
                    checked={checkedJueves}
                    onChange={handleChangeJueves}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    className="react-switch"
                  />
                  Jueves
                </label>
                <label>
                  <Switch
                    checked={checkedViernes}
                    onChange={handleChangeViernes}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    className="react-switch"
                  />
                  Viernes
                </label>
                <label>
                  <Switch
                    checked={checkedSabado}
                    onChange={handleChangeSabado}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    className="react-switch"
                  />
                  Sabado
                </label>
              </div>

              <div className="flex-1">
                <input
                  type="submit"
                  value="Registrar Programacion"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};


