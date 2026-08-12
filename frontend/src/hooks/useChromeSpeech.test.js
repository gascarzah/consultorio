import { describe, expect, it } from "vitest";

/** Copia de la lógica de armado de texto del hook (para test sin DOM). */
function buildLiveTranscript(finalText, interimText) {
  return `${finalText || ""} ${interimText || ""}`.replace(/\s+/g, " ").trim();
}

describe("dictado Chrome — armado de transcript", () => {
  it("escribe texto final e interim en el campo", () => {
    expect(buildLiveTranscript("", "hola")).toBe("hola");
    expect(buildLiveTranscript("hola mundo", "como")).toBe("hola mundo como");
  });

  it("normaliza espacios", () => {
    expect(buildLiveTranscript("dolor", "  dental")).toBe("dolor dental");
  });
});
