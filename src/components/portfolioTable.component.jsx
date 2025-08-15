import React from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';
import './componentcss/portfolioTable.css';
import trashicon from './assets/trash.png';

function PortfolioTable({ portfolio, fetchPortfolio, setSelectedStock }) {

    const deleteStock = async (id) => {
        const { error } = await supabase.from('portfolios').delete().eq('id', id);
        if (error) console.error('Error deleting stock:', error);
        else fetchPortfolio();
    };

    return (
        <table className="w-full mb-6 border border-gray-200" style={{ alignContent: 'center', margin: 'auto', width: '60%', textAlign: 'center', border: '1px solid black' }}>
        <thead className="bg-gray-100">
            <tr>
            <th className="text-left p-2">Stock Symbol</th>
            <th className="text-left p-2">Shares</th>
            <th className="text-left p-2">Avg. Price</th>
            <th className="text-left p-2">Action</th>
            </tr>
        </thead>
        <tbody>
            {portfolio.map(stock => (
            <tr key={stock.id} className="border-t">
                <td className="p-2" style={{ paddingRight: '10%' }}>
                <button
                    className="select-stock-button"
                    onClick={() => 
                        setSelectedStock({
                            symbol: stock.stock_symbol,
                            avgPrice: stock.average_price,
                            shares: stock.shares
                        })
                        }
                >
                    {stock.stock_symbol}
                </button>
                </td>
                <td className="p-2">{stock.shares}</td>
                <td className="p-2">{stock.average_price}</td>
                <td className="p-2">
                <button
                    onClick={() => deleteStock(stock.id)}
                >
                    <img src={trashicon} className="delete-icon" />
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    );
}
export default PortfolioTable;
