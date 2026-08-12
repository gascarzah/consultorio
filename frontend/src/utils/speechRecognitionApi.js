/**
 * Vite/ESM importa el CJS de react-speech-recognition con `default` anidado.
 * En consultorio-frontend (main) el import directo funcionaba con Vite 7;
 * aquí (Vite 8) hay que resolver startListening/stopListening.
 */
export function resolveSpeechRecognitionApi(mod) {
  let current = mod;
  for (let depth = 0; depth < 4 && current; depth += 1) {
    if (typeof current.startListening === "function") {
      return current;
    }
    current = current.default;
  }
  return null;
}
