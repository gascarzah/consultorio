import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import clienteAxios from '../config/axios';


const initialState = {
    loading: '',
    code: null,
    message: null,
    logged: false,
    rolMenu: {},
    rolMenus: [],
    rolMenusGen: [],
    total: [],
    prev: null,
    next: null,
    numberPage: 0
};






export const registrarRolMenu = createAsyncThunk(
    'registrarRolMenu',
    async (values, { rejectWithValue }) => {


        try {


            const { data } = await clienteAxios.post(`/rolMenus`, values);

            return data
        } catch (error) {
            console.error('error')
            console.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)
export const modificarRolMenu = createAsyncThunk(
    'modificarRolMenu',
    async (values, { rejectWithValue }) => {


        try {


            const { data } = await clienteAxios.put(`/rolMenus`, values);

            return data
        } catch (error) {
            console.error('error')
            console.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const getMenusPorRol = createAsyncThunk(
    'getMenusPorRol',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await clienteAxios.get(`/rolMenus/${values}`);
            return data
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)


export const getMenusPorRolTodo = createAsyncThunk(
    'getMenusPorRolTodo',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await clienteAxios.get(`/rolMenus/menus/${values}`);
            return data
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)

const rolMenuSlice = createSlice({
    name: 'rolMenu',
    initialState,
    reducers: {
        resetState: () => initialState,
        clearRolMenuEditorState: (state) => {
            state.rolMenu = {};
            state.rolMenus = [];
            state.loading = false;
            state.code = null;
            state.message = null;
        },
    },
    // reducers: {},
    extraReducers(builder) {
        builder
            // .addCase(revertAll, () => initialState)
            .addCase(registrarRolMenu.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'

            })
            .addCase(registrarRolMenu.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
                state.rolMenus = []
            })           
            .addCase(modificarRolMenu.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'

            })
            .addCase(modificarRolMenu.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
                state.rolMenus = []
            })
             .addCase(getMenusPorRol.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'
                state.rolMenus = payload
            })
            .addCase(getMenusPorRol.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
            })
             .addCase(getMenusPorRolTodo.fulfilled, (state, { payload }) => {
                // state.loading = 'grabo'
                state.loading = false
                state.code = 201
                state.message = 'se encontro'
                // Serializar fechas para evitar warnings de Redux
                state.rolMenusGen = JSON.parse(JSON.stringify(payload))
            })
            .addCase(getMenusPorRolTodo.rejected, (state, { payload }) => {
                state.loading = false
                state.code = payload.status
                state.message = payload.message
            })
    }


})



export const { resetState, clearRolMenuEditorState } = rolMenuSlice.actions

export default rolMenuSlice.reducer

