import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clienteAxios from "../config/axios";

const initialState = {
  loading: false,
  code: null,
  message: null,
  categoriaMenu: {},
  categoriasMenu: [],
  total: 0,
};

export const getCategoriasMenuPaginado = createAsyncThunk(
  "getCategoriasMenuPaginado",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get("/categoria-menus/pageable", {
        params: {
          page: values.page,
          size: values.size,
          ...(values.search ? { search: values.search } : {}),
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCategoriasMenu = createAsyncThunk(
  "getCategoriasMenu",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get("/categoria-menus");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCategoriaMenu = createAsyncThunk(
  "getCategoriaMenu",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/categoria-menus/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registrarCategoriaMenu = createAsyncThunk(
  "registrarCategoriaMenu",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post("/categoria-menus", values);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const modificarCategoriaMenu = createAsyncThunk(
  "modificarCategoriaMenu",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put("/categoria-menus", values);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const eliminarCategoriaMenu = createAsyncThunk(
  "eliminarCategoriaMenu",
  async (id, { rejectWithValue }) => {
    try {
      await clienteAxios.delete(`/categoria-menus/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const categoriaMenuSlice = createSlice({
  name: "categoriaMenu",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getCategoriasMenuPaginado.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoriasMenuPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categoriasMenu = payload.content;
        state.total = payload.totalElements;
      })
      .addCase(getCategoriasMenu.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categoriasMenu = payload;
      })
      .addCase(getCategoriaMenu.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categoriaMenu = payload;
      })
      .addCase(registrarCategoriaMenu.fulfilled, (state) => {
        state.loading = false;
        state.code = 201;
      })
      .addCase(modificarCategoriaMenu.fulfilled, (state) => {
        state.loading = false;
        state.code = 200;
      })
      .addCase(eliminarCategoriaMenu.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categoriasMenu = state.categoriasMenu.filter((item) => item.idCategoria !== payload);
      })
      .addMatcher(
        (action) => action.type.startsWith("getCategoriasMenu") && action.type.endsWith("/rejected"),
        (state, { payload }) => {
          state.loading = false;
          state.message = payload?.message || "Error al cargar categorías";
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("registrarCategoriaMenu") ||
          action.type.startsWith("modificarCategoriaMenu") ||
          action.type.startsWith("eliminarCategoriaMenu"),
        (state, action) => {
          if (action.type.endsWith("/rejected")) {
            state.loading = false;
            state.message = action.payload?.message || "Error al procesar categoría";
          }
        }
      );
  },
});

export const { resetState } = categoriaMenuSlice.actions;
export default categoriaMenuSlice.reducer;
