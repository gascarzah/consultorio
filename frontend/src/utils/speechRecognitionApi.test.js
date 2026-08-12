import "regenerator-runtime/runtime";
import { describe, expect, it } from "vitest";
import speechRecognitionPkg from "react-speech-recognition";
import { resolveSpeechRecognitionApi } from "./speechRecognitionApi";

describe("resolveSpeechRecognitionApi", () => {
  it("resuelve startListening del default anidado (Vite/CJS)", () => {
    const inner = { startListening: () => {}, stopListening: () => {} };
    expect(resolveSpeechRecognitionApi({ default: inner })).toBe(inner);
  });

  it("resuelve el paquete real react-speech-recognition", () => {
    const api = resolveSpeechRecognitionApi(speechRecognitionPkg);
    expect(api).not.toBeNull();
    expect(typeof api.startListening).toBe("function");
    expect(typeof api.stopListening).toBe("function");
  });
});
