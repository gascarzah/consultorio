import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import clienteAxios from '../config/axios';


const initialState = {
    loading: '',
    code: null,
    message: null,
    logged: false,
    empresa: {},
    empresas: [],
    total: [],
    prev: null,
    next: null,
    numberPage: 0
};

export const getEmpresasPaginado = createAsyncThunk(
    'getEmpresasPaginado',
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
            
            const { data } = await clienteAxios.get(`/empresas/pageable`, { params });
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)




export const registrarEmpresa = createAsyncThunk(
    'registrarEmpresa',
    async (values, { rejectWithValue }) => {


        try {


            const { data } = await clienteAxios.post(`/empresas`, values);

            return data
        } catch (error) {
            console.error('error')
            console.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)
export const modificarEmpresa = createAsyncThunk(
    'modificarEmpresa',
    async (values, { rejectWithValue }) => {


        try {


            const { data } = await clienteAxios.put(`/empresas`, values);

            return data
        } catch (error) {
            console.error('error')
            console.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const getEmpresa = createAsyncThunk(
    'getEmpresa',
    async (id, { rejectWithValue }) => {
        try {

            const { data } = await clienteAxios.get(`/empresas/${id}`);

            return data
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)

export const getEmpresas = createAsyncThunk(
    'getEmpresas',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await clienteAxios.get(`/empresas`);
            return data
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)

export const eliminarEmpresa = createAsyncThunk(
    'eliminarEmpresa',
    async (id, { rejectWithValue }) => {
        try {
            await clienteAxios.delete(`/empresas/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const empresaSlice = createSlice({
    name: 'empresa',
    initialState,
    reducers: { resetState: () => initialState, },
    // reducers: {},
    extraReducers(builder) {
        builder
            // .addCase(revertAll, () => initialState)
            .addCase(registrarEmpresa.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'

            })
            .addCase(registrarEmpresa.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
                state.empresas = []
            })
            .addCase(getEmpresasPaginado.pending, (state) => {
                state.loading = true;
            })
            .addCase(getEmpresasPaginado.fulfilled, (state, { payload }) => {
                state.loading = false
                state.code = 201
                state.message = 'se encontro'
                state.empresas = payload.content || []
                state.total = payload.totalElements || 0
                state.prev = payload.first
                state.next = payload.last
                state.numberPage = payload.number
            })
            .addCase(getEmpresasPaginado.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
                state.empresas = []
                state.total = 0
            })
            .addCase(getEmpresa.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'
                state.empresa = payload
            })
            .addCase(getEmpresa.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
            })
            .addCase(getEmpresas.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'
                state.empresas = payload
            })
            .addCase(getEmpresas.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
            })
            .addCase(modificarEmpresa.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'

            })
            .addCase(modificarEmpresa.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
                state.empresas = []
            })
            .addCase(eliminarEmpresa.pending, (state) => {
                state.loading = true
            })
            .addCase(eliminarEmpresa.fulfilled, (state, { payload }) => {
                state.loading = false
                state.code = 200
                state.message = 'Empresa eliminada'
                state.empresas = state.empresas.filter((empresa) => empresa.idEmpresa !== payload)
            })
            .addCase(eliminarEmpresa.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload?.status || 500
                state.message = payload?.message || 'No se pudo eliminar la empresa'
            })
    }


})



export const { resetState } = empresaSlice.actions

export default empresaSlice.reducer

