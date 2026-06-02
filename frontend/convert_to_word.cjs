const fs = require('fs');
const path = require('path');

// Mapeo de HUs con sus componentes correspondientes
const huComponents = {
  'HU001': {
    title: 'Inicio de Sesión',
    component: 'Login.jsx',
    description: 'Componente de autenticación principal del sistema'
  },
  'HU002': {
    title: 'Recuperación de Contraseña',
    component: 'OlvidePassword.jsx',
    description: 'Formulario para recuperar contraseña olvidada'
  },
  'HU003': {
    title: 'Cambio de Contraseña',
    component: 'CambiarPasswordForm.jsx',
    description: 'Formulario para cambiar contraseña actual'
  },
  'HU004': {
    title: 'Persistencia de Sesión',
    component: 'SetupInterceptors.js',
    description: 'Configuración de interceptores para manejo de sesión'
  },
  'HU005': {
    title: 'Crear Usuario',
    component: 'AgregarUsuario.jsx',
    description: 'Formulario para crear nuevos usuarios'
  },
  'HU006': {
    title: 'Editar Usuario',
    component: 'EditarUsuario.jsx',
    description: 'Formulario para editar usuarios existentes'
  },
  'HU007': {
    title: 'Listar Usuarios',
    component: 'index.jsx (usuario)',
    description: 'Lista paginada de usuarios del sistema'
  },
  'HU008': {
    title: 'Eliminar Usuario',
    component: 'index.jsx (usuario)',
    description: 'Funcionalidad de eliminación de usuarios'
  },
  'HU009': {
    title: 'Registrar Empleado',
    component: 'AgregarEmpleado.jsx',
    description: 'Formulario para registrar nuevos empleados'
  },
  'HU010': {
    title: 'Editar Empleado',
    component: 'EditarEmpleado.jsx',
    description: 'Formulario para editar empleados existentes'
  },
  'HU011': {
    title: 'Listar Empleados',
    component: 'index.jsx (empleado)',
    description: 'Lista paginada de empleados'
  },
  'HU012': {
    title: 'Eliminar Empleado',
    component: 'index.jsx (empleado)',
    description: 'Funcionalidad de eliminación de empleados'
  },
  'HU013': {
    title: 'Crear Programación',
    component: 'Agregar.jsx (programacion)',
    description: 'Formulario para crear programaciones semanales'
  },
  'HU014': {
    title: 'Asignar Horarios a Médicos',
    component: 'AgregarProgramacionDetalle.jsx',
    description: 'Formulario para asignar horarios específicos'
  },
  'HU015': {
    title: 'Visualizar Programaciones',
    component: 'index.jsx (programacion)',
    description: 'Lista de programaciones existentes'
  },
  'HU016': {
    title: 'Eliminar Programación',
    component: 'index.jsx (programacion)',
    description: 'Funcionalidad de eliminación de programaciones'
  },
  'HU017': {
    title: 'Crear Cita',
    component: 'Agregar.jsx (cita)',
    description: 'Formulario para crear citas de pacientes'
  },
  'HU018': {
    title: 'Editar Cita',
    component: 'Editar.jsx (cita)',
    description: 'Formulario para editar citas existentes'
  },
  'HU019': {
    title: 'Listar Citas',
    component: 'index.jsx (cita)',
    description: 'Lista paginada de citas'
  },
  'HU020': {
    title: 'Cancelar Cita',
    component: 'index.jsx (cita)',
    description: 'Funcionalidad de cancelación de citas'
  },
  'HU021': {
    title: 'Registrar Consulta',
    component: 'Agregar.jsx (consulta)',
    description: 'Formulario para registrar consultas médicas'
  },
  'HU022': {
    title: 'Acceder Historial de Consultas',
    component: 'index.jsx (consulta)',
    description: 'Vista del historial de consultas'
  },
  'HU023': {
    title: 'Editar Consulta',
    component: 'Editar.jsx (consulta)',
    description: 'Formulario para editar consultas'
  },
  'HU024': {
    title: 'Crear Odontograma',
    component: 'Odontograma.jsx',
    description: 'Componente principal del odontograma'
  },
  'HU025': {
    title: 'Aplicar Procedimientos Dentales',
    component: 'Odontograma.jsx',
    description: 'Funcionalidad de aplicación de procedimientos'
  },
  'HU026': {
    title: 'Seleccionar Superficies Dentales',
    component: 'Odontograma.jsx',
    description: 'Selección de superficies específicas'
  },
  'HU027': {
    title: 'Visualizar Historial de Procedimientos',
    component: 'Odontograma.jsx',
    description: 'Vista del historial de procedimientos'
  },
  'HU028': {
    title: 'Crear Historia Clínica',
    component: 'AgregarHistoriaClinica.jsx',
    description: 'Formulario para crear historias clínicas'
  },
  'HU029': {
    title: 'Editar Historia Clínica',
    component: 'EditarHistoriaClinica.jsx',
    description: 'Formulario para editar historias clínicas'
  },
  'HU030': {
    title: 'Acceder Historial Médico',
    component: 'index.jsx (historiaClinica)',
    description: 'Vista del historial médico completo'
  },
  'HU031': {
    title: 'Registrar Empresa',
    component: 'AgregarEmpresa.jsx',
    description: 'Formulario para registrar nuevas empresas'
  },
  'HU032': {
    title: 'Editar Empresa',
    component: 'EditarEmpresa.jsx',
    description: 'Formulario para editar empresas existentes'
  },
  'HU033': {
    title: 'Listar Empresas',
    component: 'index.jsx (empresa)',
    description: 'Lista de empresas registradas'
  },
  'HU034': {
    title: 'Crear Rol',
    component: 'AgregarRol.jsx',
    description: 'Formulario para crear roles con permisos'
  },
  'HU035': {
    title: 'Asignar Menús a Roles',
    component: 'index.jsx (rolMenu)',
    description: 'Gestión de asignación de menús a roles'
  },
  'HU036': {
    title: 'Editar Permisos de Roles',
    component: 'EditarRol.jsx',
    description: 'Formulario para editar permisos de roles'
  },
  'HU037': {
    title: 'Dashboard Administrativo',
    component: 'Dashboard.jsx',
    description: 'Panel principal con estadísticas del consultorio'
  },
  'HU038': {
    title: 'Agenda Médica',
    component: 'Dashboard.jsx',
    description: 'Vista de agenda de citas del médico'
  },
  'HU039': {
    title: 'Gestión de Citas Recepción',
    component: 'Dashboard.jsx',
    description: 'Gestión de citas desde recepción'
  },
  'HU040': {
    title: 'Configurar Horarios',
    component: 'AgregarHorario.jsx',
    description: 'Formulario para configurar horarios de trabajo'
  },
  'HU041': {
    title: 'Editar Horarios',
    component: 'EditarHorario.jsx',
    description: 'Formulario para editar horarios existentes'
  },
  'HU042': {
    title: 'Listar Horarios',
    component: 'index.jsx (horario)',
    description: 'Lista de horarios configurados'
  }
};

