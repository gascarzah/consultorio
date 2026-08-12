import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import DatePicker from "react-datepicker";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { useDispatch, useSelector } from "react-redux";
import { modificarProgramacion, registrarProgramacion } from "../../slices/programacionSlice";
import { getEmpresas } from "../../slices/empresaSlice";
import { LISTAR_PROGRAMACION, MENSAJE_GUARDADO_EXITOSO, MENSAJE_MODIFICADO_EXITOSO, SWEET_GUARDO, SweetCrud } from "../../utils";
import { SWEET_MODIFICO, SWEET_SUCESS } from "../../utils";
import { toast } from "react-toastify";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

// Register the Spanish locale
registerLocale("es", es);

const buildProgramacionSchema = (isSuper) =>
  Yup.object().shape({
    fechaInicial: Yup.date().required(VALIDATION_MESSAGES.REQUIRED.FECHA_INICIAL),
    fechaFinal: Yup.date()
      .required(VALIDATION_MESSAGES.REQUIRED.FECHA_FINAL)
      .min(Yup.ref('fechaInicial'), VALIDATION_MESSAGES.FORMAT.FECHA_FINAL_POSTERIOR),
    idEmpresa: isSuper
      ? Yup.string().required(VALIDATION_MESSAGES.REQUIRED.EMPRESA)
      : Yup.string().nullable(),
  });

export const ProgramacionForm = ({ programacion }) => {
  const { user } = useSelector((state) => state.usuario);
  const { rol } = useSelector((state) => state.auth);
  const { empresas } = useSelector((state) => state.empresa);
  const isSuper = String(rol?.nombre || "").toUpperCase() === "SUPER";
  const [monday, setMonday] = useState();
  const [saturday, setSaturday] = useState();
  const [sunday, setSunday] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    getMondayOfCurrentWeek();
    // getSaturdayOfCurrentWeek();
    getSundayOfCurrentWeek();
  }, []);

  useEffect(() => {
    if (isSuper) {
      dispatch(getEmpresas());
    }
  }, [dispatch, isSuper]);

  const handleSubmit = (values) => {
    const idEmpresaToSend = isSuper
      ? Number(values.idEmpresa)
      : Number(user?.idEmpresa || values.idEmpresa);

    if (!idEmpresaToSend) {
      toast.error(VALIDATION_MESSAGES.ERROR.EMPRESA_USUARIO);
      return;
    }

    const payload = {
      ...values,
      idEmpresa: idEmpresaToSend,
    };

    const action = values.idProgramacion
      ? modificarProgramacion(payload)
      : registrarProgramacion(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        SweetCrud(
          values.idProgramacion ? SWEET_MODIFICO : SWEET_GUARDO,
          values.idProgramacion ? MENSAJE_MODIFICADO_EXITOSO : MENSAJE_GUARDADO_EXITOSO
        );
        navigate(LISTAR_PROGRAMACION);
      })
      .catch((errores) => {
        SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, errores.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_GUARDAR);
      });
  };

  const getMondayOfCurrentWeek = () => {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const monday = new Date(today.setDate(first));
    setMonday(monday);
  };

  // const getSaturdayOfCurrentWeek = () => {
  //   const today = new Date();
  //   const first = today.getDate() - today.getDay() + 1;
  //   const sixth = first + 5;

  //   const saturday = new Date(today.setDate(sixth));
  //   setSaturday(saturday);
  // };

  const getSundayOfCurrentWeek = () => {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const sixth = first + 6;
    const sunday = new Date(today.setDate(sixth));
    setSunday(sunday);
  };

  return (
    <>
      <Formik
        initialValues={{
          idProgramacion: programacion?.idProgramacion || null,
          idEmpresa: String(programacion?.idEmpresa ?? (isSuper ? "" : user?.idEmpresa ?? "")),
          fechaInicial: programacion?.fechaInicial
            ? String(programacion.fechaInicial).split("T")[0]
            : (monday ? monday.toISOString().split("T")[0] : ""),
          fechaFinal: programacion?.fechaFinal
            ? String(programacion.fechaFinal).split("T")[0]
            : (sunday ? sunday.toISOString().split("T")[0] : ""),
        }}
        validationSchema={buildProgramacionSchema(isSuper)}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form className="my-10 bg-white shadow rounded p-10 flex flex-col w-2/5">
            {isSuper && (
              <div className="my-3">
                <label htmlFor="idEmpresa" className="uppercase text-gray-600 block font-bold">Empresa</label>
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
              <label htmlFor="fechaInicial" className="uppercase text-gray-600 block font-bold">Fecha Inicial</label>
              <Field
                id="fechaInicial"
                name="fechaInicial"
                type="date"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              />
              <ErrorMessage
                name="fechaInicial"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="my-3">
              <label htmlFor="fechaFinal" className="uppercase text-gray-600 block font-bold">Fecha Final</label>
              <Field
                id="fechaFinal"
                name="fechaFinal"
                type="date"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              />
              <ErrorMessage
                name="fechaFinal"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
              >
                {programacion?.idProgramacion ? "Actualizar Programación" : "Registrar Programación"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};


