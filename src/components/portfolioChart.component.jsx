import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './componentcss/portfolioChart.css';

const fetchStockPrice = async (symbol) => {
    const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
    try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=d283259r01qr2iaue53gd283259r01qr2iaue540`);
        const data = await response.json();

        // data.c = current price
        if (data.c) {
        return { currentPrice: data.c };
        } else {
        throw new Error('Invalid data from API');
        }
    } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error);
        return { currentPrice: 0 }; // fallback
    }
};


const PortfolioChart = ({ portfolio, selectedStock }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchPrices = async () => {
        let totalInvested = 0;
        let totalCurrent = 0;
        const data = [];

        for (const stock of portfolio) {
            const { stock_symbol, shares, average_price } = stock;

            const { currentPrice } = await fetchStockPrice(stock_symbol);
            const invested = shares * average_price;
            const current = shares * currentPrice;

            if (!selectedStock || stock_symbol === selectedStock) {
            data.push({
                name: stock_symbol,
                invested: Number(invested.toFixed(2)),
                current: Number(current.toFixed(2)),
            });
            }

            totalInvested += invested;
            totalCurrent += current;
        }

        if (!selectedStock) {
            data.unshift({
            name: 'Total',
            invested: Number(totalInvested.toFixed(2)),
            current: Number(totalCurrent.toFixed(2)),
            });
        }

        setChartData(data);
        };

        if (portfolio.length > 0) fetchPrices();
    }, [portfolio, selectedStock]);

    const heading = selectedStock
        ? `Performance of ${selectedStock}`
        : 'Total Portfolio Performance';

    return (
        <div className="portfolio-chart">
            
            <ResponsiveContainer
                className="chart-container"
                width="95%"
                height={300}
                style={{ backgroundColor: 'black' }}
            >
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                        dataKey="name"
                        stroke="#ccc"
                    />
                    <YAxis
                        domain={[
                            Math.floor(
                                Math.min(
                                    ...chartData.map(d => Math.min(d.invested, d.current))
                                ) * 0.98
                            ),
                            Math.ceil(
                                Math.max(
                                    ...chartData.map(d => Math.max(d.invested, d.current))
                                ) * 1.02
                            )
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
                        labelFormatter={(label) => `Symbol: ${label}`}
                        formatter={(value, name) => [`$${value}`, name]}
                    />
                    <Legend wrapperStyle={{ color: "#fff" }} />
                    <Line
                        type="monotone"
                        dataKey="invested"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="current"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};


export default PortfolioChart;
