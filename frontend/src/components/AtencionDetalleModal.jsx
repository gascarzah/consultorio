
export const AtencionDetalleModal = ({ informe }) => {
  if (!informe) {
    return (
      <div className="p-4">
        <p>No hay información de consulta disponible.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Detalle de Consulta
      </h2>
      
      <div className="space-y-4">
        {informe.paciente && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Información del Paciente</h3>
            <p><strong>Nombre:</strong> {informe.paciente.nombres} {informe.paciente.apellidoPaterno} {informe.paciente.apellidoMaterno}</p>
            {informe.paciente.numeroDocumento && (
              <p><strong>DNI:</strong> {informe.paciente.numeroDocumento}</p>
            )}
          </div>
        )}

        {informe.fecha && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Fecha de Consulta</h3>
            <p>{new Date(informe.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        )}

        {informe.diagnostico && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Diagnóstico</h3>
            <p className="whitespace-pre-wrap">{informe.diagnostico}</p>
          </div>
        )}

        {informe.tratamiento && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Tratamiento</h3>
            <p className="whitespace-pre-wrap">{informe.tratamiento}</p>
          </div>
        )}

        {informe.observaciones && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Observaciones</h3>
            <p className="whitespace-pre-wrap">{informe.observaciones}</p>
          </div>
        )}

        {informe.procedimientos && informe.procedimientos.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Procedimientos Realizados</h3>
            <ul className="list-disc list-inside space-y-1">
              {informe.procedimientos.map((proc, index) => (
                <li key={index}>{proc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

