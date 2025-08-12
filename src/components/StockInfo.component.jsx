import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './componentcss/stockHistoryChart.css';
import './componentcss/loadingSpinner.css';


function StockInfo() {
    const location = useLocation();
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const [highestPrice, setHighestPrice] = useState(null);
    const [lowestPrice, setLowestPrice] = useState(null);
    const [avgPrice, setAvgPrice] = useState(null);
    const [latestPrice, setLatestPrice] = useState(null);
    const [priceChange, setPriceChange] = useState(null);
    const [priceChangePercent, setPriceChangePercent] = useState(null);

    const [predicted_high, setPredictedHigh] = useState(null);
    const [predicted_low, setPredictedLow] = useState(null);
    const [predicted_open, setPredictedOpen] = useState(null);
    const [predicted_close, setPredictedClose] = useState(null);
    const [trend, setTrend] = useState(null);
    const [confidence, setConfidence] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://portfoliopythonapi.onrender.com/stock-price/${symbol}`);
                const content = response.data;
                const chartData = content.data.map(item => ({
                    date: item.date,
                    price: item.avg_price
                    // avgPurchasePrice: avgPurchasePrice
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
        const fetchPrediction = async () => {
            try {
                const response = await axios.get(`https://portfoliopythonapi.onrender.com/predict/${symbol}`);
                const content = response.data;
                // Handle prediction data if needed
                const predicted_open = content.predicted_open.toFixed(2);
                const predicted_high = content.predicted_high.toFixed(2);
                const predicted_low = content.predicted_low.toFixed(2);
                const predicted_close = content.predicted_close.toFixed(2);
                const trend = content.trend;
                const confidence = content.confidence.toFixed(4);
                setPredictedOpen(predicted_open);
                setPredictedHigh(predicted_high);
                setPredictedLow(predicted_low);
                setPredictedClose(predicted_close);
                setTrend(trend);
                setConfidence(confidence);
            } catch (error) {
                console.error("Error fetching stock prediction:", error);
            } finally {
                setLoading(false); // stop loading once both are done
            }
        };
        const fetchAll = async () => {
            await fetchData();
            await fetchPrediction();
        };
        fetchAll();
    }, [symbol]);

    if (loading) {
        return (
            <div className="loader">
            </div>
        );
    }

    return (
        <div className='App'>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                    <button onClick={() => navigate(-1)} className="back-button">
                        ← Back
                    </button>
                    <div className="stock-header">
                        <div className="stock-symbol" style={{ fontWeight: 'bold', fontSize: '2rem' , color: 'white'}}>{symbol}</div>
                        <div className="stock-price">${latestPrice}</div>
                        <div className={`stock-change ${priceChange > 0 ? 'green' : 'red'}`}>
                            {priceChange > 0 ? '▲' : '▼'} ${priceChange} ({priceChangePercent}%)
                        </div>
                        <div className="stock-period">Past month</div>
                    </div>
                    <ResponsiveContainer width="90%" height={350} style={{ margin: '0 auto' }}>
                        <LineChart data={data}>
                            <YAxis
                                domain={[
                                    Math.floor(lowestPrice * 0.98),
                                    Math.ceil(highestPrice * 1.02)
                                ]}
                                tickFormatter={(value) => `$${value}`}
                                stroke="#ccc"
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#222",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#fff"
                                }}
                                labelStyle={{ color: "#fff" }}
                                labelFormatter={(label) => `Date: ${label}`}
                                formatter={(value) => [`$${value}`, "Price"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#00C805"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: "#00C805",
                                    stroke: "#fff",
                                    strokeWidth: 2
                                }}
                            />
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
                            
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className='container'>
                            <div className='grid-header'>
                                <h3 className="text-lg font-semibold">Price Prediction</h3>
                            </div>
                            <div className='stats col1'>
                                <ul className="stats list-disc list-inside">
                                    <li className='stats-elements'>Predicted High: {predicted_high}</li>
                                    <li className='stats-elements'>Predicted Low: {predicted_low}</li>
                                </ul>
                            </div>
                            <div className='stats col2'>
                                <ul className="list-disc list-inside">
                                    <li className='stats-elements'>Predicted Open: {predicted_open}</li>
                                    <li className='stats-elements'>Predicted Close: {predicted_close}</li>
                                </ul>
                            </div>
                            <div className='stats col3'>
                                <ul className="list-disc list-inside">
                                    <li className='stats-elements'>Predicted Trend: {trend}</li>
                                    <li className='stats-elements'>Confidence: {confidence}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockInfo;