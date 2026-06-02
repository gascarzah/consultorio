import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

const initialState = {
  loading: false, // Cambiado a booleano
  code: null,
  message: null,
  logged: false,
  cita: {},
  citas: [],
  total: [],
  prev: null,
  next: null,
  numberPage: 0
};

// Obtener horarios paginados
export const citasHoy = createAsyncThunk(
  'citasHoy',
  async (fecha, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/citas/hoy/${fecha}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: { resetState: () => initialState },
  extraReducers(builder) {
    builder
      .addCase(citasHoy.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'se encontro';
        state.citas = payload;


      })
      .addCase(citasHoy.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500;
        state.message = payload?.message || 'Error al cargar horarios';
      });
  }
});

export const { resetState } = dashboardSlice.actions;

export default dashboardSlice.reducer;
