import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.component.jsx';
import Watchlist from './watchlist.component.jsx';
import './componentcss/watchlist.component.css';

function Watchlist_page({ session , handleLogout}) {

    return (
        <div>
            <div style={{ paddingTop: '20px', paddingLeft: '20px' }}>
                <Navbar handleLogout={handleLogout} />
            </div>
            <div className='heading'>
                <h1>My Watchlist</h1>
            </div>
            <Watchlist session={session} handleLogout={handleLogout} />
        </div>
    );
}

export default Watchlist_page;

