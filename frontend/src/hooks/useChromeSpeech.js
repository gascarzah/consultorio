import { useCallback, useEffect, useRef, useState } from "react";

function getSpeechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/** Solo una grabación activa en toda la app. */
let sharedRecognition = null;
const listeners = new Set();

function notifyStopped() {
  listeners.forEach((fn) => fn());
}

function stopSharedRecognition() {
  if (!sharedRecognition) return;
  try {
    sharedRecognition.onresult = null;
    sharedRecognition.onerror = null;
    sharedRecognition.onend = null;
    sharedRecognition.stop();
  } catch {
    /* ignore */
  }
  sharedRecognition = null;
  notifyStopped();
}

/**
 * Hook de dictado con Web Speech API de Chrome.
 * Misma idea de uso que react-speech-recognition en consultorio-frontend (main):
 * transcript / listening / startListening / stopListening / resetTranscript.
 */
export function useChromeSpeech(language = "es-PE") {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const finalRef = useRef("");
  const languageRef = useRef(language);
  const isOwnerRef = useRef(false);

  languageRef.current = language;

  const browserSupportsSpeechRecognition = Boolean(getSpeechRecognitionCtor());

  useEffect(() => {
    const onExternalStop = () => {
      if (isOwnerRef.current) {
        isOwnerRef.current = false;
        setListening(false);
      }
    };
    listeners.add(onExternalStop);
    return () => {
      listeners.delete(onExternalStop);
      if (isOwnerRef.current) {
        stopSharedRecognition();
        isOwnerRef.current = false;
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (isOwnerRef.current) {
      stopSharedRecognition();
      isOwnerRef.current = false;
    }
    setListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    finalRef.current = "";
    setTranscript("");
  }, []);

  const startListening = useCallback(
    (options = {}) => {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) {
        throw new Error("Este navegador no soporta reconocimiento de voz");
      }

      stopSharedRecognition();
      isOwnerRef.current = true;

      const lang = options.language || languageRef.current || "es-PE";
      const continuous = options.continuous !== false;

      const recognition = new Ctor();
      recognition.lang = lang;
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let interim = "";
        let finalChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const text = result[0]?.transcript || "";
          if (result.isFinal) finalChunk += text;
          else interim += text;
        }
        if (finalChunk) {
          finalRef.current = `${finalRef.current} ${finalChunk}`.replace(/\s+/g, " ").trim();
        }
        const next = `${finalRef.current} ${interim}`.replace(/\s+/g, " ").trim();
        setTranscript(next);
      };

      recognition.onerror = (event) => {
        const err = event?.error;
        if (err === "not-allowed") {
          console.error("Speech recognition error: micrófono denegado");
        } else if (err === "network") {
          console.error("Speech recognition error: network (Chrome necesita internet)");
        } else if (err && err !== "aborted" && err !== "no-speech") {
          console.error("Speech recognition error:", err);
        }
        isOwnerRef.current = false;
        sharedRecognition = null;
        setListening(false);
      };

      recognition.onend = () => {
        if (sharedRecognition === recognition) {
          sharedRecognition = null;
        }
        isOwnerRef.current = false;
        setListening(false);
      };

      sharedRecognition = recognition;
      recognition.start();
      setListening(true);
    },
    []
  );

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  };
}
