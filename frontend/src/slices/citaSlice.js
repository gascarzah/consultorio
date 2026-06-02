import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

// Estado inicial
const initialState = {
  loading: false,
  code: null, 
  message: null,
  logged: false,
  citas: [],
  cita: {},
  historiales: [],
  total: 0,
  prev: null,
  next: null,
  numberPage: 0,
};

// Manejo de errores de manera centralizada
const handleError = (state, payload) => {
  console.error('Error:', payload);
  state.loading = false;
  state.code = payload?.status || null;
  state.message = payload?.message || 'Error';
};

// Crear los thunks
export const getListaCitados = createAsyncThunk(
  'getListaCitados',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get('/citas/listaCitados', {
        params: {
          idEmpresa: values.idEmpresa,
        },
      });
      return data;
    } catch (error) {
      console.error('Error en getListaCitados:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCitasIdProgramacionDetalle = createAsyncThunk(
  'getCitasIdProgramacionDetalle',
  async (idProgramacionDetalle, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/citas/medico?idProgramacionDetalle=${idProgramacionDetalle}`);
      return data;
    } catch (error) {
      console.error('Error en getCitasIdProgramacionDetalle:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCita = createAsyncThunk(
  'getCita',
  async (id, { rejectWithValue }) => {
    
    try {
      const { data } = await clienteAxios.get(`/citas/${id}`);
      return data;
    } catch (error) {
      console.error('=== ERROR EN GET CITA API ===');
      console.error('Error completo:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editarCita = createAsyncThunk(
  'editarCita',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put(`/citas`, values);
      return data;
    } catch (error) {
      console.error('Error en editarCita:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const eliminarCita = createAsyncThunk(
  'eliminarCita',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put(`/citas/eliminar`, values);
      return data;
    } catch (error) {
      console.error('Error en eliminarCita:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getHistorialCitas = createAsyncThunk(
  'getHistorialCitas',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get('/citas/historial/pageable', {
        params: {
          page: values.page,
          size: values.size,
          numeroDocumento: values.numeroDocumento,
        },
      });
      return data;
    } catch (error) {
      console.error('Error en getHistorialCitas:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCitasPaginado = createAsyncThunk(
  'getCitasPaginado',
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
      
      const { data } = await clienteAxios.get('/citas/pageable', { params });
      return data;
    } catch (error) {
      console.error('Error en getCitasPaginado:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registrarCita = createAsyncThunk(
  'registrarCita',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post('/citas', values);
      return data;
    } catch (error) {
      console.error('Error en registrarCita:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const citaSlice = createSlice({
  name: 'cita',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getListaCitados.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListaCitados.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Se encontró la lista de citados';
        state.citas = Array.isArray(payload) ? payload : [];
      })
      .addCase(getListaCitados.rejected, (state, { payload }) => {
        handleError(state, payload);
        state.citas = [];
      })
      .addCase(getCitasIdProgramacionDetalle.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Detalles encontrados';
        state.citas = payload;
      })
      .addCase(getCitasIdProgramacionDetalle.rejected, (state, { payload }) => {
        handleError(state, payload);
        state.citas = [];
      })
      .addCase(getCita.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCita.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Cita encontrada';
        state.cita = payload;
      })
      .addCase(getCita.rejected, (state, { payload }) => {
        handleError(state, payload);
        state.cita = {};
      })
      .addCase(getHistorialCitas.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Historial encontrado';
        state.historiales = payload.content;
        state.total = payload.totalElements;
        state.prev = payload.first;
        state.next = payload.last;
        state.numberPage = payload.number;
      })
      .addCase(getHistorialCitas.rejected, (state, { payload }) => {
        handleError(state, payload);
        state.historiales = [];
      })
      .addCase(getCitasPaginado.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCitasPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Citas paginadas encontradas';
        const page = payload ?? {};
        state.citas = page.content ?? [];
        state.total = page.totalElements ?? 0;
        state.prev = page.first;
        state.next = page.last;
        state.numberPage = page.number;
      })
      .addCase(getCitasPaginado.rejected, (state, { payload }) => {
        handleError(state, payload);
        state.citas = [];
        state.total = 0;
      })
      .addCase(registrarCita.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(registrarCita.rejected, (state, { payload }) => {
        handleError(state, payload);
      })
      .addCase(eliminarCita.pending, (state) => {
        state.loading = true;
      })
      .addCase(eliminarCita.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 200;
        state.message = payload?.message || 'Cita eliminada';
      })
      .addCase(eliminarCita.rejected, (state, { payload }) => {
        handleError(state, payload);
      });
  },
});

export const { resetState } = citaSlice.actions;
export default citaSlice.reducer;
