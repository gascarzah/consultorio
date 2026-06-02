import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

const initialState = {
  loading: false, // Cambiado a booleano
  code: null,
  message: null,
  logged: false,
  horario: {},
  horarios: [],
  total: [],
  prev: null,
  next: null,
  numberPage: 0
};

// Obtener horarios paginados
export const getHorariosPaginado = createAsyncThunk(
  'getHorariosPaginado',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/horarios/pageable`, {
        params: {
          page: values.page,
          size: values.size,
          ...(values.search ? { search: values.search } : {}),
        }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Registrar nuevo horario
export const registrarHorario = createAsyncThunk(
  'registrarHorario',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post(`/horarios`, values);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Modificar horario existente
export const modificarHorario = createAsyncThunk(
  'modificarHorario',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put(`/horarios`, values);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Obtener un horario por ID
export const getHorario = createAsyncThunk(
  'getHorario',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/horarios/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Obtener todos los horarios
export const getHorarios = createAsyncThunk(
  'getHorarios',
  async (value, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/horarios`);
      return data;
    } catch (error) {
      console.error('error');
      console.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Eliminar un horario
export const eliminarHorario = createAsyncThunk(
  'eliminarHorario',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.delete(`/horarios/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const horarioSlice = createSlice({
  name: 'horario',
  initialState,
  reducers: { resetState: () => initialState },
  extraReducers(builder) {
    builder
      .addCase(getHorariosPaginado.pending, (state) => {
        state.loading = true;
      })
      .addCase(registrarHorario.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'se grabo correctamente';
      })
      .addCase(registrarHorario.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error desconocido';
      })
      .addCase(getHorariosPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'se encontro';
        state.horarios = payload.content;
        state.total = payload.totalElements;
        state.prev = payload.first;
        state.next = payload.last;
        state.numberPage = payload.number;
      })
      .addCase(getHorariosPaginado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al cargar horarios';
      })
      .addCase(getHorario.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'se encontro';
        state.horario = payload;
      })
      .addCase(getHorario.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al obtener el horario';
      })
      .addCase(modificarHorario.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'se modifico correctamente';
      })
      .addCase(modificarHorario.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al modificar el horario';
      })
      .addCase(eliminarHorario.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'se elimino correctamente';
        state.horarios = state.horarios.filter(h => h.id !== payload.id); // Eliminar el horario de la lista
      })
      .addCase(eliminarHorario.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al eliminar el horario';
      });
  }
});

export const { resetState } = horarioSlice.actions;

export default horarioSlice.reducer;
