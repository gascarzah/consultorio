import { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LISTAR_HISTORIA_CLINICA, SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getHistoriaClinicasPaginado,
  modificarHistoriaClinica,
  registrarHistoriaClinica,
} from "../../slices/historiaClinicaSlice";
import { getUsuario } from "../../slices/usuarioSlice";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { VoiceDictationField } from "../VoiceDictationField";
import { toast } from "react-toastify";

const TIPO_DOCUMENTO_OPTIONS = [
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "Carnet de extranjería" },
  { value: "PASAPORTE", label: "Pasaporte" },
];

const historiaclinicaSchema = Yup.object().shape({
  tipoDocumento: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.TIPO_DOCUMENTO),
  numeroDocumento: Yup.string()
    .required(VALIDATION_MESSAGES.REQUIRED.DNI)
    .when("tipoDocumento", {
      is: "DNI",
      then: (schema) =>
        schema
          .matches(/^[0-9]+$/, VALIDATION_MESSAGES.FORMAT.DNI_NUMBERS)
          .length(8, VALIDATION_MESSAGES.FORMAT.DNI_LENGTH),
      otherwise: (schema) =>
        schema
          .min(5, VALIDATION_MESSAGES.FORMAT.DOCUMENTO_INVALIDO)
          .max(20, VALIDATION_MESSAGES.FORMAT.DOCUMENTO_INVALIDO),
    }),
  nombres: Yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE_HISTORIA_CLINICA),
  apellidoPaterno: Yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED.APELLIDO_PATERNO),
  apellidoMaterno: Yup.string().trim(),
  celular: Yup.string()
    .trim()
    .required(VALIDATION_MESSAGES.REQUIRED.CELULAR)
    .matches(/^[0-9+\-\s()]{6,20}$/, VALIDATION_MESSAGES.FORMAT.CELULAR_INVALIDO),
  telefono: Yup.string().trim(),
  email: Yup.string().trim().email(VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID),
  direccion: Yup.string().trim(),
});

const CLINICAL_VOICE_FIELDS = [
  { name: "alergia", label: "Alergias", rows: 3 },
  { name: "antecedentesMedicos", label: "Antecedentes Médicos", rows: 3 },
  { name: "ectoscopia", label: "Ectoscopia", rows: 3 },
  { name: "motivo", label: "Motivo", rows: 4, colSpan: true },
];

const emptyValues = {
  idHistoriaClinica: "",
  tipoDocumento: "DNI",
  numeroDocumento: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  celular: "",
  telefono: "",
  email: "",
  direccion: "",
  alergia: "",
  antecedentesMedicos: "",
  ectoscopia: "",
  motivo: "",
};

