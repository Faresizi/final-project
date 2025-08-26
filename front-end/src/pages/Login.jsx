import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';


export default function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { status, error } = useSelector((s) => s.auth);
const dispatch = useDispatch();
const nav = useNavigate();


async function onSubmit(e) {
e.preventDefault();
const res = await dispatch(login({ email, password }));
if (res.type.endsWith('fulfilled')) nav('/dashboard');
}


return (
<form onSubmit={onSubmit} style={{ padding: 16, maxWidth: 360 }}>
<h2>Login</h2>
<input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
<input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<button disabled={status==='loading'}>Login</button>
{error && <p style={{color:'crimson'}}>{error}</p>}
</form>
);
}