import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Header from './components/header.component';
import PortfolioTable from './components/portfolioTable.component';
import AddStock from './components/addStock.component';
import AuthScreen from './components/authScreen';
import PortfolioChart from './components/portfolioChart.component';
import StockHistoryChart from './components/StockHistoryChart';
import StockInfo from './components/StockInfo.component';
import Navbar from './components/Navbar.component.jsx';
import Wishlist from './components/watchlist.component.jsx';
import Watchlist_page from './components/watchlist_page.component';
import './App.css';

function MainApp({ session, setSession }) {
  const [portfolio, setPortfolio] = useState([]);
  const [newStock, setNewStock] = useState({ symbol: '', shares: '', price: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (session) fetchPortfolio();
  }, [session]);

  const fetchPortfolio = async () => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', session?.user?.id);
    if (error) console.error('Error fetching portfolio:', error);
    else setPortfolio(data);
  };

  

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPortfolio([]);
    setSession(null);
  };

  return (
    <div className="App">
      <Navbar handleLogout={handleLogout} /> {/* ⬅ Navbar at top */}
      <Header setPortfolio={setPortfolio} />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto bg-white p-4 sm:p-6 shadow rounded-none md:rounded max-w-full md:max-w-4xl">
          <PortfolioChart portfolio={portfolio} />
          <PortfolioTable
            portfolio={portfolio}
            fetchPortfolio={fetchPortfolio}
            setSelectedStock={(stock) =>
              navigate(`/stock/${stock.symbol}`, {
                state: { avgPrice: stock.avgPrice, shares: stock.shares },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [portfolio, setPortfolio] = useState([]);
  const [newStock, setNewStock] = useState({ symbol: '', shares: '', price: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error('Google Sign-in error:', error.message);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword(formData);
    if (error) alert(error.message);
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp(formData);
    if (error) alert(error.message);
    else alert('Check your email for confirmation!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPortfolio([]);
    setSession(null);
  };

  const fetchPortfolio = async () => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', session?.user?.id);
    if (error) console.error('Error fetching portfolio:', error);
    else setPortfolio(data);
  };

  const addStock = async () => {
    const { symbol, shares, price } = newStock;
    const parsedShares = parseFloat(shares);
    const parsedPrice = parseFloat(price);
    const userId = session.user.id;

    const { data: existingStocks, error: fetchError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .eq('stock_symbol', symbol);

    if (fetchError) {
      console.error('Error checking existing stock:', fetchError);
      return;
    }

    const existingStock = existingStocks?.[0];

    if (existingStock) {
      const totalShares = existingStock.shares + parsedShares;
      const newAvgPrice = (
        (existingStock.shares * existingStock.average_price + parsedShares * parsedPrice) /
        totalShares
      ).toFixed(2);

      const { error: updateError } = await supabase
        .from('portfolios')
        .update({
          shares: totalShares,
          average_price: parseFloat(newAvgPrice),
        })
        .eq('id', existingStock.id);

      if (updateError) {
        console.error('Error updating stock:', updateError);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from('portfolios').insert([
        {
          user_id: userId,
          stock_symbol: symbol,
          shares: parsedShares,
          average_price: parsedPrice,
        },
      ]);
      if (insertError) {
        console.error('Error inserting stock:', insertError);
        return;
      }
    }

    setNewStock({ symbol: '', shares: '', price: '' });
    fetchPortfolio();
  };

  if (!session) {
    return (
      <AuthScreen
        className="App"
        authMode={authMode}
        setAuthMode={setAuthMode}
        formData={formData}
        setFormData={setFormData}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp session={session} setSession={setSession} />} />
        <Route path="/search" element={<AddStock addStock={addStock} newStock={newStock} setNewStock={setNewStock} handleLogout={handleLogout} session={session} />} />
        <Route path="/stock/:symbol" element={<StockHistoryChart />} />
        <Route path="/stock-info/:symbol" element={<StockInfo />} />
        <Route path="/wishlist" element={<Watchlist_page session={session} handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
