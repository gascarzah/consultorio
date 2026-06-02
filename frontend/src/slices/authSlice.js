import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import clienteAxios from '../config/axios';
import jwt_decode from "jwt-decode";


const initialState = {
  loading: false,
  user: {},
  error: null,
  message: null,
  code: null,
  logged: false,
  email: null,
  rol: null,

};


export const login = createAsyncThunk(
  'auth',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post("/auth/login", values);
      // const { data } = await clienteAxios.post("/api/v1/auth/authenticate", values);


      return data
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)

function firstRoleFromUsuario(usuario) {
  if (!usuario?.roles) {
    return null;
  }
  const roles = Array.isArray(usuario.roles)
    ? usuario.roles
    : Object.values(usuario.roles);
  return roles[0] ?? null;
}

/** Carga rol y datos de usuario tras login o refresh de sesión (menú lateral). */
export const loadAuthProfile = createAsyncThunk(
  'auth/loadProfile',
  async (email, { dispatch, rejectWithValue }) => {
    try {
      const userEmail = email;
      if (!userEmail) {
        return rejectWithValue('Email no disponible');
      }

      const { data: usuario } = await clienteAxios.get(
        `/usuarios/${encodeURIComponent(userEmail)}`
      );
      const roleFromUser = firstRoleFromUsuario(usuario);

      if (roleFromUser?.idRol) {
        const { data: rol } = await clienteAxios.get(`/roles/${roleFromUser.idRol}`);
        dispatch(setRol(rol));
        return { usuario, rol };
      }

      if (roleFromUser) {
        dispatch(setRol(roleFromUser));
      }

      return { usuario, rol: roleFromUser };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'No se pudo cargar el perfil';
      return rejectWithValue(message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "No token found" });
      }
      
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        return rejectWithValue({ message: "Token expired" });
      }
      
      return {
        access_token: token,
        decoded
      };
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue({ message: "Invalid token" });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    headerResetState: () => {
      return initialState;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      return initialState;
    },
    setRol: (state, action) => {
      state.rol = action.payload;
    },
    /** Tras registro exitoso: mismo efecto que login (token ya emitido por el backend). */
    setAuthFromTokens: (state, { payload }) => {
      const token = payload.access_token;
      if (!token) return;
      localStorage.setItem("token", token);
      const decoded = jwt_decode(token);
      state.loading = false;
      state.logged = true;
      state.email = decoded.sub;
      state.rol = decoded.roles?.[0] ?? null;
    },
  },
  // reducers: {},
  extraReducers(builder) {
    builder
      // .addCase(revertAll, () => initialState)
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.logged = true;
        state.email = payload.decoded.sub;
        state.rol = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        return initialState;
      })
      .addCase(login.pending, (state, action) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false
        localStorage.setItem("token", payload.access_token)
        const decoded = jwt_decode(payload.access_token)
        state.email = decoded.sub
        state.logged = true
        state.rol = null
      })
      .addCase(loadAuthProfile.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(loadAuthProfile.rejected, (state) => {
        state.loading = false
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        if (typeof payload === 'object' && payload !== null) {
          state.code = payload.status;
          state.message = payload.message || 'Error al iniciar sesión';
        } else {
          state.code = null;
          state.message = payload || 'Error al iniciar sesión';
        }
      })
  }
});

export const { headerResetState, logout, setRol, setAuthFromTokens } = authSlice.actions
export default authSlice.reducer