// Función para obtener el código del componente
function getComponentCode(huId) {
  const component = huComponents[huId];
  if (!component) return '';

  // Código real de algunos componentes clave
  const realCode = {
    'HU001': `
// Login.jsx - Componente de Inicio de Sesión
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { Alerta } from "../components";
import { login } from "../slices/authSlice";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email no valido")
    .required("El email es obligatorio"),
  password: Yup.string().required("Password obligatorio"),
});

const Login = () => {
  const [alerta, setAlerta] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    dispatch(login(values))
      .unwrap()
      .then((resultado) => {
        navigate("/dashboard");
      })
      .catch((errores) => {
        setAlerta({
          msg: "Usuario no existe",
          error: true
        });
      });
  };

  return (
    <>
      <h1 className="text-sky-600 text-center font-black text-6xl">
        Inicia Sesión
      </h1>
      <ToastContainer />
      {alerta.msg && <Alerta msg={alerta.msg} error={alerta.error} />}

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={loginSchema}
      >
        {({ errors, touched }) => (
          <Form className="my-10 bg-white shadow rounded p-10">
            <div className="my-5">
              <label htmlFor="email" className="uppercase text-gray-600 block font-bold">
                Email
              </label>
              <Field
                id="email"
                type="email"
                placeholder="Email"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                name="email"
              />
              {errors.email && touched.email && <Alerta msg={errors.email} error={true} />}
            </div>
            
            <div className="my-5">
              <label htmlFor="password" className="uppercase text-gray-600 block font-bold">
                Password
              </label>
              <Field
                id="password"
                type="password"
                placeholder="Password de Registro"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                name="password"
              />
              {errors.password && touched.password && <Alerta msg={errors.password} error={true} />}
            </div>

            <input
              type="submit"
              value="Iniciar Sesión"
              className="bg-sky-700 mb-5 w-full rounded py-3 text-white font-bold uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
            />
            
            <Link to="/olvide-password" className="block text-center my-5 text-slate-500 uppercase text-sm">
              Olvidé mi password
            </Link>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;`,

    'HU024': `
// Odontograma.jsx - Componente Principal del Odontograma
import React, { useState } from 'react';
import './Odontograma.css';
import { toast, Toaster } from 'react-hot-toast';
import { AdvancedProcedures } from './AdvancedProcedures';

export const Odontograma = () => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [activeSurface, setActiveSurface] = useState(null);
  const [showAdvancedProcedures, setShowAdvancedProcedures] = useState(false);

  // Estructura de los dientes según la disposición solicitada
  const teeth = {
    upperAdult: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    upperChild: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    lowerChild: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
    lowerAdult: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
  };

  const procedures_list = [
    { id: 'caries', name: 'Caries', color: '#FF4444', icon: '●', surfaces: true },
    { id: 'restoration', name: 'Restauración', color: '#4444FF', icon: '■', surfaces: true },
    { id: 'extraction', name: 'Extracción', color: '#000000', icon: '✕', surfaces: false },
    { id: 'crown', name: 'Corona', color: '#FFD700', icon: '◎', surfaces: false },
    { id: 'root_canal', name: 'Endodoncia', color: '#44AA44', icon: '▲', surfaces: false },
    // ... más procedimientos
  ];

  const surfaces = [
    { id: 'vestibular', name: 'Vestibular', position: 'top' },
    { id: 'mesial', name: 'Mesial', position: 'right' },
    { id: 'oclusal', name: 'Oclusal', position: 'center' },
    { id: 'distal', name: 'Distal', position: 'left' },
    { id: 'lingual', name: 'Lingual', position: 'bottom' }
  ];

  const [procedures, setProcedures] = useState({});

  const handleToothClick = (toothNumber) => {
    setSelectedTooth(toothNumber);
    setActiveSurface(null);
  };

  const handleProcedureClick = (procedureId) => {
    if (!selectedTooth) {
      toast.error('Por favor seleccione un diente primero');
      return;
    }

    const procedure = procedures_list.find(p => p.id === procedureId);
      
    if (procedure.surfaces && !activeSurface) {
      toast.error('Por favor seleccione una superficie del diente');
      return;
    }

    setProcedures(prev => {
      const toothProcedures = prev[selectedTooth] || {};
      
      if (!procedure.surfaces) {
        return {
          ...prev,
          [selectedTooth]: { full: procedureId }
        };
      }
      
      return {
        ...prev,
        [selectedTooth]: {
          ...toothProcedures,
          [activeSurface]: procedureId
        }
      };
    });

    setActiveSurface(null);
    setSelectedTooth(null);
  };

  const renderToothSection = (section, isChild = false, isUpper = true) => {
    return (
      <div className="flex justify-center gap-1">
        {section.map((tooth) => (
          <div key={tooth} className="tooth-container">
            <div className="tooth">
              {isUpper && (
                <span className={\`tooth-number \${isChild ? 'tooth-number-child' : ''}\`}>
                  {tooth}
                </span>
              )}
              <div 
                className={\`tooth-crown \${selectedTooth === tooth ? 'selected' : ''}\`}
                onClick={() => handleToothClick(tooth)}
                style={{ 
                  background: getToothColor(tooth),
                  borderColor: selectedTooth === tooth ? '#2563eb' : '#1e293b'
                }}
              >
                <div className="tooth-inner"></div>
              </div>
              {!isUpper && (
                <span className={\`tooth-number \${isChild ? 'tooth-number-child' : ''}\`}>
                  {tooth}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="odontograma-main">
      <Toaster position="top-right" />
      <div className="odontograma-content">
        <div className="dental-chart">
          <div className="combined-odontograma">
            <div className="teeth-row teeth-row-upper-adult">
              {renderToothSection(teeth.upperAdult, false, true)}
            </div>
            <div className="teeth-row teeth-row-upper-child">
              {renderToothSection(teeth.upperChild, true, true)}
            </div>
            <div className="mouth-separator"></div>
            <div className="teeth-row teeth-row-lower-child">
              {renderToothSection(teeth.lowerChild, true, false)}
            </div>
            <div className="teeth-row teeth-row-lower-adult">
              {renderToothSection(teeth.lowerAdult, false, false)}
            </div>
          </div>
        </div>
        
        <div className="procedures-panel">
          <h3 className="panel-title">Procedimientos</h3>
          <div className="procedures-list">
            {procedures_list.slice(0, 10).map((procedure) => (
              <button
                key={procedure.id}
                onClick={() => handleProcedureClick(procedure.id)}
                className="procedure-btn"
              >
                <span className="procedure-icon" style={{ color: procedure.color }}>
                  {procedure.icon}
                </span>
                <span className="procedure-name">{procedure.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};`,

    'HU017': `
// Agregar.jsx (cita) - Formulario para Crear Citas
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const citaSchema = Yup.object().shape({
  paciente: Yup.string().required('El paciente es obligatorio'),
  medico: Yup.string().required('El médico es obligatorio'),
  fecha: Yup.date().required('La fecha es obligatoria'),
  hora: Yup.string().required('La hora es obligatoria'),
  tipoCita: Yup.string().required('El tipo de cita es obligatorio'),
  observaciones: Yup.string()
});

const AgregarCita = () => {
  const dispatch = useDispatch();
  const [medicos, setMedicos] = useState([]);
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    // Cargar médicos y horarios disponibles
    // dispatch(getMedicos());
    // dispatch(getHorarios());
  }, [dispatch]);

  const handleSubmit = (values, { resetForm }) => {
    // dispatch(crearCita(values))
    //   .unwrap()
    //   .then(() => {
    //     toast.success('Cita creada exitosamente');
    //     resetForm();
    //   })
    //   .catch((error) => {
    //     toast.error(error.message);
    //   });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Nueva Cita</h1>
      
      <Formik
        initialValues={{
          paciente: '',
          medico: '',
          fecha: '',
          hora: '',
          tipoCita: '',
          observaciones: ''
        }}
        validationSchema={citaSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Paciente
                </label>
                <Field
                  name="paciente"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nombre del paciente"
                />
                {errors.paciente && touched.paciente && (
                  <p className="text-red-500 text-xs italic">{errors.paciente}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Médico
                </label>
                <Field
                  as="select"
                  name="medico"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Seleccionar médico</option>
                  {medicos.map(medico => (
                    <option key={medico.id} value={medico.id}>
                      {medico.nombre}
                    </option>
                  ))}
                </Field>
                {errors.medico && touched.medico && (
                  <p className="text-red-500 text-xs italic">{errors.medico}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha
                </label>
                <Field
                  type="date"
                  name="fecha"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.fecha && touched.fecha && (
                  <p className="text-red-500 text-xs italic">{errors.fecha}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Hora
                </label>
                <Field
                  as="select"
                  name="hora"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Seleccionar hora</option>
                  {horarios.map(horario => (
                    <option key={horario.id} value={horario.hora}>
                      {horario.hora}
                    </option>
                  ))}
                </Field>
                {errors.hora && touched.hora && (
                  <p className="text-red-500 text-xs italic">{errors.hora}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Cita
                </label>
                <Field
                  as="select"
                  name="tipoCita"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="consulta">Consulta</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="extraccion">Extracción</option>
                  <option value="ortodoncia">Ortodoncia</option>
                </Field>
                {errors.tipoCita && touched.tipoCita && (
                  <p className="text-red-500 text-xs italic">{errors.tipoCita}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Observaciones
                </label>
                <Field
                  as="textarea"
                  name="observaciones"
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Crear Cita
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AgregarCita;`,

    'HU037': `
// Dashboard.jsx - Panel Administrativo Principal
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ClockIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    citasHoy: 0,
    citasPendientes: 0,
    pacientesActivos: 0,
    ingresosMes: 0
  });

  useEffect(() => {
    // Cargar estadísticas del dashboard
    // dispatch(getDashboardStats());
  }, [dispatch]);

  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={\`p-2 rounded-full \${color}\`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const RecentAppointments = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Citas Recientes</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Lista de citas recientes */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Juan Pérez</p>
              <p className="text-sm text-gray-600">Consulta General</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Hoy, 10:00 AM</p>
              <p className="text-sm text-gray-600">Dr. García</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">María López</p>
              <p className="text-sm text-gray-600">Limpieza Dental</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Hoy, 2:30 PM</p>
              <p className="text-sm text-gray-600">Dr. Rodríguez</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          
          {/* Estadísticas */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Citas Hoy"
              value={stats.citasHoy}
              icon={CalendarIcon}
              color="bg-blue-500"
            />
            <StatsCard
              title="Citas Pendientes"
              value={stats.citasPendientes}
              icon={ClockIcon}
              color="bg-yellow-500"
            />
            <StatsCard
              title="Pacientes Activos"
              value={stats.pacientesActivos}
              icon={UserGroupIcon}
              color="bg-green-500"
            />
            <StatsCard
              title="Ingresos del Mes"
              value={\`$\${stats.ingresosMes.toLocaleString()}\`}
              icon={CurrencyDollarIcon}
              color="bg-purple-500"
            />
          </div>

          {/* Contenido principal */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentAppointments />
            
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">C</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Nueva cita creada
                      </p>
                      <p className="text-sm text-gray-500">
                        Cita para Juan Pérez programada para mañana
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      Hace 2 horas
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-medium">P</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Paciente registrado
                      </p>
                      <p className="text-sm text-gray-500">
                        María López agregada al sistema
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      Hace 4 horas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`
  };

  // Si tenemos código real para esta HU, lo devolvemos
  if (realCode[huId]) {
    return realCode[huId];
  }

  // Si no, devolvemos el código genérico
  return `
// ${component.title}
// Archivo: src/pages/${component.component}
// Descripción: ${component.description}

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ${component.title.replace(/\s+/g, '')} = () => {
  const dispatch = useDispatch();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">${component.title}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 mb-4">
          ${component.description}
        </p>
        {/* Aquí iría el contenido específico del componente */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">
            Componente correspondiente a la ${huId}
          </p>
        </div>
        <div class="visual-section"><div class="visual-title">Vista de la pantalla:</div>${getComponentVisualHTML(huId)}</div>
      </div>
    </div>
  );
};

export default ${component.title.replace(/\s+/g, '')};
  `;
}

