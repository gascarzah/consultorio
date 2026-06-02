import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


import { modificarTipoEmpleado, registrarTipoEmpleado, resetState } from "../../slices/tipoEmpleadoSlice";
import { SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

const tipoEmpleadoSchema = Yup.object().shape({
  descripcion: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.DESCRIPCION),
});

const TipoEmpleadoForm = ({ tipoEmpleado }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnSubmit = (values, { setSubmitting }) => {
    if (!values.idTipoEmpleado) {
      dispatch(registrarTipoEmpleado(values))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
          navigate("/dashboard/listar-tipo-empleado");
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo guardar');
          
        });
    } else {
      dispatch(modificarTipoEmpleado(values))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS);
          navigate("/dashboard/listar-tipo-empleado");
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo modificar');
          
        });
    }
    setSubmitting(false);
  };

  return (
    <>

      <Formik
        initialValues={{ idTipoEmpleado: tipoEmpleado?.idTipoEmpleado || "", descripcion: tipoEmpleado?.descripcion || "" }}
        validationSchema={tipoEmpleadoSchema}
        onSubmit={handleOnSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="my-10 bg-white shadow rounded p-10 flex flex-col w-2/5">
            <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
              {tipoEmpleado?.idTipoEmpleado ? "Editar Tipo de Empleado" : "Registrar Tipo de Empleado"}
            </h1>
            <div className="my-3">
              <label htmlFor="descripcion" className="uppercase text-gray-600 block font-bold">
                Descripción
              </label>
              <Field
                id="descripcion"
                type="text"
                placeholder="Descripción del tipo de empleado"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                name="descripcion"
              />
              <ErrorMessage
                name="descripcion"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Registrar TipoEmpleado"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TipoEmpleadoForm;
