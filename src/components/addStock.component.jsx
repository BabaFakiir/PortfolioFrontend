import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SymbolSearch from '../SymbolSearch';
import './componentcss/AddStock.component.css';
import Navbar from './Navbar.component.jsx';
import '../App.css';

function AddStock({ newStock, setNewStock, addStock, handleLogout}) {
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!newStock.symbol.trim()) {
            newErrors.symbol = "Symbol is required.";
        }

        if (!newStock.shares || isNaN(newStock.shares) || Number(newStock.shares) <= 0) {
            newErrors.shares = "Please enter a valid number of shares.";
        }

        if (!newStock.price || isNaN(newStock.price) || Number(newStock.price) <= 0) {
            newErrors.price = "Please enter a valid average price.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddStock = () => {
        if (validate()) {
            addStock(newStock);
            setNewStock({ symbol: '', shares: '', price: '' });
            setErrors({});
        }
    };

    const handleGetInfo = () => {
        if (!newStock.symbol.trim()) {
            setErrors(prev => ({ ...prev, symbol: "Symbol is required." }));
            return;
        }
        navigate(`/stock-info/${newStock.symbol}`, {
            state: { }
        });
    };

    return (
        <div>
            <div style={{ paddingTop: '20px', paddingLeft: '20px' }}>
                <Navbar handleLogout={handleLogout} />
            </div>
            <div className="add-stock-form container">
                <div className="input-group search">
                    <SymbolSearch
                        value={newStock.symbol}
                        onChange={e => setNewStock(prev => ({ ...prev, symbol: e.target.value }))}
                        onSelect={symbol => setNewStock(prev => ({ ...prev, symbol }))}
                        className="symbol-search-input"
                    />
                    {errors.symbol && <div className="error-message">{errors.symbol}</div>}
                </div>
                <div className="input-group qty">
                    <input
                        type="number"
                        placeholder="Shares"
                        value={newStock.shares}
                        onChange={e => setNewStock({ ...newStock, shares: e.target.value })}
                    />
                    {errors.shares && <div className="error-message">{errors.shares}</div>}
                </div>
                <div className="input-group price">
                    <input
                        type="number"
                        placeholder="Avg Price"
                        value={newStock.price}
                        onChange={e => setNewStock({ ...newStock, price: e.target.value })}
                    />
                    {errors.price && <div className="error-message">{errors.price}</div>}
                </div>
                <div className='container'>
                    <div className='col1'>
                        <button onClick={handleAddStock} className="add-button">
                            Add Stock
                        </button>
                    </div>
                    <div className='col2'>
                        <button className="add-button" onClick={handleGetInfo}>
                            Get Info/Prediction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddStock;
