import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";
import { useState } from "react";
import './Odontograma.css';
import { toast, Toaster } from 'react-hot-toast';

export const Odontograma = () => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [activeView, setActiveView] = useState('occlusal');
  const [activeSurface, setActiveSurface] = useState(null);

  // Estructura de los dientes según la disposición solicitada
  const teeth = {
    // Primera fila superior: dientes adultos del 18 al 28
    upperAdult: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    // Segunda fila superior: dientes temporales del 55 al 25
    upperChild: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    // Primera fila inferior: dientes temporales del 85 al 75
    lowerChild: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
    // Segunda fila inferior: dientes adultos del 48 al 38
    lowerAdult: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
  };

  const procedures_list = [
    { id: 'caries', name: 'Caries', color: '#FF4444', icon: '●', surfaces: true },
    { id: 'restoration', name: 'Restauración', color: '#4444FF', icon: '■', surfaces: true },
    { id: 'extraction', name: 'Extracción', color: '#000000', icon: '✕', surfaces: false },
    { id: 'missing', name: 'Ausente', color: '#FF0000', icon: '⊘', surfaces: false },
    { id: 'crown', name: 'Corona', color: '#FFD700', icon: '◎', surfaces: false },
    { id: 'root_canal', name: 'Endodoncia', color: '#44AA44', icon: '▲', surfaces: false },
    { id: 'bridge', name: 'Puente', color: '#AA44AA', icon: '⚍', surfaces: false },
    { id: 'implant', name: 'Implante', color: '#00FFFF', icon: '⬡', surfaces: false },
    { id: 'sealant', name: 'Sellante', color: '#FFA500', icon: '⬒', surfaces: true },
    { id: 'fracture', name: 'Fractura', color: '#800080', icon: '↯', surfaces: true },
    { id: 'abfraction', name: 'Abfracción', color: '#8B4513', icon: '◊', surfaces: true },
    { id: 'attrition', name: 'Atrición', color: '#2F4F4F', icon: '○', surfaces: true },
    { id: 'bracket', name: 'Bracket', color: '#32CD32', icon: '◈', surfaces: false },
    { id: 'band', name: 'Banda', color: '#FF6347', icon: '◉', surfaces: false },
    { id: 'wire', name: 'Alambre', color: '#C0C0C0', icon: '━', surfaces: false },
    { id: 'elastic', name: 'Elástico', color: '#FF69B4', icon: '◐', surfaces: false },
    { id: 'retainer', name: 'Retenedor', color: '#4169E1', icon: '◑', surfaces: false },
    { id: 'gingivitis', name: 'Gingivitis', color: '#FF6B6B', icon: '◠', surfaces: true },
    { id: 'periodontitis', name: 'Periodontitis', color: '#8B0000', icon: '◡', surfaces: true },
    { id: 'pocket', name: 'Bolsa', color: '#DC143C', icon: '◢', surfaces: true },
    { id: 'calculus', name: 'Cálculo', color: '#696969', icon: '◣', surfaces: true },
    { id: 'recession', name: 'Recesión', color: '#FF4500', icon: '◤', surfaces: true }
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

  const handleSurfaceClick = (surface) => {
    setActiveSurface(surface);
  };

  const handleProcedureClick = (procedureId) => {
    if (!selectedTooth) {
      toast.error(VALIDATION_MESSAGES.ERROR.SELECCIONAR_DIENTE);
      return;
    }

    const procedure = procedures_list.find(p => p.id === procedureId);
      
    if (procedure.surfaces && !activeSurface) {
      toast.error(VALIDATION_MESSAGES.ERROR.SELECCIONAR_SUPERFICIE);
      return;
    }

    setProcedures(prev => {
      const toothProcedures = prev[selectedTooth] || {};
      
      if (!procedure.surfaces) {
        return {
          ...prev,
          [selectedTooth]: {
            full: procedureId
          }
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

  const getToothColor = (toothNumber, surface = 'full') => {
    if (!procedures[toothNumber]) return '#FFFFFF';

    const toothProcedures = procedures[toothNumber];

    if (surface !== 'full' && toothProcedures[surface]) {
      const procedure = procedures_list.find(p => p.id === toothProcedures[surface]);
      return procedure?.color || '#FFFFFF';
    }

    if (toothProcedures.full) {
      const procedure = procedures_list.find(p => p.id === toothProcedures.full);
      return procedure?.color || '#FFFFFF';
    }

    return '#FFFFFF';
  };

  const renderToothSection = (section, isChild = false, isUpper = true) => {
    return (
      <div className="flex justify-center gap-1">
        {section.map((tooth) => {
          const isExtraction = procedures[tooth]?.full === 'extraction';
          const isCrown = procedures[tooth]?.full === 'crown';
          return (
            <div key={tooth} className="tooth-container">
              <div className="tooth">
                {isUpper && (
                  <span className={`tooth-number ${isChild ? 'tooth-number-child' : ''}`}>
                    {tooth}
                  </span>
                )}
                <div 
                  className={`tooth-crown ${selectedTooth === tooth ? 'selected' : ''} 
                    ${isExtraction ? 'tooth-extraction' : ''} 
                    ${isCrown ? 'tooth-with-crown' : ''}
                    ${isChild ? 'tooth-child' : ''}`}
                  onClick={() => handleToothClick(tooth)}
                  style={{ 
                    background: getToothColor(tooth),
                    borderColor: selectedTooth === tooth ? '#2563eb' : '#1e293b'
                  }}
                >
                  <div 
                    className="tooth-inner"
                    style={{ 
                      background: getToothColor(tooth),
                      borderColor: selectedTooth === tooth ? '#2563eb' : '#1e293b'
                    }}
                  ></div>
                </div>
                {!isUpper && (
                  <span className={`tooth-number ${isChild ? 'tooth-number-child' : ''}`}>
                    {tooth}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCombinedView = () => {
    return (
      <div className="combined-odontograma">
        {/* Primera fila superior: dientes adultos del 18 al 28 */}
        <div className="teeth-row teeth-row-upper-adult">
          {renderToothSection(teeth.upperAdult, false, true)}
        </div>

        {/* Segunda fila superior: dientes temporales del 55 al 25 */}
        <div className="teeth-row teeth-row-upper-child">
          {renderToothSection(teeth.upperChild, true, true)}
        </div>

        <div className="mouth-separator"></div>

        {/* Primera fila inferior: dientes temporales del 85 al 75 */}
        <div className="teeth-row teeth-row-lower-child">
          {renderToothSection(teeth.lowerChild, true, false)}
        </div>

        {/* Segunda fila inferior: dientes adultos del 48 al 38 */}
        <div className="teeth-row teeth-row-lower-adult">
          {renderToothSection(teeth.lowerAdult, false, false)}
        </div>
      </div>
    );
  };

  return (
    <div className="odontograma-main">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          error: {
            style: {
              background: '#ff4444',
              color: '#fff',
            },
          },
        }} 
      />

      <div className="odontograma-content">
        {/* Odontograma */}
        <div className="dental-chart">
          {renderCombinedView()}
        </div>

        {/* Procedimientos */}
        <div className="procedures-panel">
          <div className="mb-4">
            <h3 className="panel-title">Procedimientos</h3>
          </div>
          
          <div className="procedures-list">
            {procedures_list.map((procedure) => (
              <button
                key={procedure.id}
                onClick={() => handleProcedureClick(procedure.id)}
                className={`procedure-btn ${!selectedTooth || (procedure.surfaces && !activeSurface) ? 'disabled' : ''}`}
                disabled={!selectedTooth || (procedure.surfaces && !activeSurface)}
              >
                <span className="procedure-icon" style={{ color: procedure.color }}>
                  {procedure.icon}
                </span>
                <span className="procedure-name">{procedure.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Información del diente seleccionado */}
        {selectedTooth && (
          <div className="info-panel">
            <h3 className="panel-title">Información del Diente</h3>
            <div className="tooth-info">
              <p className="tooth-title">Diente #{selectedTooth}</p>
              {procedures_list.some(p => p.surfaces) && (
                <div className="surfaces-selector">
                  <p className="surface-title">Seleccionar superficie:</p>
                  <div className="surface-buttons">
                    {surfaces.map(surface => (
                      <button
                        key={surface.id}
                        className={`surface-btn ${activeSurface === surface.id ? 'active' : ''}`}
                        onClick={() => handleSurfaceClick(surface.id)}
                      >
                        {surface.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="tooth-procedures">
                <p className="procedures-title">Procedimientos aplicados:</p>
                {procedures[selectedTooth] ? (
                  <ul className="procedures-list">
                    {Object.entries(procedures[selectedTooth]).map(([surface, procedureId]) => (
                      <li key={surface} className="procedure-item">
                        <span className="surface-name">
                          {surface === 'full' ? 'Completo' : surfaces.find(s => s.id === surface)?.name}:
                        </span>
                        <span className="procedure-name">
                          {procedures_list.find(p => p.id === procedureId)?.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-procedures">Sin procedimientos</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 