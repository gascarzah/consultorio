import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import Modal from "react-modal";
import * as Yup from "yup";
import { toast } from "react-toastify";
import dayjs from "dayjs";
// En consultorio-frontend (main) este import “sin uso” habilitaba el motor de speech.
import regeneratorRuntime from "regenerator-runtime";
import { Pagination, AtencionDetalleModal, VoiceDictationField } from "../../components";
import { getCita, getHistorialCitas, editarCita } from "../../slices/citaSlice";
import { modificarHistoriaClinica } from "../../slices/historiaClinicaSlice";
import { ITEMS_POR_PAGINA } from "../../utils";
import { Odontograma } from "../../components/Odontograma/Odontograma";
import { useChromeSpeech } from "../../hooks/useChromeSpeech";

void regeneratorRuntime;

const buildHistoriaClinicaPayload = (hc, { motivo, diagnostico, informe }) => {
  if (!hc?.idHistoriaClinica) return null;

  const motivoParts = [motivo?.trim() || hc.motivo || ""].filter(Boolean);
  if (informe?.trim()) {
    motivoParts.push(`Informe de consulta:\n${informe.trim()}`);
  }

  let antecedentes = hc.antecedentesMedicos || "";
  if (diagnostico?.trim()) {
    const dxLine = `Diagnóstico: ${diagnostico.trim()}`;
    antecedentes = antecedentes ? `${antecedentes}\n${dxLine}` : dxLine;
  }

  return {
    idHistoriaClinica: hc.idHistoriaClinica,
    idEmpresa: hc.empresa?.idEmpresa ?? hc.idEmpresa,
    nombres: hc.nombres,
    apellidoPaterno: hc.apellidoPaterno,
    apellidoMaterno: hc.apellidoMaterno,
    tipoDocumento: hc.tipoDocumento,
    numeroDocumento: hc.numeroDocumento,
    email: hc.email,
    direccion: hc.direccion,
    telefono: hc.telefono,
    celular: hc.celular,
    alergia: hc.alergia,
    ectoscopia: hc.ectoscopia,
    motivo: motivoParts.join("\n\n"),
    antecedentesMedicos: antecedentes,
  };
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");
const nuevoClienteSchema = Yup.object().shape({
  nombres: Yup.string(),
  apellidoPaterno: Yup.string(),
  apellidoMaterno: Yup.string(),
  numeroDocumento: Yup.string(),
  motivo: Yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED.MOTIVO_CONSULTA),
  diagnostico: Yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED.DIAGNOSTICO),
});

