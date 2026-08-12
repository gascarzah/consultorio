import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import {
  modificarCategoriaMenu,
  registrarCategoriaMenu,
  resetState,
} from "../../slices/categoriaMenuSlice";
import { SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

const categoriaMenuSchema = Yup.object().shape({
  nombre: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE),
  orden: Yup.number()
    .typeError(VALIDATION_MESSAGES.FORMAT.ORDEN_NUMERICO)
    .integer(VALIDATION_MESSAGES.FORMAT.ORDEN_ENTERO)
    .required(VALIDATION_MESSAGES.REQUIRED.ORDEN),
});

const CategoriaMenuForm = ({ categoriaMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checked] = useState(true);

  const handleOnSubmit = (values, { setSubmitting }) => {
    const payload = { ...values, activo: checked, orden: Number(values.orden) };
    if (!values.idCategoria) {
      dispatch(registrarCategoriaMenu(payload))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
          navigate("/dashboard/listar-categoria-menu");
        })
        .catch((errores) => {
          SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, errores.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_GUARDAR);
        });
    } else {
      dispatch(modificarCategoriaMenu(payload))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS);
          navigate("/dashboard/listar-categoria-menu");
        })
        .catch((errores) => {
          SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, errores.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_MODIFICAR);
        });
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        idCategoria: categoriaMenu?.idCategoria || "",
        nombre: categoriaMenu?.nombre || "",
        orden: categoriaMenu?.orden ?? "",
      }}
      validationSchema={categoriaMenuSchema}
      onSubmit={handleOnSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="my-10 bg-white shadow rounded p-10 flex flex-col w-2/5">
          <div className="my-3">
            <label htmlFor="nombre" className="uppercase text-gray-600 block font-bold">
              Nombre
            </label>
            <Field
              id="nombre"
              type="text"
              placeholder="Nombre de la categoría"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              name="nombre"
            />
            <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div className="my-3">
            <label htmlFor="orden" className="uppercase text-gray-600 block font-bold">
              Orden
            </label>
            <Field
              id="orden"
              type="number"
              placeholder="Orden visual"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              name="orden"
            />
            <ErrorMessage name="orden" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Guardar Categoría"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CategoriaMenuForm;
