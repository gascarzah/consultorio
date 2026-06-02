import { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LISTAR_HISTORIA_CLINICA, SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { modificarHistoriaClinica, registrarHistoriaClinica, resetState } from "../../slices/historiaClinicaSlice";
import { getUsuario } from "../../slices/usuarioSlice";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

const historiaclinicaSchema = Yup.object().shape({
  nombres: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE_HISTORIA_CLINICA),
  apellidoPaterno: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.APELLIDO_PATERNO),
  apellidoMaterno: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.APELLIDO_MATERNO),
  numeroDocumento: Yup.string()
    .max(8, VALIDATION_MESSAGES.FORMAT.DNI_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED.DNI)
    .matches(/^[0-9]+$/, VALIDATION_MESSAGES.FORMAT.DNI_NUMBERS),
  email: Yup.string().email(VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID).required(VALIDATION_MESSAGES.REQUIRED.EMAIL),
  direccion: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.DIRECCION),
});

export const HistoriaClinicaForm = ({ historiaclinica, handleGetHistoriaClinica }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const idEmpresa = useSelector((state) => state.usuario.user?.idEmpresa);
  const email = useSelector((state) => state.auth.email);

  useEffect(() => {
    if (email && !idEmpresa) {
      dispatch(getUsuario(email));
    }
  }, [dispatch, email, idEmpresa]);

  const handleSubmit = async (values) => {
    const isEditing = values?.idHistoriaClinica && values.idHistoriaClinica !== "";
    const action = isEditing ? modificarHistoriaClinica : registrarHistoriaClinica;
    const payload = isEditing ? values : { ...values, idEmpresa };

    try {
      await dispatch(action(payload)).unwrap();
      // setHistoriaClinica(resultado);
      SweetCrud(isEditing ? SWEET_MODIFICO : SWEET_GUARDO, SWEET_SUCESS);
      dispatch(resetState())
      navigate(LISTAR_HISTORIA_CLINICA);
    } catch (error) {
      SweetCrud('Error', error.message || 'No se pudo guardar');
    }
  };
  return (
    <>
      <Formik
        initialValues={{
          idHistoriaClinica: historiaclinica?.idHistoriaClinica || "",
          nombres: historiaclinica?.nombres || "",
          apellidoPaterno: historiaclinica?.apellidoPaterno || "",
          apellidoMaterno: historiaclinica?.apellidoMaterno || "",
          numeroDocumento: historiaclinica?.numeroDocumento || "",
          email: historiaclinica?.email || "",
          direccion: historiaclinica?.direccion || "",
          alergia: historiaclinica?.alergia || "",
          antecedentesMedicos: historiaclinica?.antecedentesMedicos || "",
          ectoscopia: historiaclinica?.ectoscopia || "",
          motivo: historiaclinica?.motivo || "",
        }}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        validationSchema={historiaclinicaSchema}
      >
        {({ errors, touched, values }) => (
          
          <Form className="my-10 bg-white shadow rounded p-10 w-full"> 
            <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
              {historiaclinica?.idHistoriaClinica ? "Editar Historia Clinica" : "Registrar Historia Clinica"}
            </h1>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Historia Clínica", name: "idHistoriaClinica", type: "text" , disabled: true },
                { label: "Número de Documento", name: "numeroDocumento", type: "text", isSearchable: true , disabled: false},
                { label: "Nombre", name: "nombres", type: "text" , disabled: false},
                { label: "Apellido Paterno", name: "apellidoPaterno", type: "text" , disabled: false},
                { label: "Apellido Materno", name: "apellidoMaterno", type: "text" , disabled: false},
                { label: "Email", name: "email", type: "email" , disabled: false},
                { label: "Dirección", name: "direccion", type: "text" , disabled: false},
                { label: "Alergias", name: "alergia", type: "text" , disabled: false},
                { label: "Antecedentes Médicos", name: "antecedentesMedicos", type: "text" , disabled: false},
                { label: "Ectoscopia", name: "ectoscopia", type: "text" , disabled: false},
              ].map(({ label, name, type, isSearchable, disabled }) => (
                <div key={name} className="my-3">
                  <label htmlFor={name} className="uppercase text-gray-600 block font-bold">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <Field
                      id={name}
                      type={type}
                      placeholder={label}
                      className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                      name={name}
                      disabled={disabled}
                    />
                    {isSearchable && (
                      <button type="button" onClick={() => handleGetHistoriaClinica(values.numeroDocumento)}>
                        🔍
                      </button>
                    )}
                  </div>
                  <ErrorMessage
                    name={name}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}
              <div className="my-3 col-span-2">
                <label htmlFor="motivo" className="uppercase text-gray-600 block font-bold">
                  Motivo
                </label>
                <Field
                  id="motivo"
                  component="textarea"
                  rows="4"
                  placeholder="Motivo"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name="motivo"
                />
                <ErrorMessage
                  name="motivo"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
            <div className="mt-5">
              <input
                type="submit"
                value="Registrar HistoriaClinica y Antecedente Médico"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
              />
            </div>
          </Form>
        )}
      </Formik>
      {/* Eliminar ToastContainer */}
    </>
  );
};
