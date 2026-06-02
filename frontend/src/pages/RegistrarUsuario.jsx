import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { registrarUsuario, resetState } from "../slices/usuarioSlice";
import { getRoles } from "../slices/rolSlice";
import { getEmpresas } from "../slices/empresaSlice";
import { toast } from "react-toastify";
import { VALIDATION_MESSAGES } from "../utils/ValidationMessages";

const nuevoUsuarioSchema = Yup.object().shape({
  nombres: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE_CLIENTE),
  apellidoPaterno: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.APELLIDO_PATERNO),
  apellidoMaterno: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.APELLIDO_MATERNO),
  numeroDocumento: Yup.string()
    .max(8, VALIDATION_MESSAGES.FORMAT.DNI_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED.DNI)
    .matches(/^[0-9]+$/, VALIDATION_MESSAGES.FORMAT.DNI_NUMBERS),
  email: Yup.string()
    .email(VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.REQUIRED.EMAIL),
  password: Yup.string()
    .min(6, VALIDATION_MESSAGES.FORMAT.PASSWORD_MIN)
    .required(VALIDATION_MESSAGES.REQUIRED.PASSWORD),
  password2: Yup.string()
    .oneOf([Yup.ref('password'), null], VALIDATION_MESSAGES.PASSWORD.DEBEN_COINCIDIR)
    .required(VALIDATION_MESSAGES.REQUIRED.PASSWORD_CONFIRMACION),
  idRol: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.ROL),
  idEmpresa: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.EMPRESA),
});

const RegistrarUsuario = () => {
  const { roles } = useSelector((state) => state.rol);
  const { empresas } = useSelector((state) => state.empresa);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(getRoles());
    dispatch(getEmpresas());
  }, [dispatch]);

  const handleSubmit = (values, resetForm) => {
    dispatch(registrarUsuario(values))
      .unwrap()
      .then((resultado) => {
        dispatch(resetState());
        toast.success(resultado?.message || 'Cuenta creada correctamente');
        resetForm();
        navigate("/");
      })
      .catch((errores) => {
        toast.error(errores.message || VALIDATION_MESSAGES.ERROR.ERROR_SERVIDOR);
      });
  };

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize text-center">
        Crea cuenta
      </h1>

      <Formik
        initialValues={{
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          numeroDocumento: "",
          email: "",
          password: "",
          password2: "",
          idRol: "",
          idEmpresa: "",
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
          //resetForm();
        }}
        validationSchema={nuevoUsuarioSchema}
      >
        {({ errors, touched, values, handleChange }) => {
          return (
            <Form className="my-10 bg-white shadow rounded p-10 ">
              <div className="my-5">
                <label
                  htmlFor="nombre"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Nombre
                </label>
                <Field
                  id="nombres"
                  type="text"
                  placeholder="Nombres"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  name={"nombres"}
                />
                <ErrorMessage
                  name="nombres"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-5">
                <label
                  htmlFor="apellidoPaterno"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Apellido Paterno
                </label>
                <Field
                  id="apellidoPaterno"
                  type="text"
                  placeholder="Apellido Paterno"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  name={"apellidoPaterno"}
                />
                <ErrorMessage
                  name="apellidoPaterno"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-5">
                <label
                  htmlFor="apellidoMaterno"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Apellido Materno
                </label>
                <Field
                  id="apellidoMaterno"
                  type="text"
                  placeholder="Apellido Materno"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  name={"apellidoMaterno"}
                />
                <ErrorMessage
                  name="apellidoMaterno"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-5">
                <label
                  htmlFor="numeroDocumento"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Numero de Documento
                </label>
                <Field
                  id="numeroDocumento"
                  type="text"
                  placeholder="Numero de documento"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  name={"numeroDocumento"}
                />
                <ErrorMessage
                  name="numeroDocumento"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-5">
                <label
                  htmlFor="email"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Email
                </label>
                <Field
                  id="email"
                  type="email"
                  placeholder="Email de Registro"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  name={"email"}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-5">
                <label
                  htmlFor="password"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Password
                </label>
                <Field
                  id="password"
                  type="password"
                  placeholder="Password de Registro"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  name={"password"}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-5">
                <label
                  htmlFor="password2"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Password
                </label>
                <Field
                  id="password2"
                  type="password"
                  placeholder="Password de Registro"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  name={"password2"}
                />
                <ErrorMessage
                  name="password2"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-5">
                <label
                  htmlFor="idRol"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Rol
                </label>
                <select
                  name="idRol"
                  value={values.idRol}
                  onChange={handleChange}
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  style={{ display: "block" }}
                >
                  <option value="" label="Selecciona un rol">
                    Select un Rol{" "}
                  </option>

                  {roles?.map((roles, index) => {
                    return (
                      <option key={roles.idRol} value={roles.idRol}>
                        {roles.nombre}
                      </option>
                    );
                  })}
                </select>
                <ErrorMessage
                  name="idRol"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-5">
                <label
                  htmlFor="idEmpresa"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Empresa
                </label>
                <select
                  name="idEmpresa"
                  value={values.idEmpresa}
                  onChange={handleChange}
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  style={{ display: "block" }}
                >
                  <option value="" label="Selecciona una empresa">
                    Select una Empresa{" "}
                  </option>
                  {/* <option key={1} value={1}>
                        {'GAFAH'}
                      </option> */}
                  {empresas?.map((empresa, index) => {
                    return (
                      <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                        {empresa.nombre}
                      </option>
                    );
                  })}
                </select>
                <ErrorMessage
                  name="idEmpresa"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <input
                type="submit"
                value="Crear Cuenta"
                className="bg-sky-700 mb-5 w-full rounded py-3 text-white font-bold
            uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
              />
            </Form>
          );
        }}
      </Formik>

      <nav>
        <Link
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          Ya tienes una cuenta? Inicia Sesion
        </Link>
      </nav>
    </>
  );
};

export default RegistrarUsuario;
