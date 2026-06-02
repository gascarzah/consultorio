import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

// Estado inicial
const initialState = {
  loading: false,
  cliente: {},
  code: null,
  message: null,
  clientes: [],
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
export const registrarCliente = createAsyncThunk(
  'registrarCliente',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post("/clientes", values);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const modificarCliente = createAsyncThunk(
  'modificarCliente',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put("/clientes", values);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getCliente = createAsyncThunk(
  'getCliente',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/clientes/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getClientes = createAsyncThunk(
  'getClientes',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/clientes`);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getClientesPaginado = createAsyncThunk(
  'getClientesPaginado',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/clientes/pageable`, {
        params: {
          page: values.page,
          size: values.size,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: { resetState: () => initialState },
  extraReducers(builder) {
    builder
      .addCase(registrarCliente.pending, (state) => {
        state.loading = true;
      })
      .addCase(registrarCliente.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(registrarCliente.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(modificarCliente.pending, (state) => {
        state.loading = true;
      })
      .addCase(modificarCliente.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(modificarCliente.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(getCliente.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Cliente encontrado';
        state.cliente = {
          id: payload.idCliente,
          email: payload.email,
          nombreCompleto: `${payload.apellidoPaterno} ${payload.apellidoMaterno}, ${payload.nombres}`,
        };
      })
      .addCase(getCliente.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(getClientes.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Clientes encontrados';
        state.clientes = payload;
      })
      .addCase(getClientes.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      })
      .addCase(getClientesPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Clientes encontrados';
        state.clientes = payload.content;
        state.total = payload.totalElements;
        state.prev = payload.first;
        state.next = payload.last;
        state.numberPage = payload.number;
      })
      .addCase(getClientesPaginado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status;
        state.message = payload.message;
      });
  },
});

// Acción para restablecer el estado
export const { resetState } = clienteSlice.actions;

// Reducer del slice
export default clienteSlice.reducer;
