import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Bar, Cell } from 'recharts';
import axios from 'axios';
import './componentcss/stockHistoryChart.css';
import './componentcss/loadingSpinner.css';


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

    const [predicted_high, setPredictedHigh] = useState(null);
    const [predicted_low, setPredictedLow] = useState(null);
    const [predicted_open, setPredictedOpen] = useState(null);
    const [predicted_close, setPredictedClose] = useState(null);
    const [trend, setTrend] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [rsi, setRSI] = useState(null);

    const [rsiData, setRsiData] = useState([]);
    const [showRSIChart, setShowRSIChart] = useState(false);

    const [macdData, setMacdData] = useState([]);
    const [showMACDChart, setShowMACDChart] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [predictionFetched, setPredictionFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://portfoliopythonapi.onrender.com/stock-price/${symbol}`);
                
                const content = response.data;
                const chartData = content.data.map(item => ({
                    date: item.date,
                    price: item.avg_price,
                    rsi: item.rsi
                }));
                setData(chartData);
                setRsiData(chartData.slice(-14));
                const macdSeries = content.macd_data.map(item => ({
                    date: item.date,
                    macd: item.macd,
                    signal: item.signal,
                    histogram: item.histogram
                }));
                setMacdData(macdSeries);
                const highestPrice = content.highest_price.toFixed(2);
                const lowestPrice = content.lowest_price.toFixed(2);
                const avgPrice = content.avg_price.toFixed(2);
                const latestPrice = content.latest_price.toFixed(2);
                const priceChange = content.price_deviation.toFixed(2);
                const priceChangePercent = content.price_deviation_percent.toFixed(2);
                const rsi = content.rsi.toFixed(2);
                setHighestPrice(highestPrice);
                setLowestPrice(lowestPrice);
                setAvgPrice(avgPrice);
                setLatestPrice(latestPrice);
                setPriceChange(priceChange);
                setPriceChangePercent(priceChangePercent);
                setRSI(rsi);
            } catch (error) {
                console.error("Error fetching stock price:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [symbol]);

    const fetchPrediction = async () => {
        try {
            setPredictionLoading(true);
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
            setPredictionFetched(true);
        } catch (error) {
            console.error("Error fetching stock prediction:", error);
        } finally {
            setPredictionLoading(false);
        }
    };

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
                        <div className="stock-symbol">{symbol}</div>
                        <div className="stock-price">${latestPrice}</div>
                        <div className={`stock-change ${priceChange > 0 ? 'green' : 'red'}`}>
                            {priceChange > 0 ? '▲' : '▼'} ${priceChange} ({priceChangePercent}%)
                        </div>
                        <div className="stock-period">Past month</div>
                    </div>
                    <ResponsiveContainer width="90%" height={window.innerWidth <= 768 ? 250 : 350} style={{ margin: '0 auto' }}>
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
                                    <li className='stats-elements' style={{color: "white"}}>
                                        14 Day RSI: {rsi}{" "}
                                        <button 
                                            onClick={() => setShowRSIChart(!showRSIChart)} 
                                            className="ml-2 text-blue-500 underline text-sm"
                                            style={{cursor: "pointer", color: "#00C805"}}
                                        >
                                            {showRSIChart ? '▲' : '▼'}
                                        </button>
                                    </li>

                                    {showRSIChart && (
                                        <div className="mt-4">
                                            <ResponsiveContainer width="90%" height={window.innerWidth <= 768 ? 200 : 300} style={{ margin: '0 auto' }}>
                                                <LineChart data={rsiData}>
                                                    <CartesianGrid stroke="#ccc" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis yAxisId="left" stroke="#00C805" tickFormatter={(val) => `$${val}`} />
                                                    <YAxis yAxisId="right" orientation="right" stroke="#FF5733" domain={[0, 100]} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line yAxisId="left" type="monotone" dataKey="price" stroke="#00C805" name="Price" />
                                                    <Line yAxisId="right" type="monotone" dataKey="rsi" stroke="#FF5733" name="RSI" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    {/* MACD Toggle */}
                                    <li className='stats-elements mt-4' style={{color: "white"}}>
                                        MACD{" "}
                                        <button 
                                            onClick={() => setShowMACDChart(!showMACDChart)} 
                                            className="ml-2 text-blue-500 underline text-sm"
                                            style={{cursor: "pointer", color: "#00C805"}}
                                        >
                                            {showMACDChart ? '▲' : '▼'}
                                        </button>
                                    </li>
                                    {showMACDChart && (
                                        <div className="mt-4">
                                            <ResponsiveContainer width="90%" height={window.innerWidth <= 768 ? 200 : 300} style={{ margin: '0 auto' }}>
                                                <LineChart data={macdData}>
                                                    <CartesianGrid stroke="#ccc" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="macd" stroke="#00C805" name="MACD" />
                                                    <Line type="monotone" dataKey="signal" stroke="#ff0000" name="Signal" />
                                                    <Bar dataKey="histogram" name="Histogram">
                                                    {macdData.map((entry, index) => (
                                                        <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.histogram >= 0 ? "#00C805" : "#ff0000"}
                                                        />
                                                    ))}
                                                    </Bar>
                                                </LineChart>
                                            </ResponsiveContainer>

                                        </div>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Get AI Prediction Button */}
                    <div className="mt-6 text-center">
                        {!predictionFetched && !predictionLoading && (
                            <button 
                                onClick={fetchPrediction}
                                className="get-prediction-btn"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#00C805',
                                    padding: '12px 24px',
                                    border: '2px solid #00C805',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    width: '50%',
                                    maxWidth: '300px',
                                    margin: '0 auto',
                                    display: 'block'
                                }}
                            >
                                Get AI Prediction
                            </button>
                        )}
                        
                        {predictionLoading && (
                            <div className="prediction-loader">
                                <div className="loader" style={{ transform: 'scale(0.5)' }}></div>
                                <p style={{ marginTop: '10px', color: '#00C805', fontSize: '14px' }}>Generating AI Prediction...</p>
                            </div>
                        )}
                    </div>

                    {/* AI Prediction Section */}
                    {predictionFetched && !predictionLoading && (
                        <div className="mt-4">
                            <div className='container'>
                                <div className='grid-header'>
                                    <h3 className="text-lg font-semibold">AI Price Prediction</h3>
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default StockHistoryChart;