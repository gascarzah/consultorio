import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

const SUCCESS_CODE = 201;
const SUCCESS_MESSAGE = 'Operación realizada correctamente';
const ERROR_MESSAGE = 'Hubo un error en la operación';

const initialState = {
  loading: false,
  code: null,
  message: null,
  logged: false,
  programaciones: [],
  programacion: {},
  total: [],
  prev: null,
  next: null,
  numberPage: 0,
};

// Función genérica para manejar casos fulfilled
const handleFulfilled = (state, action, message) => {
  state.loading = false;
  state.code = SUCCESS_CODE;
  state.message = message;
  if (action.payload) {
    state.programaciones = action.payload.content || state.programaciones;
    state.programacion = action.payload || state.programacion;
    state.total = action.payload.totalElements || state.total;
    state.prev = action.payload.first || state.prev;
    state.next = action.payload.last || state.next;
    state.numberPage = action.payload.number || state.numberPage;
  }
};

// Función genérica para manejar casos rejected
const handleRejected = (state, action) => {
  state.loading = false;
  state.code = action.payload.status;
  state.message = action.payload.message || ERROR_MESSAGE;
};

// Acciones asíncronas
export const registrarProgramacion = createAsyncThunk(
  'programacion',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post("/programaciones", values);
      return data;
    } catch (error) {
      console.error('Error en registrar programacion:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProgramacionesPaginado = createAsyncThunk(
  'getProgramacionesPaginado',
  async (values, { rejectWithValue }) => {
    try {
      
      const { data } = await clienteAxios.get(`/programaciones/${values.idEmpresa}/pageable`, {
        params: {
          page: values.page,
          size: values.size,
          ...(values.search ? { search: values.search } : {}),
        },
      });
      
      
      return data;
    } catch (error) {
      console.error('=== ERROR EN GET PROGRAMACIONES PAGINADO ===');
      console.error('Error completo:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProgramacionActivo = createAsyncThunk(
  'getProgramacionActivo',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/programaciones/activo`);
      return data;
    } catch (error) {
      console.error('Error en getProgramacionActivo:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProgramacion = createAsyncThunk(
  'getProgramacion',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/programaciones/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const modificarProgramacion = createAsyncThunk(
  'modificarProgramacion',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put('/programaciones', values);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const eliminarProgramacion = createAsyncThunk(
  'eliminarProgramacion',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.delete(`/programaciones/${id}`);
      return data;
    } catch (error) {
      console.error('Error en eliminarProgramacion:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const programacionSlice = createSlice({
  name: 'programacion',
  initialState,
  reducers: { resetState: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(getProgramacionesPaginado.pending, (state) => {
        state.loading = true;
      })
      .addCase(registrarProgramacion.fulfilled, (state, { payload }) => {
        handleFulfilled(state, { payload }, 'Se grabó correctamente');
      })
      .addCase(registrarProgramacion.rejected, handleRejected)
      .addCase(getProgramacionesPaginado.fulfilled, (state, { payload }) => {
        handleFulfilled(state, { payload }, 'Se encontró la programación');
      })
      .addCase(getProgramacionesPaginado.rejected, handleRejected)
      .addCase(getProgramacionActivo.fulfilled, (state, { payload }) => {
        handleFulfilled(state, { payload }, 'Se encontró la programación activa');
      })
      .addCase(getProgramacionActivo.rejected, handleRejected)
      .addCase(getProgramacion.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = SUCCESS_CODE;
        state.message = 'Se encontró la programación';
        state.programacion = payload;
      })
      .addCase(getProgramacion.rejected, handleRejected)
      .addCase(modificarProgramacion.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = SUCCESS_CODE;
        state.message = 'Se actualizó correctamente';
        state.programacion = payload;
      })
      .addCase(modificarProgramacion.rejected, handleRejected)
      .addCase(eliminarProgramacion.pending, (state) => {
        state.loading = true;
      })
      .addCase(eliminarProgramacion.fulfilled, (state) => {
        handleFulfilled(state, {}, 'Se eliminó correctamente');
      })
      .addCase(eliminarProgramacion.rejected, handleRejected);
  },
});

export const { resetState } = programacionSlice.actions;
export default programacionSlice.reducer;
