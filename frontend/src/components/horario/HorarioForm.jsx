import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  modificarHorario,
  registrarHorario,
  resetState,
} from "../../slices/horarioSlice";
import { getEmpresas } from "../../slices/empresaSlice";
import { LISTAR_HORARIO, SweetCrud, SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS } from "../../utils";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";


const horarioSchema = Yup.object().shape({
  descripcion: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.DESCRIPCION_HORARIO),
});

export const HorarioForm = ({ horario }) => {
  const { user } = useSelector((state) => state.usuario);
  const { rol } = useSelector((state) => state.auth);
  const { empresas } = useSelector((state) => state.empresa);
  const isSuper = String(rol?.nombre || "").toUpperCase() === "SUPER";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuper) {
      dispatch(getEmpresas());
    }
  }, [dispatch, isSuper]);

  const handleSubmit = (values, resetForm) => {
    const idEmpresaToSend = isSuper
      ? Number(values.idEmpresa)
      : Number(user?.idEmpresa || horario?.idEmpresa || values.idEmpresa);

    if (!idEmpresaToSend) {
      SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, VALIDATION_MESSAGES.ERROR.EMPRESA_NO_DETERMINADA);
      return;
    }

    const payload = { ...values, idEmpresa: idEmpresaToSend };

    if (!values.idHorario) {
      dispatch(registrarHorario(payload))
        .unwrap()
        .then(() => {
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS)
          dispatch(resetState())
          navigate(LISTAR_HORARIO);
        })
        .catch((errores) => {
          SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, errores.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_PROCESAR);
          
        });
    } else {
      dispatch(modificarHorario(payload))
        .unwrap()
        .then(() => {
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS)
          dispatch(resetState())
          navigate(LISTAR_HORARIO);
        })
        .catch((errores) => {
          SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, errores.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_PROCESAR);
          
        });
    }
  };


  return (
    <>
      <Formik
        initialValues={{
          idHorario: horario?.idHorario,
          descripcion: horario?.descripcion || "",
          idEmpresa: String(horario?.idEmpresa ?? (isSuper ? "" : user?.idEmpresa ?? "")),
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
          //resetForm();
        }}
        validationSchema={Yup.object().shape({
          descripcion: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.DESCRIPCION_HORARIO),
          idEmpresa: isSuper
            ? Yup.string().required(VALIDATION_MESSAGES.REQUIRED.EMPRESA)
            : Yup.string().nullable(),
        })}
      >
        {({ errors, touched, values, handleChange }) => {
          return (
            <Form className=" my-10 bg-white shadow rounded p-10 flex flex-col w-2/5   ">
              {isSuper && (
                <div className="my-3">
                  <label
                    htmlFor="idEmpresa"
                    className="uppercase text-gray-600 block font-bold"
                  >
                    Empresa
                  </label>
                  <Field
                    as="select"
                    id="idEmpresa"
                    name="idEmpresa"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  >
                    <option value="">Selecciona una Empresa</option>
                    {empresas?.map((empresa) => (
                      <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                        {empresa.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="idEmpresa"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
              <div className="my-3">
                <label
                  htmlFor="descripcion"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Descripcion
                </label>
                <Field
                  id="descripcion"
                  type="text"
                  placeholder="Descripcion"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  style={{ display: "block" }}
                  name={"descripcion"}
                />
                <ErrorMessage
                  name="descripcion"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="">
                <input
                  type="submit"
                  value={horario?.idHorario ? "Actualizar Horario" : "Registrar Horario"}
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
