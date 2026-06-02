import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clienteAxios from '../config/axios';

const initialState = {
  sessionConfig: {
    keepAlive: true,
    sessionTimeout: 8, // horas
    autoRefresh: true,
    showSessionIndicator: true
  },
  sessionInfo: {
    lastActivity: new Date().toISOString(),
    sessionStart: new Date().toISOString(),
    isActive: true,
    deviceInfo: navigator.userAgent,
    ipAddress: null
  },
  activeSessions: [],
  loading: false,
  error: null
};

// Obtener configuración de sesión
export const getSessionConfig = createAsyncThunk(
  'session/getConfig',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get('/session/config');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener configuración');
    }
  }
);

// Actualizar configuración de sesión
export const updateSessionConfig = createAsyncThunk(
  'session/updateConfig',
  async (config, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.put('/session/config', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar configuración');
    }
  }
);

// Refrescar sesión
export const refreshSession = createAsyncThunk(
  'session/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post('/session/refresh');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al refrescar sesión');
    }
  }
);

// Obtener sesiones activas
export const getActiveSessions = createAsyncThunk(
  'session/getActive',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get('/session/active');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener sesiones activas');
    }
  }
);

// Terminar sesión específica
export const terminateSession = createAsyncThunk(
  'session/terminate',
  async (sessionId, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.delete(`/session/${sessionId}`);
      return { sessionId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al terminar sesión');
    }
  }
);

// Terminar todas las sesiones excepto la actual
export const terminateAllSessions = createAsyncThunk(
  'session/terminateAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.delete('/session/terminate-all');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al terminar sesiones');
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    updateLastActivity: (state) => {
      state.sessionInfo.lastActivity = new Date().toISOString();
    },
    setSessionActive: (state, action) => {
      state.sessionInfo.isActive = action.payload;
    },
    updateSessionInfo: (state, action) => {
      state.sessionInfo = { ...state.sessionInfo, ...action.payload };
    },
    resetSessionState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Get Session Config
      .addCase(getSessionConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSessionConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionConfig = action.payload;
      })
      .addCase(getSessionConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Session Config
      .addCase(updateSessionConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSessionConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionConfig = action.payload;
      })
      .addCase(updateSessionConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Refresh Session
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionInfo.lastActivity = new Date().toISOString();
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Active Sessions
      .addCase(getActiveSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActiveSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSessions = action.payload;
      })
      .addCase(getActiveSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Terminate Session
      .addCase(terminateSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(terminateSession.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSessions = state.activeSessions.filter(
          session => session.id !== action.payload.sessionId
        );
      })
      .addCase(terminateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Terminate All Sessions
      .addCase(terminateAllSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(terminateAllSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSessions = state.activeSessions.filter(
          session => session.isCurrent
        );
      })
      .addCase(terminateAllSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  updateLastActivity, 
  setSessionActive, 
  updateSessionInfo, 
  resetSessionState 
} = sessionSlice.actions;

export default sessionSlice.reducer; 