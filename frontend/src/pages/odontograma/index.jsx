import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Odontograma } from "../../components";
import { toast } from "react-hot-toast";

const OdontogramaPage = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    documentNumber: "",
    phone: "",
    email: ""
  });
  
  const [odontogramaData, setOdontogramaData] = useState({
    procedures: {},
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);

  const handleSaveOdontograma = () => {
    // Aquí se implementaría la lógica para guardar el odontograma
    toast.success('Odontograma guardado exitosamente');
  };

  const handleExportPDF = () => {
    // Aquí se implementaría la lógica para exportar a PDF
    toast.success('Exportando a PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Odontograma Profesional</h1>
              <p className="text-gray-600 mt-2">Sistema de registro dental completo</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Información del Paciente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Información del Paciente</h2>
            <button
              onClick={() => setShowPatientForm(!showPatientForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              {showPatientForm ? 'Ocultar' : 'Editar'} Datos
            </button>
          </div>

          {showPatientForm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese el nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  value={patientData.age}
                  onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Edad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Documento
                </label>
                <input
                  type="text"
                  value={patientData.documentNumber}
                  onChange={(e) => setPatientData({...patientData, documentNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DNI o documento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={patientData.phone}
                  onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Teléfono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={patientData.email}
                  onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Consulta
                </label>
                <input
                  type="date"
                  value={odontogramaData.date}
                  onChange={(e) => setOdontogramaData({...odontogramaData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Nombre:</span>
                <p className="text-gray-900">{patientData.name || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Edad:</span>
                <p className="text-gray-900">{patientData.age || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Documento:</span>
                <p className="text-gray-900">{patientData.documentNumber || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                <p className="text-gray-900">{patientData.phone || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{patientData.email || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Fecha:</span>
                <p className="text-gray-900">{new Date(odontogramaData.date).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Odontograma */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Odontograma</h2>
          <Odontograma />
        </div>

        {/* Notas Clínicas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notas Clínicas</h2>
          <textarea
            value={odontogramaData.notes}
            onChange={(e) => setOdontogramaData({...odontogramaData, notes: e.target.value})}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Ingrese notas clínicas, observaciones, plan de tratamiento..."
          />
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleSaveOdontograma}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
            >
              Guardar Odontograma
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors font-medium"
            >
              Exportar PDF
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Imprimir
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium"
            >
              {isEditing ? 'Finalizar Edición' : 'Editar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdontogramaPage; 