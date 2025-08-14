import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './componentcss/navbar.css'; 
import logo from './assets/navbar_app_logo.png'; 
import profileIcon from './assets/user_profile_icon.png';

function Navbar({ handleLogout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        background: '#000',
        color: 'white'
        }}>
        {/* Left side: Logo + Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
            to="/"
            style={{
                color: 'lime',
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '20px'
            }}
            >
            <img src={logo} alt="App Logo" style={{ height: '100px', marginRight: '10px' }} />
            </Link>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Portfolio</Link>
            <Link to="/search" style={{ color: 'white', textDecoration: 'none' }}>Search Stock</Link>
        </div>

        <div style={{ position: 'relative', display: 'inline-block' }}>
            <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer', fontSize: '20px',  marginRight: '10px' }}>
                <img src={profileIcon} alt="Profile" style={{ height: '35px', marginRight: '10px' }} />
            </div>
            {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '30px', background: '#111', padding: '10px', borderRadius: '5px' , marginRight: '-10px'}}>
                    <button className='log-out-button' onClick={handleLogout}>
                        LogOut
                    </button>
                </div>
            )}
        </div>
    </nav>
);
}

export default Navbar;
