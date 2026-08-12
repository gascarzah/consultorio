import { VALIDATION_MESSAGES } from "../utils/ValidationMessages";
import { useEffect, useRef, useState } from "react";
// Side-effect: en el proyecto 06 (main) este import habilitaba el motor de speech.
import regeneratorRuntime from "regenerator-runtime";
import { toast } from "react-toastify";
import { useChromeSpeech } from "../hooks/useChromeSpeech";

void regeneratorRuntime;

/**
 * Textarea con dictado por voz (Chrome Web Speech).
 * API de uso alineada a consultorio-frontend / VoiceTextArea.
 */
export const VoiceTextArea = ({
  id,
  name,
  label,
  value = "",
  onChange,
  placeholder = "Escriba o dicte aquí...",
  rows = 4,
  className = "",
  disabled = false,
  language = "es-PE",
}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  } = useChromeSpeech(language);

  const [isActive, setIsActive] = useState(false);
  const baseTextRef = useRef("");
  const onChangeRef = useRef(onChange);
  const startedRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!isActive) return;
    const base = (baseTextRef.current || "").trim();
    const spoken = (transcript || "").trim();
    const next = base && spoken ? `${base} ${spoken}` : spoken || base;
    if (typeof onChangeRef.current === "function") {
      onChangeRef.current(next);
    }
  }, [transcript, isActive]);

  useEffect(() => {
    if (listening) {
      startedRef.current = true;
      return;
    }
    if (startedRef.current && isActive) {
      startedRef.current = false;
      setIsActive(false);
    }
  }, [listening, isActive]);

  const handleStart = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error(VALIDATION_MESSAGES.ERROR.DICTADO_SOLO_CHROME);
      return;
    }
    try {
      baseTextRef.current = value || "";
      resetTranscript();
      startedRef.current = false;
      setIsActive(true);
      startListening({ continuous: true, language });
    } catch (error) {
      console.error("Error al iniciar dictado:", error);
      setIsActive(false);
      toast.error(VALIDATION_MESSAGES.ERROR.ERROR_INICIAR_DICTADO);
    }
  };

  const handleStop = () => {
    try {
      stopListening();
      setIsActive(false);
      startedRef.current = false;
    } catch (error) {
      console.error("Error al detener dictado:", error);
      toast.error(VALIDATION_MESSAGES.ERROR.ERROR_DETENER_DICTADO);
    }
  };

  const handleClear = () => {
    try {
      stopListening();
      resetTranscript();
      setIsActive(false);
      startedRef.current = false;
      baseTextRef.current = "";
      if (typeof onChange === "function") onChange("");
    } catch (error) {
      console.error("Error al limpiar dictado:", error);
      toast.error(VALIDATION_MESSAGES.ERROR.ERROR_LIMPIAR_DICTADO);
    }
  };

  const handleManualChange = (event) => {
    if (isActive) handleStop();
    if (typeof onChange === "function") onChange(event.target.value);
  };

  const recording = isActive && listening;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      {browserSupportsSpeechRecognition && !disabled && (
        <div className="flex items-center gap-2 mb-2">
          {recording ? (
            <button
              type="button"
              onClick={handleStop}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Detener
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Dictar
            </button>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Limpiar
          </button>
          <span className={`text-xs ${recording ? "text-red-500" : "text-gray-400"}`}>
            {recording ? "Dictando..." : "Dictado detenido"}
          </span>
        </div>
      )}

      {!browserSupportsSpeechRecognition && (
        <p className="text-xs text-amber-700 mb-2">
          Este navegador no soporta dictado por voz. Use Chrome o escriba el texto
          manualmente.
        </p>
      )}

      <div className="relative">
        {recording && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        )}
        <textarea
          id={id || name}
          name={name}
          rows={rows}
          value={value ?? ""}
          onChange={handleManualChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-50"
        />
      </div>
    </div>
  );
};

export const VoiceDictationField = VoiceTextArea;
export default VoiceTextArea;
