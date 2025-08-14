import React from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';
import './componentcss/header.css';

function Header({ setPortfolio }) {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setPortfolio([]);
    };

    return (
        <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="heading-box">
                    <h1 className="heading">Portfolio Manager</h1>
                </div>
                {/* <button
                    onClick={handleLogout}
                    className="log-out-button"
                >
                    Log Out
                </button> */}
            </div>
        </header>
    );
}

export default Header;
