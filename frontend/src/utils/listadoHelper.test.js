import { describe, expect, it, vi } from "vitest";
import { createListadoLogic } from "./listadoHelper";

describe("createListadoLogic", () => {
  it("debe despachar carga inicial con paginacion por defecto", () => {
    const action = vi.fn((params) => ({ type: "FETCH_PAGE", payload: params }));
    const dispatch = vi.fn();
    const logic = createListadoLogic("empleado", action);

    logic.effects.initialLoad(dispatch, 10);

    expect(action).toHaveBeenCalledWith({ page: 0, size: 10 });
    expect(dispatch).toHaveBeenCalledWith({
      type: "FETCH_PAGE",
      payload: { page: 0, size: 10 },
    });
  });

  it("debe agregar el termino de busqueda en cambio de pagina", () => {
    const action = vi.fn((params) => ({ type: "FETCH_PAGE", payload: params }));
    const dispatch = vi.fn();
    const logic = createListadoLogic("empleado", action);
    const pageEvent = { page: 2, rows: 25 };

    const result = logic.effects.handlePageChange(pageEvent, "  juan  ", dispatch, action);

    expect(result).toEqual({ newPage: 2, newSize: 25 });
    expect(action).toHaveBeenCalledWith({ page: 2, size: 25, search: "juan" });
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
