import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import clienteAxios from '../config/axios';
import { registrarRolMenu } from './rolMenuSlice';
import { setAuthFromTokens, setRol } from './authSlice';


const initialState = {
  loading: false,
  user: {},
  usuario: null,
  code: null,
  message: null,
  logged: false,
  usuarios: [],
  passwordChanged: false,
};

const rejectApiError = (error, rejectWithValue) => {
  const status = error.response?.status ?? 0;
  const data = error.response?.data;
  if (typeof data === 'object' && data !== null) {
    return rejectWithValue({
      status: data.status ?? status,
      message: data.message ?? 'Error en la solicitud',
    });
  }
  const message =
    (typeof data === 'string' && data) ||
    error.message ||
    'No se pudo conectar con el servidor';
  return rejectWithValue({ status, message });
};

export const registrarUsuario = createAsyncThunk(
  'usuario',
  async (values, { dispatch, rejectWithValue }) => {
    try {
      const { password2, ...registro } = values;
      void password2;
      const { data } = await clienteAxios.post("/usuarios", registro);

      dispatch(setAuthFromTokens(data));

      const menuResponse = await clienteAxios.get(`/menus`);
      const menuIds = menuResponse.data
        .filter(menu => menu.activo) // Solo menús activos
        .map(menu => menu.idMenu);
      
      if (menuIds.length > 0) {
        // Registrar la relación rol-menu
        await dispatch(registrarRolMenu({ 
          idRol: values.idRol,
          idsMenu: menuIds
        })).unwrap();
      }

      // Obtener información del rol
      const rolResponse = await clienteAxios.get(`/roles/${values.idRol}`);
      
      // Actualizar el rol en el estado de autenticación
      dispatch(setRol(rolResponse.data));

      return data;
    } catch (error) {
      return rejectApiError(error, rejectWithValue);
    }
  }
)

export const getUsuario = createAsyncThunk(
  'getUsuario',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/usuarios/${encodeURIComponent(email)}`);
      return data
    } catch (error) {
      return rejectApiError(error, rejectWithValue);
    }
  }
)
export const getUsuarioPorId = createAsyncThunk(
  'getUsuarioPorId',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.get(`/usuarios/id/${id}`);
      return data
    } catch (error) {
      return rejectApiError(error, rejectWithValue);
    }
  }
)

export const getUsuariosPaginado = createAsyncThunk(
  'getUsuariosPaginado',
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
      
      const { data } = await clienteAxios.get(`/usuarios/pageable`, { params });
      return data
    } catch (error) {
      return rejectApiError(error, rejectWithValue);
    }
  }
)


export const modificarUsuario = createAsyncThunk(
  'modificarUsuario',
  async (values, { rejectWithValue }) => {

    try {
      const { data } = await clienteAxios.put(`/usuarios`, values);
      return data
    } catch (error) {
      return rejectApiError(error, rejectWithValue);
    }
  }
)

export const eliminarUsuario = createAsyncThunk(
  'eliminarUsuario',
  async (id, { rejectWithValue }) => {
    try {
      await clienteAxios.delete(`/usuarios/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const cambiarPassword = createAsyncThunk(
  'usuario/cambiarPassword',
  async ({ passwordActual, nuevaPassword, idUsuario }, { rejectWithValue }) => {
    try {
      const { data } = await clienteAxios.post('/usuario/cambiar-password', {
        passwordActual,
        nuevaPassword,
        idUsuario
      });
      return data;
    } catch (error) {
      const data = error.response?.data;
      const message =
        (typeof data === 'string' && data) ||
        data?.message ||
        'No se pudo cambiar la contraseña';
      return rejectWithValue(message);
    }
  }
);


const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: { resetState: () => initialState, },

  extraReducers(builder) {
    builder
      // .addCase(revertAll, () => initialState)
      .addCase(registrarUsuario.pending, (state, action) => {
        state.loading = true
      })
      .addCase(registrarUsuario.fulfilled, (state, { payload }) => {
        state.loading = false
        state.code = 201
        state.message = payload?.message ?? 'ok'
      })
      .addCase(registrarUsuario.rejected, (state, { payload }) => {
        state.loading = false
        state.code = payload?.status ?? 0
        state.message = payload?.message ?? 'No se pudo registrar el usuario'
      })
      .addCase(getUsuario.fulfilled, (state, { payload }) => {
        state.loading = false
        state.code = 201
        state.message = 'se encontro'

        state.user = {
          id: payload.idUsuario,
          email: payload.email,
          nombreCompleto: payload.empleado.apellidoPaterno + ' ' +
            payload.empleado.apellidoMaterno + ', ' +
            payload.empleado.nombres,
          idEmpleado: payload.empleado.idEmpleado,
          idEmpresa: payload.empleado.empresa.idEmpresa
        }
      })
      .addCase(getUsuario.rejected, (state, { payload }) => {
        state.loading = false
        state.code = payload?.status ?? 0
        state.message = payload?.message ?? 'No se pudo obtener el usuario'
      })
      .addCase(getUsuarioPorId.pending, (state) => {
        state.loading = true
      })
      .addCase(getUsuarioPorId.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.code = 201;
        state.message = 'Usuario encontrado';
        state.usuario = payload;
      })
      .addCase(getUsuarioPorId.rejected, (state, { payload }) => {
        state.loading = false
        state.code = payload?.status ?? 0
        state.message = payload?.message ?? 'No se pudo obtener el usuario'
      })
      .addCase(getUsuariosPaginado.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsuariosPaginado.fulfilled, (state, { payload }) => {
        state.loading = false
        state.code = 201
        state.message = 'se encontro'
        const page = payload ?? {}
        state.usuarios = page.content ?? []
        state.total = page.totalElements ?? 0
        state.prev = page.first
        state.next = page.last
        state.numberPage = page.number
      })
      .addCase(getUsuariosPaginado.rejected, (state, { payload }) => {
        state.loading = false
        state.code = payload?.status ?? 0
        state.message = payload?.message ?? 'No se pudo listar usuarios'
        state.usuarios = []
        state.total = 0
      })
      .addCase(modificarUsuario.pending, (state) => {
        state.loading = true
      })
      .addCase(modificarUsuario.fulfilled, (state, { payload }) => {
        state.loading = false
        state.code = 201
        state.message = 'se encontro'

      })
      .addCase(modificarUsuario.rejected, (state, { payload }) => {
        state.loading = false
        state.code = payload?.status ?? 0
        state.message = payload?.message ?? 'No se pudo modificar el usuario'
        state.usuarios = []
      })
      .addCase(eliminarUsuario.pending, (state) => {
        state.loading = true
      })
      .addCase(eliminarUsuario.fulfilled, (state, { payload }) => {
        state.loading = false
        state.code = 200
        state.message = 'Usuario eliminado'
        state.usuarios = state.usuarios.filter((usuario) => usuario.idUsuario !== payload)
      })
      .addCase(eliminarUsuario.rejected, (state, { payload }) => {
        state.loading = false
        state.code = payload?.status || 500
        state.message = payload?.message || 'No se pudo eliminar el usuario'
      })
      .addCase(cambiarPassword.pending, (state) => {
        state.loading = true;
        state.passwordChanged = false;
      })
      .addCase(cambiarPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordChanged = true;
        state.code = 200;
        state.message = 'Contraseña cambiada exitosamente';
      })
      .addCase(cambiarPassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordChanged = false;
        state.code = action.payload?.status || 400;
        state.message = action.payload?.message || 'Error al cambiar la contraseña';
      })
  }


})



export const { resetState } = usuarioSlice.actions

export default usuarioSlice.reducer