const AgregarConsulta = () => {
  const { idCita, numeroDocumento: numeroDocumentoParam } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const docNum = useMemo(() => {
    if (!numeroDocumentoParam) return "";
    try {
      return decodeURIComponent(numeroDocumentoParam);
    } catch {
      return numeroDocumentoParam;
    }
  }, [numeroDocumentoParam]);

  const { cita, historiales, prev, next, total } = useSelector((state) => state.cita);

  const [listaHistorial, setListaHistorial] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [disabledPrev, setDisabledPrev] = useState(false);
  const [disabledNext, setDisabledNext] = useState(false);
  const [informe, setInforme] = useState();
  const [play, setPlay] = useState(false);
  const [syncHistoriaClinica, setSyncHistoriaClinica] = useState(true);

  const [modal, setModal] = useState(false);

  const [openSections, setOpenSections] = useState({
    consulta: true,
    odontograma: false,
    informe: false,
    historial: false
  });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  } = useChromeSpeech("es-PE");

  useEffect(() => {
    setPlay(listening);
  }, [listening]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (!idCita) return;
    const id = Number(idCita);
    if (Number.isNaN(id)) return;
    dispatch(getCita(id));
  }, [dispatch, idCita]);

  useEffect(() => {
    if (!docNum) return;
    dispatch(
      getHistorialCitas({
        numeroDocumento: docNum,
        page: currentPage,
        size: itemsPerPage,
      })
    );
  }, [dispatch, docNum, currentPage, itemsPerPage]);

  useEffect(() => {
    if (historiales) {
      setListaHistorial(historiales);
      setDisabledPrev(prev);
      setDisabledNext(next);
    }
  }, [historiales, prev, next, currentPage]);

  const handleStartRecord = () => {
    try {
      resetTranscript();
      startListening({
        continuous: true,
        language: "es-PE",
      });
    } catch (error) {
      console.error("Error al iniciar la grabación:", error);
      toast.error(error.message || VALIDATION_MESSAGES.ERROR.ERROR_INICIAR_GRABACION);
    }
  };

  const handleStopRecord = () => {
    try {
      stopListening();
    } catch (error) {
      console.error("Error al detener la grabación:", error);
      toast.error(VALIDATION_MESSAGES.ERROR.ERROR_DETENER_GRABACION);
    }
  };

  const handleResetScript = () => {
    try {
      stopListening();
      resetTranscript();
      setPlay(false);
    } catch (error) {
      console.error("Error al reiniciar la grabación:", error);
      toast.error(VALIDATION_MESSAGES.ERROR.ERROR_REINICIAR_GRABACION);
    }
  };

  const handleSubmit = (values) => {
    const c = values.cita;
    if (!c?.idCita || !c?.historiaClinica?.idHistoriaClinica || !c?.horario?.idHorario || !c?.programacionDetalle?.idProgramacionDetalle) {
      toast.error(VALIDATION_MESSAGES.ERROR.CONSULTA_DATOS_FALTANTES);
      return;
    }

    // Como en main 06: el informe dictado vive en `transcript`
    const informeFinal = (transcript || "").trim() || null;

    dispatch(
      editarCita({
        idCita: c.idCita,
        idHistoriaClinica: c.historiaClinica.idHistoriaClinica,
        idHorario: c.horario.idHorario,
        idProgramacionDetalle: c.programacionDetalle.idProgramacionDetalle,
        informe: informeFinal,
        motivo: values.motivo?.trim() || null,
        diagnostico: values.diagnostico?.trim() || null,
        atendido: true,
      })
    )
      .unwrap()
      .then(async (resultado) => {
        if (syncHistoriaClinica) {
          const payload = buildHistoriaClinicaPayload(c.historiaClinica, {
            motivo: values.motivo,
            diagnostico: values.diagnostico,
            informe: informeFinal,
          });
          if (payload) {
            try {
              await dispatch(modificarHistoriaClinica(payload)).unwrap();
            } catch (error) {
              toast.warn(error?.message || VALIDATION_MESSAGES.ERROR.CONSULTA_HC_PARCIAL);
              navigate("/dashboard/listar-consulta");
              return;
            }
          }
        }
        toast.success(resultado.message || VALIDATION_MESSAGES.SUCCESS.CONSULTA_REGISTRADA);
        navigate("/dashboard/listar-consulta");
      })
      .catch((errores) => {
        toast.error(errores.message);
      });
  };

  const handlePrev = () => {
    if (!disabledPrev) {
      const pagina = currentPage - 1;
      setCurrentPage(currentPage - 1);
      pagination(pagina);
    }
  };
  const handleNext = () => {
    if (!disabledNext) {
      const pagina = currentPage + 1;
      setCurrentPage(pagina);
      pagination(pagina);
    }
  };

  const pagination = (pagina) => {
    if (!docNum) return;
    dispatch(
      getHistorialCitas({
        numeroDocumento: docNum,
        page: pagina,
        size: itemsPerPage,
      })
    );
  };

  const handleChangeModal = (informe) => {
    setModal(!modal);
    setInforme(informe);
  };
  function closeModal() {
    setModal(false);
  }
  if (!idCita || !docNum) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h2 className="text-lg font-semibold mb-2">Faltan datos en la URL</h2>
          <p className="mb-4">
            Para registrar una consulta debe abrir esta pantalla desde la lista de consultas del día o el dashboard,
            con la ruta <code className="text-sm bg-white px-1 rounded">/dashboard/agregar-consulta/&lt;idCita&gt;/&lt;numeroDocumento&gt;</code>.
          </p>
          <Link
            to="/dashboard/listar-consulta"
            className="inline-flex text-sky-700 font-medium underline"
          >
            Ir a lista de consultas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Acordeón de Registrar Consulta */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => toggleSection('consulta')}
            className="w-full bg-white p-4 flex justify-between items-center rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-semibold text-gray-800">Datos de la consulta</span>
            <svg
              className={`w-6 h-6 transform transition-transform ${openSections.consulta ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`mt-2 transition-all duration-200 ease-in-out ${openSections.consulta ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <Formik
                initialValues={{
                  nombres: cita?.historiaClinica?.nombres ?? "",
                  apellidoPaterno: cita?.historiaClinica?.apellidoPaterno ?? "",
                  apellidoMaterno: cita?.historiaClinica?.apellidoMaterno ?? "",
                  numeroDocumento: cita?.historiaClinica?.numeroDocumento ?? docNum ?? "",
                  motivo: cita?.motivo ?? "",
                  diagnostico: cita?.diagnostico ?? "",
                  cita: cita && Object.keys(cita).length ? cita : {},
                }}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values, resetForm);
                }}
                validationSchema={nuevoClienteSchema}
              >
                {({ errors, touched, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="numeroDocumento"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Número de Documento
                        </label>
                        <Field
                          id="numeroDocumento"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-50"
                          name="numeroDocumento"
                          disabled={true}
                        />
                        {errors.numeroDocumento && touched.numeroDocumento && (
                          <div className="text-red-500 text-sm mt-1">{errors.numeroDocumento}</div>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="nombres"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nombre Completo
                        </label>
                        <Field
                          id="nombres"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-50"
                          name="nombres"
                          disabled={true}
                        />
                        {errors.nombres && touched.nombres && (
                          <div className="text-red-500 text-sm mt-1">{errors.nombres}</div>
                        )}
                      </div>
                    </div>

                    <VoiceDictationField
                      id="motivo-consulta"
                      label="Motivo de la Consulta"
                      rows={4}
                      value={values.motivo || ""}
                      onChange={(text) => setFieldValue("motivo", text)}
                      placeholder="Dicte o escriba el motivo de la consulta"
                    />
                    {errors.motivo && touched.motivo && (
                      <div className="text-red-500 text-sm mt-1">{errors.motivo}</div>
                    )}

                    <VoiceDictationField
                      id="diagnostico-consulta"
                      label="Diagnóstico"
                      rows={4}
                      value={values.diagnostico || ""}
                      onChange={(text) => setFieldValue("diagnostico", text)}
                      placeholder="Dicte o escriba el diagnóstico"
                    />
                    {errors.diagnostico && touched.diagnostico && (
                      <div className="text-red-500 text-sm mt-1">{errors.diagnostico}</div>
                    )}

                    <label className="flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={syncHistoriaClinica}
                        onChange={(e) => setSyncHistoriaClinica(e.target.checked)}
                      />
                      <span>
                        Al guardar, actualizar también la <strong>historia clínica</strong> con
                        motivo, diagnóstico e informe dictado.
                      </span>
                    </label>

                    <div>
                      <input
                        type="submit"
                        value="Registrar Consulta"
                        className="w-full bg-sky-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-sky-700 transition-colors cursor-pointer"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* Acordeón de Odontograma */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('odontograma')}
            className="w-full bg-white p-4 flex justify-between items-center rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-800">Odontograma</h2>
            <svg
              className={`w-6 h-6 transform transition-transform ${openSections.odontograma ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`mt-2 transition-all duration-200 ease-in-out ${openSections.odontograma ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="bg-white shadow-lg rounded-lg">
              <Odontograma />
            </div>
          </div>
        </div>

        {/* Acordeón de Informe */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('informe')}
            className="w-full bg-white p-4 flex justify-between items-center rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-800">Informe</h2>
            <svg
              className={`w-6 h-6 transform transition-transform ${openSections.informe ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`mt-2 transition-all duration-200 ease-in-out ${openSections.informe ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="bg-white shadow-lg rounded-lg p-6">
              {!browserSupportsSpeechRecognition ? (
                <div className="mb-4 text-center p-4 bg-yellow-100 text-yellow-800 rounded-md">
                  Tu navegador no soporta el reconocimiento de voz. Use Chrome.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {play ? (
                      <button
                        type="button"
                        onClick={handleStopRecord}
                        className="flex-1 px-4 py-2 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Detener Dictado
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartRecord}
                        className="flex-1 px-4 py-2 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        Iniciar Dictado
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleResetScript}
                      className="px-4 py-2 rounded-md font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>

                  <div className="relative">
                    <div className={`absolute -top-3 right-2 flex items-center gap-2 ${play ? "text-red-500" : "text-gray-400"}`}>
                      {play && (
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                        </span>
                      )}
                      <span className="text-sm">{play ? "Dictando..." : "Dictado detenido"}</span>
                    </div>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-50 mt-2"
                      value={transcript}
                      placeholder="Escriba o dicte el informe aquí..."
                      rows={10}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acordeón de Historial */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('historial')}
            className="w-full bg-white p-4 flex justify-between items-center rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-800">Historial de Consultas</h2>
            <svg
              className={`w-6 h-6 transform transition-transform ${openSections.historial ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`mt-2 transition-all duration-200 ease-in-out ${openSections.historial ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fecha de Atención
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {listaHistorial.length ? (
                      listaHistorial.map((cita) => (
                        <tr key={cita.idCita}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              className="w-full text-left px-4 py-2 text-sm text-sky-600 hover:bg-sky-50 rounded transition-colors"
                              onClick={() => handleChangeModal(cita.informe)}
                            >
                              {dayjs(cita.programacionDetalle.fecha).format("DD/MM/YYYY")}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No hay consultas registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {total && total > ITEMS_POR_PAGINA && (
                <div className="mt-4">
                  <Pagination
                    totalPosts={listaHistorial.length}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    disabledPrev={disabledPrev}
                    setDisabledPrev={setDisabledPrev}
                    disabledNext={disabledNext}
                    setDisabledNext={setDisabledNext}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {modal && (
          <Modal
            isOpen={modal}
            style={customStyles}
            onRequestClose={closeModal}
            contentLabel="Detalle de Consulta"
          >
            <AtencionDetalleModal informe={informe} />
          </Modal>
        )}
      </div>
    </>
  );
};

export default AgregarConsulta;
