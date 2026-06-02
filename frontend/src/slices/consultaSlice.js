import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

// Estado inicial
const initialState = {
  loading: false,  // `false` por defecto
  code: null,
  message: null,
  citas: [],        // Agregar citas al estado
};

// Acción asincrónica para registrar consulta
export const registrarConsulta = createAsyncThunk(
  'registrarConsulta',
  async (values, { rejectWithValue }) => {

    try {
      // Realizar la solicitud al servidor
      const { data } = await clienteAxios.put('/citas', values);

      return data;
    } catch (error) {
      console.error('error ==> ', error);

      // Validar si la respuesta de error tiene los datos necesarios
      if (error.response && error.response.data && error.response.data.message) {
        console.error(error.response.data.message);
        return rejectWithValue(error.response.data);
      } else {
        console.error('Error desconocido');
        return rejectWithValue('Error desconocido');
      }
    }
  }
);

// Slice para manejar el estado
const registrarConsultaSlice = createSlice({
  name: 'cita',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Acción fulfilled: Se ejecuta si la consulta se registra con éxito
      .addCase(registrarConsulta.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = payload.status || 201; // Asegúrate de obtener el código de la respuesta
        state.message = 'Consulta registrada correctamente';
        state.citas = payload;  // Asignar las citas o la respuesta completa
      })
      // Acción rejected: Se ejecuta si ocurre un error
      .addCase(registrarConsulta.rejected, (state, { payload }) => {
        state.loading = false;
        state.code = payload?.status || 500; // Manejo de casos sin un `status`
        state.message = payload?.message || 'Error al registrar la consulta';
        state.citas = []; // Limpiar las citas en caso de error
      });
  },
});

// Exportar las acciones generadas por el slice
export const { resetState } = registrarConsultaSlice.actions;

// Exportar el reducer para ser usado en el store
export default registrarConsultaSlice.reducer;
