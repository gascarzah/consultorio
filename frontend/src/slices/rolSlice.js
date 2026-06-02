import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import clienteAxios from '../config/axios';

const initialState = {
    loading: false,
    rol: {},    
    error: null,
    message: null,
    roles: [],
  };

  export const getRolesPaginado = createAsyncThunk(
    'getRolesPaginado',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await clienteAxios.get(`/roles/pageable`,
                {
                    params: {
                        page: values.page,
                        size: values.size,
                        ...(values.search ? { search: values.search } : {}),
                    }
                });
            return data
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)




export const registrarRol = createAsyncThunk(
    'registrarRol',
    async (values, { rejectWithValue }) => {


        try {


            const { data } = await clienteAxios.post(`/roles`, values);

            return data
        } catch (error) {
            console.error('error')
            console.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)
export const modificarRol = createAsyncThunk(
    'modificarRol',
    async (values, { rejectWithValue }) => {


        try {


            const { data } = await clienteAxios.put(`/roles`, values);

            return data
        } catch (error) {
            console.error('error')
            console.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const getRol = createAsyncThunk(
    'getRol',
    async (id, { rejectWithValue }) => {
        try {

            const { data } = await clienteAxios.get(`/roles/${id}`);

            return data
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)

export const getRoles = createAsyncThunk(
    'getRoles',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await clienteAxios.get(`/roles`);
            return data
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)

export const eliminarRol = createAsyncThunk(
    'eliminarRol',
    async (id, { rejectWithValue }) => {
        try {
            await clienteAxios.delete(`/roles/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const roleslice = createSlice({
    name: 'rol',
    initialState,
    reducers: { resetState: () => initialState, },
    // reducers: {},
    extraReducers(builder) {
        builder
            // .addCase(revertAll, () => initialState)
            .addCase(getRolesPaginado.pending, (state) => {
                state.loading = true
            })
            .addCase(registrarRol.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'

            })
            .addCase(registrarRol.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
                state.roles = []
            })
            .addCase(getRolesPaginado.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'
                state.roles = payload.content
                state.total = payload.totalElements
                state.prev = payload.first
                state.next = payload.last
                state.numberPage = payload.number
            })
            .addCase(getRolesPaginado.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
                state.roles = []
            })
            .addCase(getRol.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'
                state.rol = payload
            })
            .addCase(getRol.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
            })
            .addCase(getRoles.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'
                state.roles = payload
            })
            .addCase(getRoles.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
            })
            .addCase(modificarRol.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'

            })
            .addCase(modificarRol.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
                state.roles = []
            })
            .addCase(eliminarRol.pending, (state) => {
                state.loading = true
            })
            .addCase(eliminarRol.fulfilled, (state, { payload }) => {
                state.loading = false
                state.code = 200
                state.message = 'Rol eliminado'
                state.roles = state.roles.filter((rol) => rol.idRol !== payload)
            })
            .addCase(eliminarRol.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload?.status || 500
                state.message = payload?.message || 'No se pudo eliminar el rol'
            })
    }


})



export const { resetState } = roleslice.actions

export default roleslice.reducer

