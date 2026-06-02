import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { registrarEmpleado, modificarEmpleado } from "../../slices/empleadoSlice";
import { getTipoEmpleados } from "../../slices/tipoEmpleadoSlice";
import { getEmpresas } from "../../slices/empresaSlice";
import { getUsuario } from "../../slices/usuarioSlice";
import { resetState } from "../../slices/rolMenuSlice";
import { LISTAR_EMPLEADO } from "../../utils";
import { SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

const empleadoSchema = Yup.object().shape({
  nombres: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE_EMPLEADO),
  apellidoPaterno: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.APELLIDO_PATERNO),
  apellidoMaterno: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.APELLIDO_MATERNO),
  numeroDocumento: Yup.string()
    .max(8, VALIDATION_MESSAGES.FORMAT.DNI_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED.DNI)
    .matches(/^[0-9]+$/, VALIDATION_MESSAGES.FORMAT.DNI_NUMBERS),

  direccion: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.DIRECCION),
  idTipoEmpleado: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.TIPO_EMPLEADO),
  idEmpresa: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.EMPRESA),
});

function EmpleadoFormInner({ errors, touched, values, setFieldValue, tipoEmpleados, empresas, handleSubmit, empleado, isSuper }) {
  return (
    <Form className="my-10 bg-white shadow rounded p-10 flex flex-col w-2/5">
      <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
        {empleado?.idEmpleado ? "Editar Empleado" : "Registrar Empleado"}
      </h1>
      <div className="my-3">
        <label htmlFor="nombres" className="uppercase text-gray-600 block font-bold">
          Nombres
        </label>
        <Field
          id="nombres"
          type="text"
          placeholder="Nombres"
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          name="nombres"
        />
        <ErrorMessage
          name="nombres"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="my-3">
        <label htmlFor="apellidoPaterno" className="uppercase text-gray-600 block font-bold">
          Apellido Paterno
        </label>
        <Field
          id="apellidoPaterno"
          type="text"
          placeholder="Apellido Paterno"
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          name="apellidoPaterno"
        />
        <ErrorMessage
          name="apellidoPaterno"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="my-3">
        <label htmlFor="apellidoMaterno" className="uppercase text-gray-600 block font-bold">
          Apellido Materno
        </label>
        <Field
          id="apellidoMaterno"
          type="text"
          placeholder="Apellido Materno"
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          name="apellidoMaterno"
        />
        <ErrorMessage
          name="apellidoMaterno"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="my-3">
        <label htmlFor="numeroDocumento" className="uppercase text-gray-600 block font-bold">
          Número de Documento
        </label>
        <Field
          id="numeroDocumento"
          type="text"
          placeholder="Número de Documento"
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          name="numeroDocumento"
        />
        <ErrorMessage
          name="numeroDocumento"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>



      <div className="my-3">
        <label htmlFor="direccion" className="uppercase text-gray-600 block font-bold">
          Dirección
        </label>
        <Field
          id="direccion"
          type="text"
          placeholder="Dirección"
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          name="direccion"
        />
        <ErrorMessage
          name="direccion"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="my-3">
        <label htmlFor="idTipoEmpleado" className="uppercase text-gray-600 block font-bold">
          Tipo de Empleado
        </label>
        <Field
          as="select"
          id="idTipoEmpleado"
          name="idTipoEmpleado"
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
        >
          <option value="">Selecciona un tipo de empleado</option>
          {tipoEmpleados && tipoEmpleados.map((tipoEmpleado) => (
            <option key={tipoEmpleado.idTipoEmpleado} value={tipoEmpleado.idTipoEmpleado}>
              {tipoEmpleado.descripcion}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="idTipoEmpleado"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {isSuper && (
        <div className="my-3">
          <label htmlFor="idEmpresa" className="uppercase text-gray-600 block font-bold">
            Empresa
          </label>
          <Field
            as="select"
            id="idEmpresa"
            name="idEmpresa"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          >
            <option value="">Selecciona una empresa</option>
            {empresas && empresas.map((empresa) => (
              <option key={empresa.idEmpresa} value={empresa.idEmpresa}>{empresa.nombre}</option>
            ))}
          </Field>
          <ErrorMessage
            name="idEmpresa"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
      )}

      <div>
        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
        >
          Registrar Empleado
        </button>
      </div>
    </Form>
  );
}

export const EmpleadoForm = ({ empleado }) => {
  const { empresas } = useSelector((state) => state.empresa);
  const { tipoEmpleados } = useSelector((state) => state.tipoEmpleado);
  const { user } = useSelector((state) => state.usuario);
  const { email, rol } = useSelector((state) => state.auth);
  const isSuper = String(rol?.nombre || "").toUpperCase() === "SUPER";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetState());
    dispatch(getTipoEmpleados());
    if (isSuper) {
      dispatch(getEmpresas());
    }
  }, [dispatch, isSuper]);

  useEffect(() => {
    if (email) {
      dispatch(getUsuario(email));
    }
  }, [dispatch, email]);

  const handleSubmit = (values, resetForm) => {
    const idEmpresaToSend = isSuper ? Number(values.idEmpresa) : Number(user?.idEmpresa || values.idEmpresa);
    if (!idEmpresaToSend) {
      SweetCrud('Error', 'No se pudo determinar la empresa del usuario ADMIN');
      return;
    }
    const payload = {
      ...values,
      idEmpresa: idEmpresaToSend,
    };
    
    if (!values.idEmpleado) {
      dispatch(registrarEmpleado(payload))
        .unwrap()
        .then(() => {
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS);
          dispatch(resetState());
          navigate(LISTAR_EMPLEADO);
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo guardar');
        });
    } else {
      dispatch(modificarEmpleado(payload))
        .unwrap()
        .then(() => {
          dispatch(resetState());
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS);
          navigate(LISTAR_EMPLEADO);
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo modificar');
        });
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          idEmpleado: empleado?.idEmpleado || "",
          nombres: empleado?.nombres || "",
          apellidoPaterno: empleado?.apellidoPaterno || "",
          apellidoMaterno: empleado?.apellidoMaterno || "",
          numeroDocumento: empleado?.numeroDocumento || "",
          direccion: empleado?.direccion || "",
          idTipoEmpleado: empleado?.idTipoEmpleado || empleado?.tipoEmpleado?.idTipoEmpleado || "",
          idEmpresa: empleado?.idEmpresa || empleado?.empresa?.idEmpresa || user?.idEmpresa || "",
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        validationSchema={empleadoSchema}
      >
        {(formikProps) => (
          <EmpleadoFormInner
            {...formikProps}
            tipoEmpleados={tipoEmpleados}
            empresas={empresas}
            handleSubmit={handleSubmit}
            empleado={empleado}
            isSuper={isSuper}
          />
        )}
      </Formik>
    </>
  );
};
