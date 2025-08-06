import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './componentcss/stockHistoryChart.css';
import { useLocation } from 'react-router-dom';


function StockHistoryChart() {
    const location = useLocation();
    const avgPurchasePrice = location.state?.avgPrice;
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
                    price: item.avg_price
                }));
                setData(chartData);
                const highestPrice = content.highest_price;
                const lowestPrice = content.lowest_price;
                const avgPrice = content.avg_price;
                const latestPrice = content.latest_price;
                const priceChange = content.price_deviation;
                const priceChangePercent = content.price_deviation_percent;
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
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Price Summary</h3>
                        <ul className="list-disc list-inside">
                            <li>Highest Price: {highestPrice}</li>
                            <li>Lowest Price: {lowestPrice}</li>
                            <li>Average Price: {avgPrice}</li>
                            <li>Latest Price: {latestPrice}</li>
                            <li>Price Change: {priceChange}</li>
                            <li>Price Change (%): {priceChangePercent}</li>
                            <li>Average Purchase Price: {avgPurchasePrice}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockHistoryChart;