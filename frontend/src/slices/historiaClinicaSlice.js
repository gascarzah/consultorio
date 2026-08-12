import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import historiaclinicaAxios from '../config/axios';

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

const getErrorMessage = (error) => {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  if (typeof data === 'object' && data !== null) {
    return data.error || data.title || JSON.stringify(data);
  }
  return error?.message || 'Error desconocido';
};

const emptyPage = { content: [], totalElements: 0, first: true, last: true, number: 0 };

export const registrarHistoriaClinica = createAsyncThunk(
  'registrarHistoriaClinica',
  async (values, { rejectWithValue }) => {
    try {
      const { idHistoriaClinica, ...rest } = values || {};
      const payload =
        idHistoriaClinica === '' || idHistoriaClinica == null
          ? rest
          : { ...rest, idHistoriaClinica };
      const { data } = await historiaclinicaAxios.post('/historiasClinicas', payload);
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
      const { data } = await historiaclinicaAxios.put('/historiasClinicas', values);
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
      const response = await historiaclinicaAxios.get(`/historiasClinicas`);
      if (response.status === 204 || !response.data) return [];
      return response.data;
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

      if (values.search && values.search.trim()) {
        params.search = values.search.trim();
      }

      const response = await historiaclinicaAxios.get(`/historiasClinicas/pageable`, { params });
      if (response.status === 204 || !response.data) return emptyPage;
      return response.data;
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

const historiaClinicaSlice = createSlice({
  name: 'historiaClinica',
  initialState,
  reducers: { resetState: () => initialState },
  extraReducers(builder) {
    builder
      .addCase(registrarHistoriaClinica.pending, (state) => {
        state.loading = true;
      })
      .addCase(registrarHistoriaClinica.fulfilled, (state) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Historia clínica registrada';
      })
      .addCase(registrarHistoriaClinica.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = 400;
        state.message = typeof payload === 'string' ? payload : payload?.message;
      })
      .addCase(modificarHistoriaClinica.pending, (state) => {
        state.loading = true;
      })
      .addCase(modificarHistoriaClinica.fulfilled, (state) => {
        state.loading = false;
        state.code = 200;
        state.message = 'Historia clínica modificada';
      })
      .addCase(modificarHistoriaClinica.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = 400;
        state.message = typeof payload === 'string' ? payload : payload?.message;
      })
      .addCase(getHistoriaClinica.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'HistoriaClinica encontrado';
        state.historiaClinica = payload;
      })
      .addCase(getHistoriaClinica.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = 404;
        state.message = typeof payload === 'string' ? payload : payload?.message;
      })
      .addCase(getHistoriaClinicas.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'HistoriaClinicas encontrados';
        state.historiaClinicas = payload || [];
      })
      .addCase(getHistoriaClinicas.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = 400;
        state.message = typeof payload === 'string' ? payload : payload?.message;
      })
      .addCase(getHistoriaClinicasPaginado.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHistoriaClinicasPaginado.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 200;
        state.message = 'HistoriaClinicas encontrados';
        state.historiaClinicas = payload?.content || [];
        state.total = payload?.totalElements || 0;
        state.prev = payload?.first;
        state.next = payload?.last;
        state.numberPage = payload?.number ?? 0;
      })
      .addCase(getHistoriaClinicasPaginado.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = 400;
        state.message = typeof payload === 'string' ? payload : payload?.message;
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
        state.code = 500;
        state.message =
          (typeof payload === 'string' ? payload : payload?.message) ||
          'No se pudo eliminar la historia clínica';
      });
  },
});

export const { resetState } = historiaClinicaSlice.actions;

export default historiaClinicaSlice.reducer;
