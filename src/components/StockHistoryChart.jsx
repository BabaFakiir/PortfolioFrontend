import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './componentcss/stockHistoryChart.css';
import { useLocation } from 'react-router-dom';


function StockHistoryChart() {
    const location = useLocation();
    const avgPurchasePrice = location.state?.avgPrice;
    const shares = location.state?.shares;
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const [highestPrice, setHighestPrice] = useState(null);
    const [lowestPrice, setLowestPrice] = useState(null);
    const [avgPrice, setAvgPrice] = useState(null);
    const [latestPrice, setLatestPrice] = useState(null);
    const [priceChange, setPriceChange] = useState(null);
    const [priceChangePercent, setPriceChangePercent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://portfoliopythonapi.onrender.com/stock-price/${symbol}`);
                const content = response.data;
                const chartData = content.data.map(item => ({
                    date: item.date,
                    price: item.avg_price,
                    avgPurchasePrice: avgPurchasePrice
                }));
                setData(chartData);
                const highestPrice = content.highest_price.toFixed(2);
                const lowestPrice = content.lowest_price.toFixed(2);
                const avgPrice = content.avg_price.toFixed(2);
                const latestPrice = content.latest_price.toFixed(2);
                const priceChange = content.price_deviation.toFixed(2);
                const priceChangePercent = content.price_deviation_percent.toFixed(2);
                setHighestPrice(highestPrice);
                setLowestPrice(lowestPrice);
                setAvgPrice(avgPrice);
                setLatestPrice(latestPrice);
                setPriceChange(priceChange);
                setPriceChangePercent(priceChangePercent);
            } catch (error) {
                console.error("Error fetching stock price:", error);
            }
        };
        fetchData();
    }, [symbol]);

    return (
        <div className='App'>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                    <button onClick={() => navigate(-1)} className="back-button">
                        ← Back
                    </button>
                    <h2 className="text-2xl font-bold mb-4">30-Day Price History: {symbol}</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                            <Line type="monotone" dataKey="avgPurchasePrice" stroke="#82ca9d" dot={false}/>
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                        <div className='container'>
                            <div className='grid-header'>
                                <h3 className="text-lg font-semibold">Price Summary</h3>
                            </div>
                            <div className='stats col1'>
                                <ul className="stats list-disc list-inside">
                                    <li className='stats-elements'>Highest Price: {highestPrice}</li>
                                    <li className='stats-elements'>Lowest Price: {lowestPrice}</li>
                                    <li className='stats-elements'>Average Price: {avgPrice}</li>
                                </ul>
                            </div>
                            <div className='stats col2'>
                                <ul className="list-disc list-inside">
                                    <li className='stats-elements'>Latest Price: {latestPrice}</li>
                                    <li className='stats-elements'>Price Change : {priceChange}</li>
                                    <li className='stats-elements'>Price Change (%): {priceChangePercent}</li>
                                </ul>
                            </div>
                            <div className='stats col3'>
                                <ul className="list-disc list-inside">
                                    <li className='stats-elements'>Avg Purchase Price: {avgPurchasePrice}</li>
                                    <li className='stats-elements'>Total Shares: {shares}</li>
                                    <li className='stats-elements'>Total Investment: {(avgPurchasePrice * shares).toFixed(2)}</li>
                                </ul>
                            </div>
                            <div className='stats grid-footer'>
                                <ul className="list-disc list-inside">
                                    <li className='stats-elements'>Total realised Gain/Loss: {((latestPrice - avgPurchasePrice) * shares).toFixed(2)}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockHistoryChart;