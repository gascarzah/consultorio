import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik"; // Usamos Formik, Field, Form y ErrorMessage aquí
import { getRoles } from "../../slices/rolSlice";
import { clearRolMenuEditorState, getMenusPorRol, getMenusPorRolTodo, registrarRolMenu } from "../../slices/rolMenuSlice";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { SWEET_GUARDO, SWEET_SUCESS, SweetCrud } from "../../utils";

// Esquema de validación con Yup
const menuSchema = Yup.object().shape({
  idRol: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.ROL),
});

const MantenimientoRolMenu = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { roles } = useSelector((state) => state.rol);
  const { rolMenus } = useSelector((state) => state.rolMenu);
  const { rol: rolLogueado } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearRolMenuEditorState());
    dispatch(getRoles());
    return () => {
      dispatch(clearRolMenuEditorState());
    };
  }, [dispatch]);

  // Efecto para actualizar los menús seleccionados cuando cambian los rolMenus
  useEffect(() => {
    if (rolMenus.length > 0) {
      setSelectedItems(rolMenus.filter(menu => menu.activo).map(menu => menu.idMenu));
      return;
    }
    setSelectedItems([]);
  }, [rolMenus]);

  // Maneja la sumisión del formulario
  const handleOnSubmit = (values) => {
    dispatch(registrarRolMenu({ ...values, idsMenu: selectedItems }))
      .unwrap()
      .then((resultado) => {
        if (rolLogueado?.idRol) {
          dispatch(getMenusPorRolTodo(rolLogueado.idRol));
        }
        SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
        navigate("/dashboard");
      })
      .catch((error_) => {
        SweetCrud('Error', error_?.message || 'No se pudo guardar');
      });
  };

  const checkboxHandler = (e) => {
    const value = Number.parseInt(e.target.value, 10);
    setSelectedItems((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const checkAllHandler = () => {
    setSelectedItems(selectedItems.length === rolMenus.length ? [] : rolMenus.map((menu) => menu.idMenu));
  };

  const handleOnChange = (e, setFieldValue) => {
    const idRol = e.target.value;
    setFieldValue("idRol", idRol);
    setSelectedItems([]); // Reinicia los seleccionados al cambiar de rol
    dispatch(getMenusPorRol(idRol));
  };

  return (
    <Formik
      initialValues={{ idRol: "" }}
      validationSchema={menuSchema}
      onSubmit={handleOnSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="my-10 bg-white shadow rounded flex-col w-full">
          <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
            Asignar Menús por Rol
          </h1>
            <div className="my-5">
              <label htmlFor="idRol" className="uppercase text-gray-600 block font-bold">
                Rol
              </label>
              <Field
                as="select"
                name="idRol"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                onChange={(e) => handleOnChange(e, setFieldValue)}
              >
                <option value="" label="Selecciona un rol">
                  Select un Rol
                </option>

                {roles?.map((role) => (
                  <option key={role.idRol} value={role.idRol}>
                    {role.nombre}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="idRol"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="my-5">
              <button
                type="button"
                onClick={checkAllHandler}
                className="relative block rounded bg-sky-600 py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              >
                {rolMenus && rolMenus.length === selectedItems.length
                  ? "DesSeleccionar Todos"
                  : "Seleccionar Todos"}
              </button>
            </div>

            <div className="my-5">
              <h3 className="text-lg font-bold">Seleccionar Menús</h3>
              {rolMenus && rolMenus.length > 0 ? (
                <div className="grid grid-cols-5 gap-4">
                  {rolMenus.map((menu) => (
                    <label key={menu.idMenu} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={menu.idMenu}
                        checked={selectedItems.includes(menu.idMenu)}
                        onChange={checkboxHandler}
                        className="form-checkbox h-5 w-5 text-sky-600"
                      />
                      <span className="text-gray-700">{menu.nombre}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No hay menús disponibles</p>
              )}
            </div>

          <div className="">
            <input
              type="submit"
              value="Registrar Menú"
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default MantenimientoRolMenu;
