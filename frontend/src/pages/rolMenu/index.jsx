import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { getRoles } from "../../slices/rolSlice";
import {
  clearRolMenuEditorState,
  getMenusPorRol,
  getMenusPorRolTodo,
  registrarRolMenu,
} from "../../slices/rolMenuSlice";
import { FormPage } from "../../components/PageContainer";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { SWEET_GUARDO, SWEET_SUCESS, SweetCrud } from "../../utils";

const menuSchema = Yup.object().shape({
  idRol: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.ROL),
});

const CATEGORY_ORDER = {
  "Gestión Principal": 1,
  "Gestión Médica": 2,
  Administración: 3,
  Configuración: 4,
};

function groupMenusByCategory(menus) {
  const grouped = menus.reduce((acc, menu) => {
    const category = menu.categoriaNombre || "Sin categoría";
    if (!acc[category]) acc[category] = [];
    acc[category].push(menu);
    return acc;
  }, {});

  return Object.entries(grouped).sort(([a], [b]) => {
    const orderA = CATEGORY_ORDER[a] ?? 99;
    const orderB = CATEGORY_ORDER[b] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b, "es", { sensitivity: "base" });
  });
}

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

  useEffect(() => {
    if (rolMenus.length > 0) {
      setSelectedItems(
        rolMenus.filter((menu) => menu.activo).map((menu) => menu.idMenu)
      );
      return;
    }
    setSelectedItems([]);
  }, [rolMenus]);

  const groupedMenus = useMemo(
    () => groupMenusByCategory(rolMenus || []),
    [rolMenus]
  );

  const allSelected =
    rolMenus.length > 0 && selectedItems.length === rolMenus.length;

  const handleOnSubmit = (values) => {
    dispatch(registrarRolMenu({ ...values, idsMenu: selectedItems }))
      .unwrap()
      .then(() => {
        if (rolLogueado?.idRol) {
          dispatch(getMenusPorRolTodo(rolLogueado.idRol));
        }
        SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
        navigate("/dashboard");
      })
      .catch((error_) => {
        SweetCrud("Error", error_?.message || "No se pudo guardar");
      });
  };

  const toggleMenu = (idMenu) => {
    setSelectedItems((prev) =>
      prev.includes(idMenu)
        ? prev.filter((id) => id !== idMenu)
        : [...prev, idMenu]
    );
  };

  const checkAllHandler = () => {
    setSelectedItems(
      allSelected ? [] : rolMenus.map((menu) => menu.idMenu)
    );
  };

  const handleOnChange = (e, setFieldValue) => {
    const idRol = e.target.value;
    setFieldValue("idRol", idRol);
    setSelectedItems([]);
    if (idRol) {
      dispatch(getMenusPorRol(idRol));
    } else {
      dispatch(clearRolMenuEditorState());
    }
  };

  return (
    <FormPage
      title="Asignar menús por rol"
      subtitle="Elige un rol y marca los módulos a los que tendrá acceso."
      maxWidth="max-w-4xl"
    >
      <Formik
        initialValues={{ idRol: "" }}
        validationSchema={menuSchema}
        onSubmit={handleOnSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-8">
            <div className="form-group max-w-md">
              <label htmlFor="idRol" className="form-label">
                Rol
              </label>
              <Field
                as="select"
                id="idRol"
                name="idRol"
                className="form-input mt-1 w-full rounded-lg border-gray-300 px-3 py-2.5"
                onChange={(e) => handleOnChange(e, setFieldValue)}
              >
                <option value="">Selecciona un rol</option>
                {roles?.map((role) => (
                  <option key={role.idRol} value={role.idRol}>
                    {role.nombre}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="idRol"
                component="p"
                className="error-message"
              />
            </div>

            {values.idRol && (
              <div className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Menús disponibles
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedItems.length} de {rolMenus.length} seleccionados
                    </p>
                  </div>
                  {rolMenus.length > 0 && (
                    <button
                      type="button"
                      onClick={checkAllHandler}
                      className="btn-secondary shrink-0"
                    >
                      {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
                    </button>
                  )}
                </div>

                {rolMenus.length > 0 ? (
                  <div className="space-y-6">
                    {groupedMenus.map(([category, items]) => (
                      <section key={category} className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {items.map((menu) => {
                            const checked = selectedItems.includes(menu.idMenu);
                            return (
                              <label
                                key={menu.idMenu}
                                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                                  checked
                                    ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  value={menu.idMenu}
                                  checked={checked}
                                  onChange={() => toggleMenu(menu.idMenu)}
                                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-medium text-gray-900">
                                    {menu.nombre}
                                  </span>
                                  {menu.path && (
                                    <span className="mt-0.5 block truncate text-xs text-gray-500">
                                      {menu.path}
                                    </span>
                                  )}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                    <p className="text-sm text-gray-600">
                      No hay menús para este rol.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!values.idRol && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                <p className="text-sm text-gray-600">
                  Selecciona un rol para ver y asignar menús.
                </p>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!values.idRol || rolMenus.length === 0}
              >
                Guardar asignación
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </FormPage>
  );
};

export default MantenimientoRolMenu;