const mapHistoriaToValues = (hc) => ({
  idHistoriaClinica: hc?.idHistoriaClinica || "",
  tipoDocumento: hc?.tipoDocumento || "DNI",
  numeroDocumento: hc?.numeroDocumento || "",
  nombres: hc?.nombres || "",
  apellidoPaterno: hc?.apellidoPaterno || "",
  apellidoMaterno: hc?.apellidoMaterno || "",
  celular: hc?.celular || "",
  telefono: hc?.telefono || "",
  email: hc?.email || "",
  direccion: hc?.direccion || "",
  alergia: hc?.alergia || "",
  antecedentesMedicos: hc?.antecedentesMedicos || "",
  ectoscopia: hc?.ectoscopia || "",
  motivo: hc?.motivo || "",
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

  const fillFromHistoria = (setValues, hc) => {
    if (!hc) return;
    setValues(mapHistoriaToValues(hc));
  };

  const buscarPorDocumento = async (numeroDocumento, setValues) => {
    const doc = (numeroDocumento || "").trim();
    if (!doc) {
      toast.warn(VALIDATION_MESSAGES.ERROR.DOCUMENTO_BUSCAR);
      return;
    }

    if (typeof handleGetHistoriaClinica === "function") {
      handleGetHistoriaClinica(doc);
      return;
    }

    try {
      const page = await dispatch(
        getHistoriaClinicasPaginado({ page: 0, size: 5, search: doc })
      ).unwrap();
      const match =
        page?.content?.find((h) => h.numeroDocumento === doc) ||
        page?.content?.[0];
      if (!match) {
        toast.info(VALIDATION_MESSAGES.ERROR.HISTORIA_NO_ENCONTRADA);
        return;
      }
      fillFromHistoria(setValues, match);
      toast.success(VALIDATION_MESSAGES.SUCCESS.HISTORIA_CARGADA);
    } catch (error) {
      toast.error(error?.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_BUSCAR);
    }
  };

  const handleSubmit = async (values) => {
    const isEditing = values?.idHistoriaClinica && values.idHistoriaClinica !== "";
    const action = isEditing ? modificarHistoriaClinica : registrarHistoriaClinica;
    if (!isEditing && !idEmpresa) {
      SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, VALIDATION_MESSAGES.ERROR.EMPRESA_NO_DETERMINADA);
      return;
    }
    const payload = isEditing ? values : { ...values, idEmpresa };

    try {
      await dispatch(action(payload)).unwrap();
      SweetCrud(isEditing ? SWEET_MODIFICO : SWEET_GUARDO, SWEET_SUCESS);
      navigate(LISTAR_HISTORIA_CLINICA);
    } catch (error) {
      const msg =
        typeof error === "string"
          ? error
          : error?.message || VALIDATION_MESSAGES.ERROR.NO_SE_PUDO_GUARDAR;
      SweetCrud(VALIDATION_MESSAGES.ERROR.TITULO, msg);
    }
  };

  return (
    <Formik
      initialValues={{ ...emptyValues, ...mapHistoriaToValues(historiaclinica) }}
      enableReinitialize
      onSubmit={(values) => handleSubmit(values)}
      validationSchema={historiaclinicaSchema}
    >
      {({ values, setFieldValue, setValues }) => (
        <Form className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 md:p-8 w-full">
          <p className="text-sm text-gray-500 mb-6">
            Obligatorios: tipo y número de documento, nombres, apellido paterno y celular.
            Puede dictar por voz los campos clínicos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.idHistoriaClinica ? (
              <div className="my-3">
                <label htmlFor="idHistoriaClinica" className="uppercase text-gray-600 block font-bold">
                  Historia Clínica
                </label>
                <Field
                  id="idHistoriaClinica"
                  type="text"
                  name="idHistoriaClinica"
                  disabled
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                />
              </div>
            ) : null}

            <div className="my-3">
              <label htmlFor="tipoDocumento" className="uppercase text-gray-600 block font-bold">
                Tipo de documento *
              </label>
              <Field
                as="select"
                id="tipoDocumento"
                name="tipoDocumento"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              >
                {TIPO_DOCUMENTO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tipoDocumento" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="my-3">
              <label htmlFor="numeroDocumento" className="uppercase text-gray-600 block font-bold">
                Número de documento *
              </label>
              <div className="flex items-center gap-2">
                <Field
                  id="numeroDocumento"
                  type="text"
                  placeholder="Número de documento"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name="numeroDocumento"
                />
                <button
                  type="button"
                  onClick={() => buscarPorDocumento(values.numeroDocumento, setValues)}
                  title="Buscar por documento"
                  className="mt-3"
                >
                  🔍
                </button>
              </div>
              <ErrorMessage name="numeroDocumento" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {[
              { label: "Nombres *", name: "nombres", type: "text" },
              { label: "Apellido paterno *", name: "apellidoPaterno", type: "text" },
              { label: "Apellido materno", name: "apellidoMaterno", type: "text" },
              { label: "Celular *", name: "celular", type: "text" },
              { label: "Teléfono", name: "telefono", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Dirección", name: "direccion", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name} className="my-3">
                <label htmlFor={name} className="uppercase text-gray-600 block font-bold">
                  {label}
                </label>
                <Field
                  id={name}
                  type={type}
                  placeholder={label.replace(" *", "")}
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name={name}
                />
                <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
              </div>
            ))}

            {CLINICAL_VOICE_FIELDS.map(({ name, label, rows, colSpan }) => (
              <div key={name} className={`my-3 ${colSpan ? "md:col-span-2" : ""}`}>
                <VoiceDictationField
                  id={name}
                  label={label}
                  rows={rows}
                  value={values[name] || ""}
                  onChange={(text) => setFieldValue(name, text)}
                  placeholder={`Dicte o escriba ${label.toLowerCase()}…`}
                />
                <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
              </div>
            ))}
          </div>
          <div className="mt-5">
            <input
              type="submit"
              value={values.idHistoriaClinica ? "Actualizar historia clínica" : "Registrar historia clínica"}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};