// Función para obtener la maqueta HTML visual de la pantalla para cada HU
function getComponentVisualHTML(huId) {
  // Visualizaciones simplificadas usando tablas HTML que Word puede renderizar mejor
  const visualHTML = {
    'HU001': `
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
  <tr><td colspan="2" style="background:#0ea5e9;color:white;text-align:center;padding:15px;font-weight:bold;font-size:18px;">Inicia Sesión</td></tr>
  <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="ejemplo@email.com" /></td></tr>
  <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Password:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="password" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="••••••••" /></td></tr>
  <tr><td colspan="2" style="padding:10px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:10px 20px;border:none;border-radius:4px;font-weight:bold;">Iniciar Sesión</button></td></tr>
  <tr><td colspan="2" style="padding:10px;border:1px solid #ddd;text-align:center;"><a href="#" style="color:#0ea5e9;">Olvidé mi password</a></td></tr>
</table>
`,
    'HU024': `
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
  <tr><td colspan="16" style="background:#0ea5e9;color:white;text-align:center;padding:15px;font-weight:bold;font-size:18px;">Odontograma - Dientes Superiores Adultos</td></tr>
  <tr>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">18</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">17</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">16</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">15</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">14</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">13</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">12</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">11</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">21</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">22</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">23</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">24</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">25</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">26</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">27</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">28</td>
  </tr>
</table>
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
  <tr><td colspan="10" style="background:#f59e0b;color:white;text-align:center;padding:10px;font-weight:bold;">Dientes Temporales Superiores</td></tr>
  <tr>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">55</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">54</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">53</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">52</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">51</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">61</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">62</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">63</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">64</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">65</td>
  </tr>
</table>
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
  <tr><td colspan="10" style="background:#f59e0b;color:white;text-align:center;padding:10px;font-weight:bold;">Dientes Temporales Inferiores</td></tr>
  <tr>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">85</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">84</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">83</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">82</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">81</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">71</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">72</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">73</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">74</td>
    <td style="border:2px solid #333;padding:6px;text-align:center;background:#fff;font-weight:bold;">75</td>
  </tr>
</table>
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
  <tr><td colspan="16" style="background:#0ea5e9;color:white;text-align:center;padding:15px;font-weight:bold;font-size:18px;">Odontograma - Dientes Inferiores Adultos</td></tr>
  <tr>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">48</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">47</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">46</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">45</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">44</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">43</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">42</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">41</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">31</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">32</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">33</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">34</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">35</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">36</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">37</td>
    <td style="border:2px solid #333;padding:8px;text-align:center;background:#fff;font-weight:bold;">38</td>
  </tr>
</table>
<div style="background:#f0f9ff;padding:15px;border:1px solid #0ea5e9;border-radius:4px;margin:20px 0;">
  <strong>Procedimientos disponibles:</strong> Caries (●), Restauración (■), Extracción (✕), Corona (◎), Endodoncia (▲), Implante (⬡), Sellante (⬒), Fractura (↯)
</div>
`,
    'HU017': `
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
  <tr><td colspan="2" style="background:#0ea5e9;color:white;text-align:center;padding:15px;font-weight:bold;font-size:18px;">Crear Nueva Cita</td></tr>
  <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;width:30%;"><strong>Paciente:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;" placeholder="Nombre del paciente" /></td></tr>
  <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Médico:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar médico</option><option>Dr. García</option><option>Dr. Rodríguez</option></select></td></tr>
  <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Fecha:</strong></td><td style="padding:10px;border:1px solid #ddd;"><input type="date" style="width:100%;padding:8px;border:1px solid #ccc;" /></td></tr>
  <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Hora:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar hora</option><option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option></select></td></tr>
  <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Tipo de Cita:</strong></td><td style="padding:10px;border:1px solid #ddd;"><select style="width:100%;padding:8px;border:1px solid #ccc;"><option>Seleccionar tipo</option><option>Consulta</option><option>Limpieza</option><option>Extracción</option><option>Ortodoncia</option></select></td></tr>
  <tr><td style="padding:10px;border:1px solid #ddd;background:#f9fafb;"><strong>Observaciones:</strong></td><td style="padding:10px;border:1px solid #ddd;"><textarea style="width:100%;padding:8px;border:1px solid #ccc;height:60px;" placeholder="Observaciones adicionales..."></textarea></td></tr>
  <tr><td colspan="2" style="padding:15px;border:1px solid #ddd;text-align:center;"><button style="background:#0ea5e9;color:white;padding:12px 30px;border:none;border-radius:4px;font-weight:bold;font-size:16px;">Crear Cita</button></td></tr>
</table>
`,
    'HU037': `
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
  <tr><td colspan="4" style="background:#0ea5e9;color:white;text-align:center;padding:15px;font-weight:bold;font-size:18px;">Dashboard - Estadísticas del Consultorio</td></tr>
  <tr>
    <td style="border:1px solid #ddd;padding:15px;text-align:center;background:#f0f9ff;">
      <div style="font-size:24px;font-weight:bold;color:#0ea5e9;">12</div>
      <div style="color:#64748b;font-weight:bold;">Citas Hoy</div>
    </td>
    <td style="border:1px solid #ddd;padding:15px;text-align:center;background:#fef3c7;">
      <div style="font-size:24px;font-weight:bold;color:#f59e0b;">5</div>
      <div style="color:#64748b;font-weight:bold;">Citas Pendientes</div>
    </td>
    <td style="border:1px solid #ddd;padding:15px;text-align:center;background:#ecfdf5;">
      <div style="font-size:24px;font-weight:bold;color:#10b981;">30</div>
      <div style="color:#64748b;font-weight:bold;">Pacientes Activos</div>
    </td>
    <td style="border:1px solid #ddd;padding:15px;text-align:center;background:#f3e8ff;">
      <div style="font-size:24px;font-weight:bold;color:#8b5cf6;">S/ 2,500</div>
      <div style="color:#64748b;font-weight:bold;">Ingresos del Mes</div>
    </td>
  </tr>
</table>
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
  <tr><td colspan="2" style="background:#0ea5e9;color:white;text-align:center;padding:12px;font-weight:bold;">Citas Recientes</td></tr>
  <tr>
    <td style="border:1px solid #ddd;padding:10px;background:#f9fafb;"><strong>Juan Pérez</strong> - Consulta General</td>
    <td style="border:1px solid #ddd;padding:10px;text-align:right;">Hoy, 10:00 AM</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:10px;background:#f9fafb;"><strong>María López</strong> - Limpieza Dental</td>
    <td style="border:1px solid #ddd;padding:10px;text-align:right;">Hoy, 2:30 PM</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:10px;background:#f9fafb;"><strong>Carlos Ruiz</strong> - Extracción</td>
    <td style="border:1px solid #ddd;padding:10px;text-align:right;">Mañana, 9:00 AM</td>
  </tr>
</table>
`
  };
  return visualHTML[huId] || '';
}

