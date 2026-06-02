import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import { modificarMenu, registrarMenu, resetState } from "../../slices/menuSlice";
import { getCategoriasMenu } from "../../slices/categoriaMenuSlice";
import { SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

const menuSchema = Yup.object().shape({
  nombre: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE),
  path: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.PATH),
  idCategoria: Yup.number().typeError("Seleccione una categoría").required("La categoría es obligatoria"),
  orden: Yup.number().typeError("El orden debe ser numérico").required("El orden es obligatorio"),
});

const MenuForm = ({ menu }) => {
  const [checked, setChecked] = useState(true);
  const { categoriasMenu } = useSelector((state) => state.categoriaMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = { ...values, activo: checked, idCategoria: Number(values.idCategoria), orden: Number(values.orden) };
    if (!values.idMenu) {
      dispatch(registrarMenu(payload))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
          navigate("/dashboard/listar-menu");
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo guardar');
        });
    } else {
      dispatch(modificarMenu(payload))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS);
          navigate("/dashboard/listar-menu");
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo modificar');
        });
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (menu) {
      setChecked(menu.activo);
    }
  }, [menu]);

  useEffect(() => {
    dispatch(getCategoriasMenu());
  }, [dispatch]);

  return (
    <>
      <Formik
        initialValues={{
          idMenu: menu?.idMenu || "",
          nombre: menu?.nombre || "",
          path: menu?.path || "",
          idCategoria: menu?.idCategoria || "",
          orden: menu?.orden ?? "",
        }}
        validationSchema={menuSchema}
        onSubmit={handleOnSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => {
          return (
            <Form className="my-10 bg-white shadow rounded p-10 flex flex-col w-2/5">
              <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
                {menu?.idMenu ? "Editar Menú" : "Registrar Menú"}
              </h1>
              <div className="my-3">
                <label htmlFor="nombre" className="uppercase text-gray-600 block font-bold">
                  Nombre
                </label>
                <Field
                  id="nombre"
                  type="text"
                  placeholder="Nombre del menú"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name="nombre"
                />
                <ErrorMessage
                  name="nombre"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-3">
                <label htmlFor="idCategoria" className="uppercase text-gray-600 block font-bold">
                  Categoría
                </label>
                <Field
                  as="select"
                  id="idCategoria"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name="idCategoria"
                >
                  <option value="">Seleccione</option>
                  {categoriasMenu?.map((categoria) => (
                    <option key={categoria.idCategoria} value={categoria.idCategoria}>
                      {categoria.nombre}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="idCategoria"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-3">
                <label htmlFor="orden" className="uppercase text-gray-600 block font-bold">
                  Orden
                </label>
                <Field
                  id="orden"
                  type="number"
                  placeholder="Orden del menú"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name="orden"
                />
                <ErrorMessage
                  name="orden"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-3">
                <label htmlFor="path" className="uppercase text-gray-600 block font-bold">
                  Path
                </label>
                <Field
                  id="path"
                  type="text"
                  placeholder="Ruta del menú (ej: /dashboard)"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name="path"
                />
                <ErrorMessage
                  name="path"
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
                  {isSubmitting ? "Procesando..." : "Registrar Menú"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default MenuForm;
