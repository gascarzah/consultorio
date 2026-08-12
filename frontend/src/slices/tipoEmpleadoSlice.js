import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

const initialState = {
  loading: false,
  code: null,
  message: null,
  logged: false,
  tipoEmpleado: {},
  tipoEmpleados: [],
  total: 0,
  prev: null,
  next: null,
  numberPage: 0
};

// 🔹 Función reutilizable para crear thunks asíncronos
const asyncThunkCreator = (type, apiCall) => createAsyncThunk(type, async (params, { rejectWithValue }) => {
  try {
    const { data } = await apiCall(params);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Error desconocido', status: 500 });
  }
});

// 🔹 Thunks reutilizando la función `asyncThunkCreator`
export const getTipoEmpleadosPaginado = asyncThunkCreator('tipoEmpleados/getPaginado', 
  (values) => clienteAxios.get('/tipo-empleados/pageable', {
    params: {
      page: values.page,
      size: values.size,
      ...(values.search ? { search: values.search } : {}),
    }
  })
);

export const registrarTipoEmpleado = asyncThunkCreator('tipoEmpleados/registrar', 
  (values) => clienteAxios.post('/tipo-empleados', values)
);

export const modificarTipoEmpleado = asyncThunkCreator('tipoEmpleados/modificar', 
  (values) => clienteAxios.put('/tipo-empleados', values)
);

export const getTipoEmpleado = asyncThunkCreator('tipoEmpleados/get', 
  (id) => clienteAxios.get(`/tipo-empleados/${id}`)
);

export const getTipoEmpleados = createAsyncThunk('tipoEmpleados/getAll', async (params, { rejectWithValue }) => {
  try {
    const response = await clienteAxios.get('/tipo-empleados');
    if (response.status === 204 || !response.data) return [];
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error en getTipoEmpleados:', error);
    return rejectWithValue(error.response?.data || { message: 'Error desconocido', status: 500 });
  }
});

export const eliminarTipoEmpleado = asyncThunkCreator(
  'tipoEmpleados/eliminar',
  (id) => clienteAxios.delete(`/tipo-empleados/${id}`)
);

const tipoEmpleadoSlice = createSlice({
  name: 'tipoEmpleado',
  initialState,
  reducers: {
    resetState: () => ({ ...initialState })
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Obtener tipos de empleados paginados
      .addCase(getTipoEmpleadosPaginado.pending, (state) => { state.loading = true; })
      .addCase(getTipoEmpleadosPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Tipos de empleados paginados obtenidos correctamente';
        state.tipoEmpleados = payload.content;
        state.total = payload.totalElements;
        state.prev = payload.first;
        state.next = payload.last;
        state.numberPage = payload.number;
      })
      .addCase(getTipoEmpleadosPaginado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status ?? 500;
        state.message = payload?.message ?? 'Error desconocido';
        state.tipoEmpleados = [];
      })

      // 🔹 Obtener un tipo de empleado por ID
      .addCase(getTipoEmpleado.pending, (state) => { state.loading = true; })
      .addCase(getTipoEmpleado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Tipo de empleado obtenido correctamente';
        state.tipoEmpleado = payload;
      })
      .addCase(getTipoEmpleado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status ?? 500;
        state.message = payload?.message ?? 'Error desconocido';
      })

      // 🔹 Obtener todos los tipos de empleados
      .addCase(getTipoEmpleados.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(getTipoEmpleados.fulfilled, (state, { payload }) => {
        
        state.loading = false;
        state.code = 200;
        state.message = 'Tipos de empleados obtenidos correctamente';
        state.tipoEmpleados = payload;
        
      })
      .addCase(getTipoEmpleados.rejected, (state, { payload }) => {
        
        state.loading = false;
        state.code = payload?.status ?? 500;
        state.message = payload?.message ?? 'Error desconocido';
        state.tipoEmpleados = [];
      })

      // 🔹 Registrar un tipo de empleado
      .addCase(registrarTipoEmpleado.pending, (state) => { state.loading = true; })
      .addCase(registrarTipoEmpleado.fulfilled, (state) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Tipo de empleado registrado correctamente';
      })
      .addCase(registrarTipoEmpleado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status ?? 500;
        state.message = payload?.message ?? 'Error desconocido';
      })

      // 🔹 Modificar un tipo de empleado
      .addCase(modificarTipoEmpleado.pending, (state) => { state.loading = true; })
      .addCase(modificarTipoEmpleado.fulfilled, (state) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Tipo de empleado modificado correctamente';
      })
      .addCase(modificarTipoEmpleado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status ?? 500;
        state.message = payload?.message ?? 'Error desconocido';
      })
      .addCase(eliminarTipoEmpleado.pending, (state) => {
        state.loading = true;
      })
      .addCase(eliminarTipoEmpleado.fulfilled, (state, action) => {
        const idEliminado = action.meta.arg;
        state.loading = false;
        state.code = 200;
        state.message = 'Tipo de empleado eliminado correctamente';
        state.tipoEmpleados = state.tipoEmpleados.filter((item) => item.idTipoEmpleado !== idEliminado);
      })
      .addCase(eliminarTipoEmpleado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status ?? 500;
        state.message = payload?.message ?? 'Error al eliminar tipo de empleado';
      });
  }
});

export const { resetState } = tipoEmpleadoSlice.actions;
export default tipoEmpleadoSlice.reducer;
