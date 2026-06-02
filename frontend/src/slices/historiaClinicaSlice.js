import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import historiaclinicaAxios from '../config/axios';

// Estado inicial
const initialState = {
  loading: false,
  historiaClinica: {},
  code: null,
  message: null,
  historiaClinicas: [],
  total: 0,
  prev: null,
  next: null,
  numberPage: 0,
};

// Función de utilidad para manejo de errores
const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    return error.response.data.message || error.response.data;
  }
  return error.message || 'Error desconocido';
};

// Crear thunks
export const registrarHistoriaClinica = createAsyncThunk(
  'registrarHistoriaClinica',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await historiaclinicaAxios.post("/historiasClinicas", values);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const modificarHistoriaClinica = createAsyncThunk(
  'modificarHistoriaClinica',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await historiaclinicaAxios.put("/historiasClinicas", values);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getHistoriaClinica = createAsyncThunk(
  'getHistoriaClinica',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await historiaclinicaAxios.get(`/historiasClinicas/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getHistoriaClinicas = createAsyncThunk(
  'getHistoriaClinicas',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await historiaclinicaAxios.get(`/historiasClinicas`);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getHistoriaClinicasPaginado = createAsyncThunk(
  'getHistoriaClinicasPaginado',
  async (values, { rejectWithValue }) => {
    try {
      const params = {
        page: values.page,
        size: values.size,
      };
      
      // Agregar filtro de búsqueda si existe
      if (values.search && values.search.trim()) {
        params.search = values.search.trim();
      }
      
      const { data } = await historiaclinicaAxios.get(`/historiasClinicas/pageable`, { params });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const eliminarHistoriaClinica = createAsyncThunk(
  'eliminarHistoriaClinica',
  async (id, { rejectWithValue }) => {
    try {
      await historiaclinicaAxios.delete(`/historiasClinicas/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const historiaClinicaSlice = createSlice({
  name: 'historiaClinica',
  initialState,
  reducers: { resetState: () => initialState },
  extraReducers(builder) {
    builder
      .addCase(registrarHistoriaClinica.pending, (state) => {
        state.loading = true;
      })
      .addCase(registrarHistoriaClinica.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(registrarHistoriaClinica.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(modificarHistoriaClinica.pending, (state) => {
        state.loading = true;
      })
      .addCase(modificarHistoriaClinica.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(modificarHistoriaClinica.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(getHistoriaClinica.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'HistoriaClinica encontrado';
        state.historiaclinica = {
          id: payload.idHistoriaClinica,
          email: payload.email,
          nombreCompleto: `${payload.apellidoPaterno} ${payload.apellidoMaterno}, ${payload.nombres}`,
        };
      })
      .addCase(getHistoriaClinica.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(getHistoriaClinicas.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'HistoriaClinicas encontrados';
        state.historiaClinicas = payload;
      })
      .addCase(getHistoriaClinicas.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(getHistoriaClinicasPaginado.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHistoriaClinicasPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'HistoriaClinicas encontrados';
        state.historiaClinicas = payload.content || [];
        state.total = payload.totalElements || 0;
        state.prev = payload.first;
        state.next = payload.last;
        state.numberPage = payload.number;
      })
      .addCase(getHistoriaClinicasPaginado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
        state.historiaClinicas = [];
        state.total = 0;
      })
      .addCase(eliminarHistoriaClinica.pending, (state) => {
        state.loading = true;
      })
      .addCase(eliminarHistoriaClinica.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Historia clínica eliminada';
        state.historiaClinicas = state.historiaClinicas.filter(
          (historia) => historia.idHistoriaClinica !== payload
        );
      })
      .addCase(eliminarHistoriaClinica.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'No se pudo eliminar la historia clínica';
      });
  },
});

// Acción para restablecer el estado
export const { resetState } = historiaClinicaSlice.actions;

// Reducer del slice
export default historiaClinicaSlice.reducer;
