import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';


export default function Navbar() {
const user = useSelector((s) => s.auth.user);
const dispatch = useDispatch();
return (
<nav style={{ display:'flex', gap:16, padding:12, borderBottom:'1px solid #eee' }}>
<Link to="/">Home</Link>
{user ? (
<>
<Link to="/dashboard">Dashboard</Link>
<button onClick={() => dispatch(logout())}>Logout</button>
</>
) : (
<Link to="/login">Login</Link>
)}
</nav>
);
}