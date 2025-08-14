import React from 'react';
import './componentcss/AuthScreen.css';
import logo from './assets/app_logo.png';


function AuthScreen({
    authMode,
    setAuthMode,
    formData,
    setFormData,
    handleLogin,
    handleSignup,
    handleGoogleSignIn
}) {
    return (
        <div className="App">
            <div className="heading-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' , justifyContent: 'center'}}>
                    <img src={logo} alt="App Logo" className="app-logo" style={{ height: '400px' }} />
                </div>
                {/* <h1 className="heading">Welcome to shAIr</h1> */}
                <h2 className="subheading">Your Personal Portfolio Manager</h2>

                <h3 className="text-lg font-bold mb-4 text-white">
                    {authMode === 'login' ? 'Login' : 'Sign Up'}
                </h3>

                <input
                    className="w-full mb-3 px-4 py-2 border border-green-400 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    className="w-full mb-4 px-4 py-2 border border-green-400 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />

                <button
                    onClick={authMode === 'login' ? handleLogin : handleSignup}
                    className="log-in-button"
                >
                    {authMode === 'login' ? 'Login' : 'Sign Up'}
                </button>

                <p className="text-sm mb-4">
                    {authMode === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <button className="sign-up-button" onClick={() => setAuthMode('signup')}>
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button className="log-in-button" onClick={() => setAuthMode('login')}>
                                Login
                            </button>
                        </>
                    )}
                </p>

                <button
                    onClick={handleGoogleSignIn}
                    className="log-in-button"
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

export default AuthScreen;
