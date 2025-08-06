// Login.jsx
import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        setErrorMsg(error.message);
    } else {
        onLogin(data.user); // pass user back to App
    }
};

return (
    <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Log In</button>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
    );
}

export default Login;
