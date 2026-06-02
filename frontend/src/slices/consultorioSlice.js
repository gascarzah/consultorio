import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

const initialState = {
  loading: false,  // `false` por defecto
  code: null,
  message: null,
  logged: false,
  consultorio: {},
  consultorios: [],
  total: [],
  prev: null,
  next: null,
  numberPage: 0,
};

// Acción asincrónica para obtener consultorios paginados
export const getConsultoriosPaginado = createAsyncThunk(
  'getConsultoriosPaginado',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get('/consultorios/pageable', {
        params: {
          page: values.page,
          size: values.size,
        }
      });
      return data;
    } catch (error) {
      console.error("Error en obtener consultorios paginados", error);
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

// Acción asincrónica para registrar un consultorio
export const registrarConsultorio = createAsyncThunk(
  'registrarConsultorio',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post('/consultorios', values);
      return data;
    } catch (error) {
      console.error('Error al registrar el consultorio', error);
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

// Slice para manejar el estado
const consultorioSlice = createSlice({
  name: 'consultorio',
  initialState,
  reducers: { 
    resetState: () => initialState,
  },
  extraReducers(builder) {
    builder
      // Acción fulfilled: Se ejecuta si la solicitud se completa correctamente
      .addCase(registrarConsultorio.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;  // Código de éxito
        state.message = 'Consultorio registrado con éxito';
      })
      // Acción rejected: Se ejecuta si la solicitud falla
      .addCase(registrarConsultorio.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500; // Default code to 500 if no status
        state.message = payload?.message || 'Error al registrar el consultorio';
        state.consultorios = []; // Limpiar los consultorios si hay un error
      })
      // Acción fulfilled: Se ejecuta si los consultorios se cargan correctamente
      .addCase(getConsultoriosPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;  // Código de éxito
        state.message = 'Consultorios cargados con éxito';
        state.consultorios = payload.content;
        state.total = payload.totalElements;
        state.prev = payload.first;
        state.next = payload.last;
        state.numberPage = payload.number;
      })
      // Acción rejected: Se ejecuta si la carga de consultorios falla
      .addCase(getConsultoriosPaginado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500; // Default code to 500 if no status
        state.message = payload?.message || 'Error al listar los consultorios';
        state.consultorios = []; // Limpiar los consultorios si hay un error
      });
  }
});

export const { resetState } = consultorioSlice.actions;
export default consultorioSlice.reducer;
