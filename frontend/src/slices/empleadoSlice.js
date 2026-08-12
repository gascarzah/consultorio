import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

const initialState = {
  loading: false, // Cambiado a false por defecto
  user: {},
  code: null,
  message: null,
  logged: false,
  empleados: [],
  total: [],
  prev: null,
  next: null,
  numberPage: 0,
  empleado: null
};

// Acción para registrar empleado
export const registrarEmpleado = createAsyncThunk(
  'empleado/registrar',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post("/empleados", values);
      return data;
    } catch (error) {
      console.error('Error al registrar empleado:', error);
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Acción para obtener empleados por empresa
export const getEmpleadosPorEmpresa = createAsyncThunk(
  'empleado/getPorEmpresa',
  async (value, { rejectWithValue }) => {
    try {
      const response = await clienteAxios.get(`/empleados/empresa/${value}`);
      if (response.status === 204 || !response.data) return [];
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error al obtener empleados por empresa:', error);
      return rejectWithValue(error?.response?.data || 'Error desconocido');
    }
  }
);

// Acción para obtener odontólogos por empresa
export const getOdontologosPorEmpresa = createAsyncThunk(
  'empleado/getOdontologosPorEmpresa',
  async (value, { rejectWithValue }) => {
    try {
      const response = await clienteAxios.get(`/empleados/empresa/${value}/odontologos`);
      if (response.status === 204 || !response.data) return [];
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error al obtener odontólogos por empresa:', error);
      return rejectWithValue(error?.response?.data || 'Error desconocido');
    }
  }
);

// Acción para obtener empleados paginados
export const getEmpleadosPaginado = createAsyncThunk(
  'empleado/getPaginado',
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
      
      const { data } = await clienteAxios.get('/empleados/pageable', { params });
      return data;
    } catch (error) {
      console.error('Error al obtener empleados paginados:', error);
      return rejectWithValue(error?.response?.data || 'Error desconocido');
    }
  }
);

// Acción para modificar empleado
export const modificarEmpleado = createAsyncThunk(
  'empleado/modificar',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put("/empleados", values);
      return data;
    } catch (error) {
      console.error('Error al modificar empleado:', error);
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Acción para obtener un empleado por ID
export const getEmpleado = createAsyncThunk(
  'empleado/get',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/empleados/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      return rejectWithValue(error?.response?.data || 'Error desconocido');
    }
  }
);

export const eliminarEmpleado = createAsyncThunk(
  'empleado/eliminar',
  async (id, { rejectWithValue }) => {
    try {
      await clienteAxios.delete(`/empleados/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data || 'Error desconocido');
    }
  }
);

const empleadoSlice = createSlice({
  name: 'empleado',
  initialState,
  reducers: { 
    resetState: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getEmpleadosPorEmpresa.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200; // Asegurarse de asignar un código de estado adecuado
        state.message = 'Empleados obtenidos con éxito';
        state.empleados = Array.isArray(payload) ? payload : [];
      })
      .addCase(getEmpleadosPorEmpresa.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500; // Asignar un valor predeterminado de código de error
        state.message = payload?.message || 'Error al obtener empleados';
        state.empleados = [];
      })
      .addCase(getOdontologosPorEmpresa.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Odontólogos obtenidos con éxito';
        state.empleados = Array.isArray(payload) ? payload : [];
      })
      .addCase(getOdontologosPorEmpresa.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al obtener odontólogos';
        state.empleados = [];
      })
      .addCase(getEmpleadosPaginado.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmpleadosPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200; // Código de éxito
        state.message = 'Empleados cargados con éxito';
        state.empleados = payload.content || [];
        state.total = payload.totalElements || 0;
        state.prev = payload.first;
        state.next = payload.last;
        state.numberPage = payload.number;
      })
      .addCase(getEmpleadosPaginado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500; // Valor predeterminado de error
        state.message = payload?.message || 'Error al cargar empleados';
        state.empleados = [];
        state.total = 0;
      })
      .addCase(modificarEmpleado.fulfilled, (state) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Empleado modificado correctamente';
      })
      .addCase(modificarEmpleado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al modificar empleado';
      })
      .addCase(getEmpleado.pending, (state) => {
        state.loading = true;
        state.empleado = null;
        state.error = null;
      })
      .addCase(getEmpleado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Empleado obtenido con éxito';
        state.empleado = payload;
      })
      .addCase(getEmpleado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al obtener empleado';
        state.empleado = null;
      })
      .addCase(eliminarEmpleado.pending, (state) => {
        state.loading = true;
      })
      .addCase(eliminarEmpleado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Empleado eliminado correctamente';
        state.empleados = state.empleados.filter((empleado) => empleado.idEmpleado !== payload);
      })
      .addCase(eliminarEmpleado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al eliminar empleado';
      });
  }
});

export const { resetState } = empleadoSlice.actions;

export default empleadoSlice.reducer;
