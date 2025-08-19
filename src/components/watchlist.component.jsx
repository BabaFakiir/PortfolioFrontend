import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import trash from './assets/trash.png';
import './componentcss/watchlist.component.css';
import { useNavigate } from 'react-router-dom';

function Wishlist({ session, handleLogout }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const navigate = useNavigate();

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`https://portfoliopythonapi.onrender.com/wishlist-prices?user_id=${session.user.id}`);
            const prices = await res.json();
            setWishlistItems(prices);
        } catch (err) {
            console.error("Error fetching wishlist prices:", err);
        }
    };

    const removeFromWishlist = async (id) => {
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) {
            console.error('Error removing from wishlist:', error);
        } else {
            setWishlistItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleGetInfo = (symbol) => {
        navigate(`/stock-info/${symbol}`, {
            state: {}
        });
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    return (
        <div>
            {wishlistItems.length === 0 ? (
                <p>No items in wishlist</p>
            ) : (
                <div>
                    <div className='table-container'>
                        <table className="table" style={{ color: 'white' }}>
                            <thead>
                                <tr>
                                    <th>Stock Symbol</th>
                                    <th>Current Price</th>
                                    <th style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlistItems.map(item => (
                                    <tr key={item.symbol}>
                                        <td data-label="Stock Symbol">{item.symbol}</td>
                                        <td data-label="Current Price">{item.price !== null ? `$${item.price}` : "N/A"}</td>

                                        <td data-label="Action" style={{ display: 'flex', gap: '20%' }}>
                                            <button className='select-stock-button' onClick={() => handleGetInfo(item.symbol)}>
                                                Info / Prediction
                                            </button>
                                            <button className='trash-icon' onClick={() => removeFromWishlist(item.id)}>
                                                <img src={trash} className="delete-icon" alt="Delete" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Wishlist;
