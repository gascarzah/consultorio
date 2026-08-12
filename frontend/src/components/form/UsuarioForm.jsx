import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { getRoles } from "../../slices/rolSlice";
import { getEmpleadosPaginado, getEmpleadosPorEmpresa } from "../../slices/empleadoSlice";
import { getEmpresas } from "../../slices/empresaSlice";
import { getUsuario, modificarUsuario, registrarUsuario } from "../../slices/usuarioSlice";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";

const buildUsuarioSchema = (isSuper) =>
  Yup.object().shape({
    email: Yup.string().email(VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID).required(VALIDATION_MESSAGES.REQUIRED.EMAIL),
    idEmpresa: isSuper
      ? Yup.string().required(VALIDATION_MESSAGES.REQUIRED.EMPRESA)
      : Yup.string().nullable(),
    idRol: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.ROL),
    idEmpleado: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.EMPLEADO),
  });

const UsuarioForm = ({ usuario }) => {
  const { roles } = useSelector((state) => state.rol);
  const { empleados } = useSelector((state) => state.empleado);
  const { empresas } = useSelector((state) => state.empresa);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.usuario);
  const { email, rol } = useSelector((state) => state.auth);
  const isSuper = String(rol?.nombre || "").toUpperCase() === "SUPER";

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    if (isSuper) {
      dispatch(getEmpresas());
    }
  }, [dispatch, isSuper]);

  useEffect(() => {
    if (email) {
      dispatch(getUsuario(email));
    }
  }, [dispatch, email]);

  useEffect(() => {
    if (isSuper) {
      dispatch(getEmpleadosPaginado({ page: 0, size: 1000 }));
      return;
    }
    if (user?.idEmpresa) {
      dispatch(getEmpleadosPorEmpresa(user.idEmpresa));
    }
  }, [dispatch, user?.idEmpresa, isSuper]);

  const handleOnSubmit = (values) => {
    const idEmpresaToSend = isSuper ? Number(values.idEmpresa) : Number(user?.idEmpresa || values.idEmpresa);
    if (!idEmpresaToSend) {
      SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, VALIDATION_MESSAGES.ERROR.EMPRESA_NO_DETERMINADA);
      return;
    }
    const request = {
      idUsuario: usuario?.idUsuario || undefined,
      email: values.email,
      idEmpresa: idEmpresaToSend,
      idRol: Number(values.idRol),
      idEmpleado: Number(values.idEmpleado),
    };

    const action = usuario?.idUsuario ? modificarUsuario(request) : registrarUsuario(request);
    dispatch(action)
      .unwrap()
      .then(() => {
        SweetCrud(usuario?.idUsuario ? SWEET_MODIFICO : SWEET_GUARDO, SWEET_SUCESS);
        navigate("/dashboard/listar-usuario");
      })
      .catch((error_) => {
        const message = typeof error_ === "string" ? error_ : error_?.message;
        SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_GUARDAR);
      });
  };

  return (
    <Formik
      initialValues={{
        email: String(usuario?.email ?? ""),
        idEmpresa: String(usuario?.empleado?.empresa?.idEmpresa ?? (isSuper ? "" : user?.idEmpresa ?? "")),
        idRol: String(usuario?.idRol ?? usuario?.roles?.[0]?.idRol ?? ""),
        idEmpleado: String(usuario?.idEmpleado ?? usuario?.empleado?.idEmpleado ?? "")
      }}
      validationSchema={buildUsuarioSchema(isSuper)}
      onSubmit={handleOnSubmit}
      enableReinitialize
    >
      {({ setFieldValue }) => (
        <Form className="my-10 bg-white shadow rounded p-10">
          <div className="my-3">
            <label
              htmlFor="email"
              className="uppercase text-gray-600 block font-bold"
            >
              Email
            </label>
            <Field
              type="email"
              name="email"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              placeholder="correo@dominio.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

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
                name="idEmpresa"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                onChange={(e) => {
                  const selectedEmpresa = e.target.value;
                  setFieldValue("idEmpresa", selectedEmpresa);
                  if (selectedEmpresa) {
                    dispatch(getEmpleadosPorEmpresa(Number(selectedEmpresa)));
                    setFieldValue("idEmpleado", "");
                  }
                }}
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
              htmlFor="idEmpleado"
              className="uppercase text-gray-600 block font-bold"
            >
              Empleado
            </label>
            <Field
              as="select"
              name="idEmpleado"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            >
              <option value="">Selecciona un Empleado</option>
              {(Array.isArray(empleados) ? empleados : []).map((empleado) => (
                <option
                  key={empleado.idEmpleado}
                  value={empleado.idEmpleado}
                >
                  {empleado.apellidoPaterno} {empleado.apellidoMaterno}, {empleado.nombres}
                  {empleado.tipoEmpleadoNombre || empleado.tipoEmpleado?.nombre
                    ? ` (${empleado.tipoEmpleadoNombre || empleado.tipoEmpleado?.nombre})`
                    : ""}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="idEmpleado"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="my-5">
            <label htmlFor="idRol" className="uppercase text-gray-600 block font-bold">
              Rol
            </label>
            <Field
              as="select"
              name="idRol"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            >
              <option value="">Selecciona un Rol</option>
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

          <div>
            <input
              type="submit"
              value={usuario?.idUsuario ? "Actualizar Usuario" : "Registrar Usuario"}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UsuarioForm;
