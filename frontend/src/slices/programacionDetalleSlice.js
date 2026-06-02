import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';
import { registrarEmpleado } from './empleadoSlice';

const initialState = {
  loading: false,
  code: null,
  message: null,
  logged: true,
  dias: [],
  diasDeSemana: [],
  diaAtencion: '',
  programacionesDetalle: [],
  programacionDetalle: {},
  total: [],
  prev: null,
  next: null,
  numberPage: 0,
};

// Obtener las citas del d?a actual
export const getCitasDelDia = createAsyncThunk(
  'getCitasDelDia',
  async (values, { rejectWithValue }) => {
    try {
      const result = await clienteAxios.get('/programacionesDetalladas/medico/dia', {
        params: {
          'idMedico': values.idEmpleado,
          numeroDiaSemana: getToday(),
        },
      });
      const { data } = result;
      return data;
    } catch (error) {
      console.error('error');
      console.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Obtener detalles de la programaci?n
export const getProgramacionDetalles = createAsyncThunk(
  'programacionDetalle',
  async (values, { rejectWithValue }) => {
    try {
      const result = await clienteAxios.get('/programacionesDetalladas/listarDiasProgramados', {
        params: {
          'numeroDocumento': values.numeroDocumento,
          'idEmpresa': values.idEmpresa,
        },
      });
      const { data } = result;
      return data;
    } catch (error) {
      console.error('error');
      console.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Verificar programaci?n
export const getVerificarProgramacion = createAsyncThunk(
  'verificarProgramacion',
  async (values, { rejectWithValue }) => {
    try {
      const result = await clienteAxios.get(`/programacionesDetalladas/verifica?idMedico=${values.idMedico}&fechaInicial=${values.fechaInicial}&fechaFinal=${values.fechaFinal}`);
      const { data } = result;
      return data;
    } catch (error) {
      console.error('error');
      console.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Obtener programaci?n de detalles paginados
export const getProgramacionesDetallePaginado = createAsyncThunk(
  'getProgramacionesDetallePaginado',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get('/programacionesDetalladas/pageable', {
        params: {
          page: values.page,
          size: values.size,
          ...(values.search ? { search: values.search } : {}),
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Registrar detalle de programaci?n
export const registrarProgramacionDetalle = createAsyncThunk(
  'registrarProgramacionDetalle',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post("/programacionesDetalladas", values);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Modificar detalle de programaci?n
export const modificarProgramacionDetalle = createAsyncThunk(
  'modificarProgramacionDetalle',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put("/programacionesDetalladas", values);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Obtener detalle de programaci?n por ID
export const getProgramacionDetallePorId = createAsyncThunk(
  'getProgramacionDetallePorId',
  async (id, { rejectWithValue }) => {
    try {
      const result = await clienteAxios.get(`/programacionesDetalladas/programaDetalle/${id}`);
      const { data } = result;
      return data;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        return rejectWithValue({ status: 404, message: `No existe detalle de programaci?n para el ID ${id}` });
      }
      return rejectWithValue(error?.response?.data || { message: error?.message || 'Error al obtener programaci?n detalle' });
    }
  }
);

export const eliminarProgramacionDetalle = createAsyncThunk(
  'eliminarProgramacionDetalle',
  async (id, { rejectWithValue }) => {
    try {
      await clienteAxios.delete(`/programacionesDetalladas/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getToday = () => {
  const date = new Date();
  const day = date.getDay();
  return day;
};

// Slice de programaci?n detallada
const programacionDetalleSlice = createSlice({
  name: 'programacionDetalle',
  initialState,
  reducers: { resetState: () => initialState },
  extraReducers(builder) {
    builder
      .addCase(getProgramacionesDetallePaginado.pending, (state) => {
        state.loading = true;
      })
      // Manejo de la respuesta correcta de obtener la programaci?n de detalles
      .addCase(getProgramacionDetalles.fulfilled, (state, { payload }) => {

        if (payload) {
          state.dias = payload;
          state.loading = false;
          state.code = 201;
          state.message = 'Se grabaron los datos correctamente';

          const selectedProgramacionDetalle = state.dias.find(
            (el) => el.numeroDiaSemana === getToday()
          );
          if (selectedProgramacionDetalle) {
            state.diaAtencion = selectedProgramacionDetalle.idProgramacionDetalle;
          }
        } else {
          state.dias = [];
          state.diaAtencion = '';
        }
      })
      .addCase(getProgramacionDetalles.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        if (payload?.status === 403) {
          state.logged = false;
        }
        state.message = payload?.message || 'Error de conexi?n con el servidor';
      })

      // Manejo de la respuesta correcta de obtener las citas del d?a
      .addCase(getCitasDelDia.fulfilled, (state, { payload }) => {
        state.dias = payload;
        state.loading = false;
        state.code = 201;
        state.message = 'Se grabaron los datos correctamente';
      })
      .addCase(getCitasDelDia.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        if (payload?.status === 403) {
          state.logged = false;
        }
        state.message = payload?.message || 'Error de conexi?n con el servidor';
      })

      // Manejo de la respuesta correcta de verificar programaci?n
      .addCase(getVerificarProgramacion.fulfilled, (state, { payload }) => {
        state.dias = payload;
        state.loading = false;
        state.code = 201;
        state.message = 'Se grabaron los datos correctamente';
      })
      .addCase(getVerificarProgramacion.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        if (payload?.status === 403) {
          state.logged = false;
        }
        state.message = payload?.message || 'Error de conexi?n con el servidor';
      })

      // Manejo de la respuesta correcta de obtener detalles de la programaci?n paginados
      .addCase(getProgramacionesDetallePaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Se encontraron los datos';
        state.programacionesDetalle = payload.content;
        state.total = payload.totalElements;
        state.prev = payload.first;
        state.next = payload.last;
        state.numberPage = payload.number;
      })
      .addCase(getProgramacionesDetallePaginado.rejected, (state, { payload }) => {
        
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error de conexi?n con el servidor';
        state.programacionesDetalle = [];
      })

      // Manejo de la respuesta correcta al registrar un detalle de programaci?n
      .addCase(registrarProgramacionDetalle.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Se grabaron los datos correctamente';
      })
      .addCase(registrarProgramacionDetalle.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error de conexi?n con el servidor';
      })

      // Manejo de la respuesta correcta al obtener detalle de programaci?n por ID
      .addCase(getProgramacionDetallePorId.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Se encontr? la programaci?n';
        state.programacionDetalle = payload;
      })
      .addCase(getProgramacionDetallePorId.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error de conexi?n con el servidor';
      })

      // Manejo de la respuesta correcta al modificar un detalle de programaci?n
      .addCase(modificarProgramacionDetalle.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Se modificaron los datos correctamente';
      })
      .addCase(modificarProgramacionDetalle.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error de conexi?n con el servidor';
      })
      .addCase(eliminarProgramacionDetalle.pending, (state) => {
        state.loading = true;
      })
      .addCase(eliminarProgramacionDetalle.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Programaci?n detalle eliminada correctamente';
        state.programacionesDetalle = state.programacionesDetalle.filter(
          (detalle) => detalle.idProgramacionDetalle !== payload
        );
      })
      .addCase(eliminarProgramacionDetalle.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al eliminar programaci?n detalle';
      });
  },
});

export const { resetState } = programacionDetalleSlice.actions;
export default programacionDetalleSlice.reducer;
