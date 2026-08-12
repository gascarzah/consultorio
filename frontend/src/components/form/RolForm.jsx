import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import { modificarRol, registrarRol, resetState } from "../../slices/rolSlice";
import { SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

const rolSchema = Yup.object().shape({
  nombre: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE),
});

const RolForm = ({ rol }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnSubmit = (values, { setSubmitting, resetForm }) => {
    if (!values.idRol) {
      dispatch(registrarRol(values))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
          navigate("/dashboard/listar-rol");
        })
        .catch((errores) => {
          SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, errores.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_GUARDAR);
        });
    } else {
      dispatch(modificarRol(values))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS);
          navigate("/dashboard/listar-rol");
        })
        .catch((errores) => {
          SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, errores.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_MODIFICAR);
        });
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={{ idRol: rol?.idRol || "", nombre: rol?.nombre || "" }}
        validationSchema={rolSchema}
        onSubmit={handleOnSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="my-10 bg-white shadow rounded p-10 flex flex-col w-2/5">
            <div className="my-3">
              <label htmlFor="nombre" className="uppercase text-gray-600 block font-bold">
                Nombre
              </label>
              <Field
                id="nombre"
                type="text"
                placeholder="Nombre del rol"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                name="nombre"
              />
              <ErrorMessage
                name="nombre"
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
                {isSubmitting ? "Procesando..." : "Registrar Rol"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RolForm;
