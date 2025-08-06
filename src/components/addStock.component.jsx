import React, {useState} from 'react';
import { supabase } from '../supabaseClient';
import SymbolSearch from '../SymbolSearch';

function AddStock({ newStock, setNewStock, addStock }) {
    const [errors, setErrors] = useState({});

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


    return (
        <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Add New Stock</h2>
            <div className="add-stock-form">
                <div className="input-group">
                    <SymbolSearch
                        value={newStock.symbol}
                        onChange={e => setNewStock(prev => ({ ...prev, symbol: e.target.value }))}
                        onSelect={symbol => setNewStock(prev => ({ ...prev, symbol }))}
                        className="symbol-search-input"

                    />
                    {errors.symbol && <div className="error-message">{errors.symbol}</div>}
                </div>
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Shares"
                        value={newStock.shares}
                        onChange={e => setNewStock({ ...newStock, shares: e.target.value })}
                    />
                    {errors.shares && <div className="error-message">{errors.shares}</div>}
                </div>
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Avg Price"
                        value={newStock.price}
                        onChange={e => setNewStock({ ...newStock, price: e.target.value })}
                    />
                    {errors.price && <div className="error-message">{errors.price}</div>}
                </div>
                <button onClick={handleAddStock} className="add-button">
                    Add Stock
                </button>
            </div>
        </div>
    );
}

export default AddStock;