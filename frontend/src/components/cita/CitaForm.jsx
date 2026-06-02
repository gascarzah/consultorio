import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import {
  resetState,
  getCitasIdProgramacionDetalle,
  registrarCita,
  editarCita,
} from "../../slices/citaSlice";
import { getOdontologosPorEmpresa } from "../../slices/empleadoSlice";
import { getProgramacionDetalles } from "../../slices/programacionDetalleSlice";
import { getHorarios } from "../../slices/horarioSlice";
import { getHistoriaClinicas } from "../../slices/historiaClinicaSlice";
import { getUsuario } from "../../slices/usuarioSlice";

import { LISTAR_CITA, MENSAJE_GUARDADO_EXITOSO, MENSAJE_MODIFICADO_EXITOSO, SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS, SweetCrud } from "../../utils";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from "react-toastify";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";

const nuevaCitaSchema = Yup.object().shape({
  numeroDocumento: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.MEDICO),
  idProgramacionDetalle: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.DIA),
  idHorario: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.HORARIO),
  idHistoriaClinica: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.NOMBRE_HISTORIA_CLINICA),
});

export const CitaForm = ({ cita }) => {
  const { email } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.usuario);
  const { empleados } = useSelector((state) => state.empleado);
  
  // Debug: Log de la cita recibida

  // Debug: useEffect para monitorear cambios en la cita
  useEffect(() => {
    if (cita?.idCita) {
    }
  }, [cita]);
  

  const [dias, setDias] = useState([]);
  const [listaCitas, setListaCitas] = useState([]);
  const [listaHorarios, setListaHorarios] = useState([]);
  const [listaEmpleados, setListaEmpleados] = useState([]);
  
  const [items, setItems] = useState([]);
  const [handleSelectHistoriaClinica, setHandleSelectHistoriaClinica] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [listaHistoriaClinicas, setListaHistoriaClinicas] = useState([]);
  const [value, onChange] = useState(new Date());

  const normalizeToArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  const medicoActual = cita?.programacionDetalle?.empleado
    ? {
        numeroDocumento: cita.programacionDetalle.empleado.numeroDocumento,
        apellidoPaterno: cita.programacionDetalle.empleado.apellidoPaterno || "",
        apellidoMaterno: cita.programacionDetalle.empleado.apellidoMaterno || "",
        nombres: cita.programacionDetalle.empleado.nombres || "",
      }
    : null;

  const diaActual = cita?.programacionDetalle
    ? {
        idProgramacionDetalle: cita.programacionDetalle.idProgramacionDetalle,
        diaSemana: cita.programacionDetalle.diaSemana || "Día",
        fecha: cita.programacionDetalle.fecha || "",
      }
    : null;
  const diasList = normalizeToArray(dias);
  const empleadosList = normalizeToArray(listaEmpleados);
  const horariosList = normalizeToArray(listaHorarios);

  useEffect(() => {
    if (email) {
      dispatch(getUsuario(email))
        .unwrap()
        .then((resultado) => {
        })
        .catch((error) => {
          console.error("Error al obtener datos del usuario:", error);
          toast.error("Error al obtener datos del usuario");
        });
    }
  }, [email, dispatch]);

  useEffect(() => {
    if (user?.idEmpresa) {
      dispatch(getOdontologosPorEmpresa(user.idEmpresa))
        .unwrap()
        .then((resultado) => {
          setListaEmpleados(normalizeToArray(resultado));
        })
        .catch((errores) => {
          console.error("Error al obtener empleados:", errores);
          setListaEmpleados([]);
          toast.error(errores.message || "Error al obtener la lista de empleados");
        });
    } else {
    }
  }, [user?.idEmpresa, dispatch]);

  useEffect(() => {
    dispatch(getHorarios())
      .unwrap()
      .then((resultado) => {
        setListaHorarios(normalizeToArray(resultado));
      })
      .catch((errores) => {
        console.error("Error al obtener horarios:", errores);
        setListaHorarios([]);
        toast.error(errores.message || "Error al obtener horarios");
      });
  }, [dispatch]);

  const getHistoriasClinicas = useCallback(() => {
    dispatch(getHistoriaClinicas())
      .unwrap()
      .then((resultado) => {
        const manyItems = resultado.map((historiaClinica, i) => ({
          id: historiaClinica.idHistoriaClinica,
          name:
          historiaClinica.apellidoPaterno +
            " " +
            historiaClinica.apellidoMaterno +
            ", " +
            historiaClinica.nombres,
        }));

        setListaHistoriaClinicas(manyItems);
      })
      .catch((errores) => {
        setListaHistoriaClinicas([]);
        toast.error(errores.message);
      });
  }, [dispatch]);

  useEffect(() => {
    getHistoriasClinicas();
  }, [getHistoriasClinicas]);

  const handleProgramacionDetallada = useCallback((numeroDocumento) => {
    if (numeroDocumento) {
      dispatch(
        getProgramacionDetalles({
          numeroDocumento: numeroDocumento,
          idEmpresa: user.idEmpresa,
        })
      )
        .unwrap()
        .then((resultado) => {
          setDias(normalizeToArray(resultado));
          setListaCitas([]);
        })
        .catch((errores) => {
          setListaCitas([]);
          setDias([]);
        });
    } else {
      setListaCitas([]);
      setDias([]);
    }
  }, [dispatch, user?.idEmpresa]);
  useEffect(() => {
    if (!cita?.idCita || !user?.idEmpresa) return;

    const numeroDocumentoMedico = cita?.programacionDetalle?.empleado?.numeroDocumento;
    if (numeroDocumentoMedico) {
      handleProgramacionDetallada(numeroDocumentoMedico);
    }

    const idHistoriaClinica = cita?.historiaClinica?.idHistoriaClinica;
    if (idHistoriaClinica) {
      setHandleSelectHistoriaClinica({ id: idHistoriaClinica });
    }
  }, [
    cita?.historiaClinica?.idHistoriaClinica,
    cita?.idCita,
    cita?.programacionDetalle?.empleado?.numeroDocumento,
    handleProgramacionDetallada,
    user?.idEmpresa
  ]);


  const handleSubmit = (values, resetForm) => {
    const idHistoriaClinicaSeleccionada = values.idHistoriaClinica || handleSelectHistoriaClinica?.id;
    if (!idHistoriaClinicaSeleccionada) {
      toast.error("Debe seleccionar un cliente de la lista");
      return;
    }

    if (cita?.idCita) {
      dispatch(
        editarCita({
          ...values,
          idHistoriaClinica: idHistoriaClinicaSeleccionada,
          atendido: false,
        })
      )
        .unwrap()
        .then((resultado) => {
          SweetCrud(SWEET_MODIFICO,SWEET_SUCESS)
          navigate(LISTAR_CITA);
        })
        .catch((errores) => {
          
        });
    } else {

      const valores = {
        ...values,
        idHistoriaClinica: idHistoriaClinicaSeleccionada,
        atendido: false,
      };


      dispatch(registrarCita(valores))
        .unwrap()
        .then((resultado) => {
          SweetCrud(SWEET_GUARDO,SWEET_SUCESS) 
          navigate(LISTAR_CITA);
        })
        .catch((errores) => {
          toast.error(errores.message);
        });
    }
  };

  const handleCitas = (idProgramacionDetalle) => {
    //   "handleCitas idProgramacionDetalle ====>>>>  ",
    //   idProgramacionDetalle
    // );

    if (idProgramacionDetalle) {
      dispatch(getCitasIdProgramacionDetalle(idProgramacionDetalle))
        .unwrap()
        .then((resultado) => {
          setListaCitas(resultado);
        })
        .catch((errores) => {
        });
    } else {
      setListaCitas([]);
    }
  };

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
  };

  const handleOnHover = (result) => {
    // the item hovered
  };

  const handleOnSelect = (item) => {
    // the item selected
    setHandleSelectHistoriaClinica(item);
  };

  const handleOnFocus = () => {
  };

  const formatResult = (item) => {
    return (
      <>
        {/* <span style={{ display: "block", textAlign: "left" }}>
          id: {item.id}
        </span> */}
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  return (
    <>
      <Formik
        initialValues={{
          idCita: cita?.idCita ?? "",
          numeroDocumento:
            cita?.programacionDetalle?.empleado?.numeroDocumento ?? "",
          idProgramacionDetalle:
            cita?.programacionDetalle?.idProgramacionDetalle ?? "",
          idHorario: cita?.horario?.idHorario ?? "",
          idHistoriaClinica: cita?.historiaClinica?.idHistoriaClinica ?? "",
        }}
        // Debug: Log de initialValues
        onInit={(values) => {
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        validationSchema={nuevaCitaSchema}
      >
        {({ errors, touched, values, handleChange, setFieldValue }) => {
          // Debug: Log de values en render
          
          return (
            <Form className="my-10 bg-white shadow rounded p-10 w-2/5 flex flex-col "> 
              <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
                {cita?.idCita ? "Editar Cita" : "Registrar Cita"}
              </h1>
              <div className="my-3">
                <label
                  htmlFor="numeroDocumento"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Medico
                </label>
                <Field
                  as="select"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  value={values.numeroDocumento}
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  onChange={async (e) => {
                    const { value } = e.target;
                    setFieldValue("numeroDocumento", value);
                    handleProgramacionDetallada(value);
                  }}
                >
                  <option value="" label="Selecciona medico">
                    Selecciona un Medico
                  </option>
                  {medicoActual && !empleadosList.some((e) => e.numeroDocumento === medicoActual.numeroDocumento) && (
                    <option value={medicoActual.numeroDocumento}>
                      {medicoActual.apellidoPaterno} {medicoActual.apellidoMaterno}, {medicoActual.nombres}
                    </option>
                  )}
                  {empleadosList.length > 0 &&
                    empleadosList.map((empleado, index) => {
                      return (
                        <option
                          key={`medico-${index}-${empleado.numeroDocumento}`}
                          value={empleado.numeroDocumento}
                        >
                          {empleado.apellidoPaterno}{" "}
                          {empleado.apellidoMaterno},{" "}
                          {empleado.nombres}
                        </option>
                      );
                    })}
                </Field>
                <ErrorMessage
                  name="numeroDocumento"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

                  {/* <div className="my-3">
                  <Calendar onChange={onChange} value={value} minDate={value} /> */}
                  {/* </div> */}

              <div className="my-3">
                <label
                  htmlFor="idProgramacionDetalle"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Dia
                </label>
                <Field
                  as="select"
                  id="idProgramacionDetalle"
                  name="idProgramacionDetalle"
                  value={values.idProgramacionDetalle}
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  onChange={async (e) => {
                    const { value } = e.target;
                    setFieldValue("idProgramacionDetalle", value);
                    handleCitas(value);
                  }}
                >
                  <option value="" label="Selecciona dia">
                    Selecciona un Dia
                  </option>
                  {diaActual && !diasList.some((d) => d.idProgramacionDetalle === diaActual.idProgramacionDetalle) && (
                    <option value={diaActual.idProgramacionDetalle}>
                      {diaActual.diaSemana} ({diaActual.fecha ? diaActual.fecha.split("-").reverse().join("/") : "Sin fecha"})
                    </option>
                  )}
                  {diasList.length > 0 &&
                    diasList.map((item, index) => {
                      const fechaFormateada = item.fecha
                        ? item.fecha.split("-").reverse().join("/")
                        : "Sin fecha";
                      return (
                        <option
                          key={`dia-${index}-${item.idProgramacionDetalle}`}
                          value={item.idProgramacionDetalle}
                        >
                          {item.diaSemana} ({fechaFormateada})
                        </option>
                      );
                    })}
                </Field>
                <ErrorMessage
                  name="idProgramacionDetalle"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-3">
                <label
                  htmlFor="idHorario"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Horario
                </label>
                <Field
                  as="select"
                  id="idHorario"
                  name="idHorario"
                  value={values.idHorario}
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  onChange={async (e) => {
                    const { value } = e.target;
                    setFieldValue("idHorario", value);
                    handleCitas(value);
                  }}
                >
                  <option value="" label="Selecciona horario">
                    Selecciona un Horario
                  </option>
                  {horariosList.length > 0 &&
                    horariosList.map((item, index) => {
                      return (
                        <option key={`horario-${index}-${item.idHorario}`} value={item.idHorario}>
                          {item.descripcion}
                        </option>
                      );
                    })}
                </Field>
                <ErrorMessage
                  name="idHorario"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-3">
                <label
                  htmlFor="cliente"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Cliente
                </label>

                {cita?.idCita ? (
                  
                  <div className="my-3">
                    <select
                      name="idHistoriaClinica"
                      value={values.idHistoriaClinica}
                      onChange={async (e) => {
                        const { value } = e.target;
                        setFieldValue("idHistoriaClinica", value);
                      }}
                      className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    >
                      <option value="" label="Selecciona un cliente">
                        Select un Cliente{" "}
                      </option>
                      
                      {listaHistoriaClinicas?.map((item, index) => {
                        return (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : (
                  <>
                    <ReactSearchAutocomplete
                      items={listaHistoriaClinicas}
                      onSearch={handleOnSearch}
                      onHover={handleOnHover}
                      onSelect={(item) => {
                        handleOnSelect(item);
                        setFieldValue("idHistoriaClinica", item?.id || "");
                      }}
                      onFocus={handleOnFocus}
                      autoFocus
                      formatResult={formatResult}
                    />
                    <Field type="hidden" name="idHistoriaClinica" />
                  </>
                )}
                <ErrorMessage
                  name="idHistoriaClinica"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
                >
                  {cita?.idCita ? "Actualizar Cita" : "Registrar Cita"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};


