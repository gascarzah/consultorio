import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import { modificarEmpresa, registrarEmpresa, resetState } from "../../slices/empresaSlice";
import { SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

const empresaSchema = Yup.object().shape({
  nombre: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE),
});

const EmpresaForm = ({ empresa }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnSubmit = (values, { setSubmitting, resetForm }) => {
    if (!values.idEmpresa) {
      dispatch(registrarEmpresa(values))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
          navigate("/dashboard/listar-empresa");
        })
        .catch((errores) => {
          SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, errores.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_GUARDAR);
        });
    } else {
      dispatch(modificarEmpresa(values))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS);
          navigate("/dashboard/listar-empresa");
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
        initialValues={{ idEmpresa: empresa?.idEmpresa || "", nombre: empresa?.nombre || "" }}
        validationSchema={empresaSchema}
        onSubmit={handleOnSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => {
          return (
            <Form className="my-10 bg-white shadow rounded p-10 flex flex-col w-2/5">
              <div className="my-3">
                <label htmlFor="nombre" className="uppercase text-gray-600 block font-bold">
                  Nombre
                </label>
                <Field
                  id="nombre"
                  type="text"
                  placeholder="Nombre de la empresa"
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
                  {isSubmitting ? "Procesando..." : "Registrar Empresa"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default EmpresaForm;
