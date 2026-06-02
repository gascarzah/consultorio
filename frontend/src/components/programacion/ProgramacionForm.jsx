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
// import { getEmpleadosPorEmpresa } from "../../slices/empleadoSlice";
import { LISTAR_PROGRAMACION, MENSAJE_GUARDADO_EXITOSO, MENSAJE_MODIFICADO_EXITOSO, SWEET_GUARDO, SweetCrud } from "../../utils";
import { SWEET_MODIFICO, SWEET_SUCESS } from "../../utils";
import { toast } from "react-toastify";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

// Register the Spanish locale
registerLocale("es", es);

const programacionSchema = Yup.object().shape({
  fechaInicial: Yup.date()
    .required(VALIDATION_MESSAGES.REQUIRED.FECHA_INICIAL)
    .max(new Date(), "La fecha inicial no puede ser futura"),
  fechaFinal: Yup.date()
    .required(VALIDATION_MESSAGES.REQUIRED.FECHA_FINAL)
    .min(Yup.ref('fechaInicial'), "La fecha final debe ser posterior a la fecha inicial"),
});

export const ProgramacionForm = ({ programacion }) => {
  const { user } = useSelector((state) => state.usuario);
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

  // useEffect(() => {
  //   dispatch(getEmpleadosPorEmpresa(user?.idEmpresa));
  // }, [dispatch]);

  const handleSubmit = (values) => {
    if (!user?.idEmpresa) {
      console.error("No se pudo obtener la empresa del usuario");
      return;
    }

    const payload = {
      ...values,
      idEmpresa: user.idEmpresa,
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
        SweetCrud("Error", errores.message || "No se pudo guardar");
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
          fechaInicial: programacion?.fechaInicial
            ? String(programacion.fechaInicial).split("T")[0]
            : (monday ? monday.toISOString().split("T")[0] : ""),
          fechaFinal: programacion?.fechaFinal
            ? String(programacion.fechaFinal).split("T")[0]
            : (sunday ? sunday.toISOString().split("T")[0] : ""),
        }}
        validationSchema={programacionSchema}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form className="my-10 bg-white shadow rounded p-10 flex flex-col w-2/5">
            <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
              {programacion?.idProgramacion ? "Editar Programación" : "Registrar Programación"}
            </h1>
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


