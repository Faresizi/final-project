import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/axios';


export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
try {
const { data } = await api.post('/auth/login', payload);
return data;
} catch (e) {
return rejectWithValue(e.response?.data || { error: 'Login failed' });
}
});


const tokenFromStorage = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');


const authSlice = createSlice({
name: 'auth',
initialState: {
user: userFromStorage ? JSON.parse(userFromStorage) : null,
token: tokenFromStorage || null,
status: 'idle',
error: null,
},
reducers: {
logout(state) {
state.user = null;
state.token = null;
localStorage.removeItem('token');
localStorage.removeItem('user');
},
},
extraReducers: (builder) => {
builder
.addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
.addCase(login.fulfilled, (state, action) => {
state.status = 'succeeded';
state.token = action.payload.token;
state.user = action.payload.user;
localStorage.setItem('token', action.payload.token);
localStorage.setItem('user', JSON.stringify(action.payload.user));
})
.addCase(login.rejected, (state, action) => {
state.status = 'failed';
state.error = action.payload?.error || 'Login failed';
});
}
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;