// Función para convertir Markdown a formato Word básico (HTML que se puede abrir en Word)
function convertMarkdownToWord(markdownContent) {
    // Dividir el contenido en secciones
    const sections = markdownContent.split(/(?=^## )/m);
    
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Historias de Usuarios - Sistema de Consultorio Dental</title>
    <style>
        body {
            font-family: 'Calibri', sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            margin: 2cm;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            font-size: 24pt;
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            font-size: 18pt;
            margin-top: 30px;
            margin-bottom: 20px;
            page-break-before: always;
            border-left: 5px solid #3498db;
            padding-left: 15px;
        }
        h3 {
            color: #2980b9;
            font-size: 14pt;
            margin-top: 25px;
            margin-bottom: 15px;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
        }
        .hu-container {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #ecf0f1;
            border-radius: 8px;
            background-color: #f8f9fa;
            page-break-inside: avoid;
        }
        .hu-title {
            font-weight: bold;
            color: #2c3e50;
            font-size: 12pt;
            margin-bottom: 10px;
        }
        .hu-description {
            font-style: italic;
            color: #7f8c8d;
            margin-bottom: 15px;
        }
        .criteria-section {
            margin-top: 15px;
        }
        .criteria-title {
            font-weight: bold;
            color: #27ae60;
            margin-bottom: 8px;
        }
        .criteria-list {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .criteria-list li {
            margin-bottom: 5px;
        }
        .priority-info {
            background-color: #e8f4fd;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
            border-left: 4px solid #3498db;
        }
        .priority-info span {
            font-weight: bold;
        }
        .code-section {
            background-color: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin-top: 15px;
            font-family: 'Courier New', monospace;
            font-size: 9pt;
            overflow-x: auto;
            white-space: pre-wrap;
        }
        .code-title {
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 10px;
            font-family: 'Calibri', sans-serif;
        }
        .component-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 10px;
            margin-top: 15px;
        }
        .component-info h4 {
            color: #856404;
            margin: 0 0 8px 0;
            font-size: 11pt;
        }
        .component-info p {
            margin: 5px 0;
            font-size: 10pt;
        }
        .index {
            background-color: #f1f2f6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .index h3 {
            color: #2c3e50;
            margin-top: 0;
        }
        .index ul {
            columns: 2;
            column-gap: 40px;
        }
        .index li {
            margin-bottom: 8px;
        }
        .summary {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            border-left: 4px solid #27ae60;
        }
        .summary h3 {
            color: #27ae60;
            margin-top: 0;
        }
        .priority-section {
            margin-top: 20px;
        }
        .priority-section h4 {
            color: #e74c3c;
            margin-bottom: 10px;
        }
        .priority-section ul {
            margin-left: 20px;
        }
        .priority-section li {
            margin-bottom: 5px;
        }
        .visual-section {
            margin-top: 20px;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
            text-align: center;
        }
        .visual-title {
            font-weight: bold;
            color: #0ea5e9;
            margin-bottom: 15px;
            font-size: 14pt;
            text-align: center;
        }
        @media print {
            body { margin: 1cm; }
            h2 { page-break-before: always; }
            .hu-container { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <h1>HISTORIAS DE USUARIO</h1>
    <h1>SISTEMA DE CONSULTORIO DENTAL</h1>
`;

    // Procesar cada sección
    sections.forEach(section => {
        if (section.trim()) {
            // Convertir encabezados
            let htmlSection = section
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/^#### (.+)$/gm, '<h4>$1</h4>');

            // Convertir historias de usuario
            htmlSection = htmlSection.replace(
                /### (HU\d+: .+?)\n\*\*Como\*\* (.+?)\n\*\*Quiero\*\* (.+?)\n\*\*Para\*\* (.+?)\n\n\*\*Criterios de Aceptación:\*\*\n((?:- .+?\n)+)\n\*\*Criterios de Negocio:\*\*\n((?:- .+?\n)+)\n\n\*\*Prioridad:\*\* (.+?)\n\*\*Estimación:\*\* (.+?)\n\*\*Sprint:\*\* (.+?)\n\n---/gs,
                (match, title, como, quiero, para, criteriosAceptacion, criteriosNegocio, prioridad, estimacion, sprint) => {
                    const criteriosAceptacionList = criteriosAceptacion
                        .split('\n')
                        .filter(line => line.trim().startsWith('-'))
                        .map(line => `<li>${line.replace('- ', '')}</li>`)
                        .join('');

                    const criteriosNegocioList = criteriosNegocio
                        .split('\n')
                        .filter(line => line.trim().startsWith('-'))
                        .map(line => `<li>${line.replace('- ', '')}</li>`)
                        .join('');

                    // Extraer el ID de la HU
                    const huId = title.match(/HU\d+/)[0];
                    const componentCode = getComponentCode(huId);
                    const componentInfo = huComponents[huId];

                    return `
                    <div class="hu-container">
                        <div class="hu-title">${title}</div>
                        <div class="hu-description">
                            <strong>Como</strong> ${como}<br>
                            <strong>Quiero</strong> ${quiero}<br>
                            <strong>Para</strong> ${para}
                        </div>
                        
                        <div class="criteria-section">
                            <div class="criteria-title">Criterios de Aceptación:</div>
                            <ul class="criteria-list">${criteriosAceptacionList}</ul>
                        </div>
                        
                        <div class="criteria-section">
                            <div class="criteria-title">Criterios de Negocio:</div>
                            <ul class="criteria-list">${criteriosNegocioList}</ul>
                        </div>
                        
                        <div class="priority-info">
                            <span>Prioridad:</span> ${prioridad} | 
                            <span>Estimación:</span> ${estimacion} | 
                            <span>Sprint:</span> ${sprint}
                        </div>
                        
                        ${componentInfo ? `
                        <div class="component-info">
                            <h4>Componente Correspondiente</h4>
                            <p><strong>Archivo:</strong> ${componentInfo.component}</p>
                            <p><strong>Descripción:</strong> ${componentInfo.description}</p>
                        </div>
                        ` : ''}
                        
                        <div class="code-section">
                            <div class="code-title">Código del Componente:</div>
                            <pre>${componentCode}</pre>
                        </div>
                        <div class="visual-section"><div class="visual-title">Vista de la pantalla:</div>${getComponentVisualHTML(huId)}</div>
                    </div>
                    `;
                }
            );

            htmlContent += htmlSection;
        }
    });

    // Agregar resumen al final
    htmlContent += `
    <div class="summary">
        <h3>RESUMEN DE PRIORIDADES</h3>
        
        <div class="priority-section">
            <h4>Prioridad Crítica (Sprint 1)</h4>
            <ul>
                <li>HU001: Inicio de Sesión</li>
                <li>HU017: Crear Cita</li>
                <li>HU021: Registrar Consulta</li>
                <li>HU031: Registrar Empresa</li>
            </ul>
        </div>
        
        <div class="priority-section">
            <h4>Prioridad Alta (Sprint 2)</h4>
            <ul>
                <li>HU002: Recuperación de Contraseña</li>
                <li>HU004: Persistencia de Sesión</li>
                <li>HU005: Crear Usuario</li>
                <li>HU009: Registrar Empleado</li>
                <li>HU013: Crear Programación</li>
                <li>HU014: Asignar Horarios a Médicos</li>
                <li>HU018: Editar Cita</li>
                <li>HU019: Listar Citas</li>
                <li>HU020: Cancelar Cita</li>
                <li>HU022: Acceder Historial de Consultas</li>
                <li>HU024: Crear Odontograma</li>
                <li>HU025: Aplicar Procedimientos Dentales</li>
                <li>HU028: Crear Historia Clínica</li>
                <li>HU030: Acceder Historial Médico</li>
                <li>HU034: Crear Rol</li>
                <li>HU035: Asignar Menús a Roles</li>
                <li>HU038: Agenda Médica</li>
                <li>HU039: Gestión de Citas Recepción</li>
            </ul>
        </div>
        
        <div class="priority-section">
            <h4>Prioridad Media (Sprint 3)</h4>
            <ul>
                <li>HU003: Cambio de Contraseña</li>
                <li>HU006: Editar Usuario</li>
                <li>HU007: Listar Usuarios</li>
                <li>HU010: Editar Empleado</li>
                <li>HU011: Listar Empleados</li>
                <li>HU015: Visualizar Programaciones</li>
                <li>HU023: Editar Consulta</li>
                <li>HU026: Seleccionar Superficies Dentales</li>
                <li>HU027: Visualizar Historial de Procedimientos</li>
                <li>HU029: Editar Historia Clínica</li>
                <li>HU032: Editar Empresa</li>
                <li>HU036: Editar Permisos de Roles</li>
                <li>HU037: Dashboard Administrativo</li>
                <li>HU040: Configurar Horarios</li>
                <li>HU041: Editar Horarios</li>
            </ul>
        </div>
        
        <div class="priority-section">
            <h4>Prioridad Baja (Sprint 4-5)</h4>
            <ul>
                <li>HU008: Eliminar Usuario</li>
                <li>HU012: Eliminar Empleado</li>
                <li>HU016: Eliminar Programación</li>
                <li>HU033: Listar Empresas</li>
                <li>HU042: Listar Horarios</li>
            </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #fff; border-radius: 5px; border: 1px solid #ddd;">
            <strong>Total de Historias de Usuario:</strong> 42<br>
            <strong>Tiempo Estimado Total:</strong> ~1,200 horas<br>
            <strong>Sprints Estimados:</strong> 5 sprints de 2 semanas cada uno
        </div>
    </div>
</body>
</html>
`;

    return htmlContent;
}

// Leer el archivo Markdown
const markdownFile = 'Historias_Usuario_Consultorio_Dental.md';
const outputFile = 'Historias_Usuario_Consultorio_Dental_Completas.html';

try {
    const markdownContent = fs.readFileSync(markdownFile, 'utf8');
    const htmlContent = convertMarkdownToWord(markdownContent);
    
    fs.writeFileSync(outputFile, htmlContent, 'utf8');
    console.log(`✅ Documento convertido exitosamente a: ${outputFile}`);
    console.log('📝 Para convertir a Word:');
    console.log('   1. Abre el archivo HTML en tu navegador');
    console.log('   2. Presiona Ctrl+P para imprimir');
    console.log('   3. Selecciona "Guardar como PDF" o "Microsoft Print to PDF"');
    console.log('   4. Abre el PDF en Word y guárdalo como .docx');
    console.log('');
    console.log('🔄 Alternativa:');
    console.log('   - Abre directamente el archivo HTML en Word');
    console.log('   - Word lo convertirá automáticamente al formato .docx');
    console.log('');
    console.log('✨ Características del documento:');
    console.log('   - Cada HU en una página separada');
    console.log('   - Código del componente correspondiente incluido');
    console.log('   - Información técnica detallada');
    console.log('   - Formato profesional para presentación');
    
} catch (error) {
    console.error('❌ Error al procesar el archivo:', error.message);
} 