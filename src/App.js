import React, { useState, useEffect, useCallback } from 'react';
import { Plus, TrendingUp, TrendingDown, Activity, Database, RefreshCw, AlertCircle } from 'lucide-react';


const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    tradeId: '',
    securityCode: '',
    quantity: '',
    buySell: 'Buy',
    action: 'INSERT'
  });

  const API_BASE_URL = 'http://localhost:8080/api';

  // Load Bootstrap CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }
    
    return () => {
      const existingLink = document.querySelector(`link[href="${link.href}"]`);
      if (existingLink && document.head.contains(existingLink)) {
        document.head.removeChild(existingLink);
      }
    };
  }, []);

  // Simulate API calls (replace with actual API when backend is running)
  const mockTransactions = [
    { transactionId: 1, tradeId: 1, version: 1, securityCode: 'REL', quantity: 50, action: 'INSERT', buySell: 'Buy', timestamp: '2025-08-16T10:00:00' },
    { transactionId: 2, tradeId: 2, version: 1, securityCode: 'ITC', quantity: 40, action: 'INSERT', buySell: 'Sell', timestamp: '2025-08-16T10:01:00' },
    { transactionId: 3, tradeId: 3, version: 1, securityCode: 'INF', quantity: 70, action: 'INSERT', buySell: 'Buy', timestamp: '2025-08-16T10:02:00' },
    { transactionId: 4, tradeId: 1, version: 2, securityCode: 'REL', quantity: 60, action: 'UPDATE', buySell: 'Buy', timestamp: '2025-08-16T10:03:00' },
    { transactionId: 5, tradeId: 2, version: 2, securityCode: 'ITC', quantity: 30, action: 'CANCEL', buySell: 'Buy', timestamp: '2025-08-16T10:04:00' },
    { transactionId: 6, tradeId: 4, version: 1, securityCode: 'INF', quantity: 20, action: 'INSERT', buySell: 'Sell', timestamp: '2025-08-16T10:05:00' }
  ];

  const mockPositions = [
    { securityCode: 'REL', quantity: 60 },
    { securityCode: 'ITC', quantity: 0 },
    { securityCode: 'INF', quantity: 50 }
  ];

  // Fetch transactions from backend (with fallback to mock data)
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/transactions`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        // Fallback to mock data if backend not available
        console.log('Backend not available, using mock data');
        setTransactions(mockTransactions);
      }
    } catch (error) {
      console.log('Backend not available, using mock data');
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Fetch positions from backend (with fallback to mock data)
  const fetchPositions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/positions`);
      if (response.ok) {
        const data = await response.json();
        setPositions(data);
      } else {
        // Fallback to mock data if backend not available
        setPositions(mockPositions);
      }
    } catch (error) {
      setPositions(mockPositions);
    }
  }, [API_BASE_URL]);

  // Add new transaction
  const addTransaction = async () => {
    if (!newTransaction.tradeId || !newTransaction.securityCode || !newTransaction.quantity) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tradeId: parseInt(newTransaction.tradeId),
          securityCode: newTransaction.securityCode.toUpperCase(),
          quantity: parseInt(newTransaction.quantity),
          action: newTransaction.action,
          buySell: newTransaction.buySell
        })
      });

      if (response.ok) {
        // Clear form
        setNewTransaction({
          tradeId: '',
          securityCode: '',
          quantity: '',
          buySell: 'Buy',
          action: 'INSERT'
        });
        
        // Refresh data
        await Promise.all([fetchTransactions(), fetchPositions()]);
      } else {
        // For demo purposes, simulate adding to mock data
        const newTxn = {
          transactionId: Date.now(),
          tradeId: parseInt(newTransaction.tradeId),
          version: 1,
          securityCode: newTransaction.securityCode.toUpperCase(),
          quantity: parseInt(newTransaction.quantity),
          action: newTransaction.action,
          buySell: newTransaction.buySell,
          timestamp: new Date().toISOString()
        };
        
        setTransactions(prev => [newTxn, ...prev]);
        
        // Clear form
        setNewTransaction({
          tradeId: '',
          securityCode: '',
          quantity: '',
          buySell: 'Buy',
          action: 'INSERT'
        });
      }
    } catch (error) {
      // For demo purposes, simulate adding to mock data
      const newTxn = {
        transactionId: Date.now(),
        tradeId: parseInt(newTransaction.tradeId),
        version: 1,
        securityCode: newTransaction.securityCode.toUpperCase(),
        quantity: parseInt(newTransaction.quantity),
        action: newTransaction.action,
        buySell: newTransaction.buySell,
        timestamp: new Date().toISOString()
      };
      
      setTransactions(prev => [newTxn, ...prev]);
      
      // Clear form
      setNewTransaction({
        tradeId: '',
        securityCode: '',
        quantity: '',
        buySell: 'Buy',
        action: 'INSERT'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load sample data
  const loadSampleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/transactions/sample-data`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await Promise.all([fetchTransactions(), fetchPositions()]);
      } else {
        // Fallback to mock data
        setTransactions(mockTransactions);
        setPositions(mockPositions);
      }
    } catch (error) {
      // Fallback to mock data
      setTransactions(mockTransactions);
      setPositions(mockPositions);
    } finally {
      setLoading(false);
    }
  };

  // Clear all data
  const clearData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/transactions/all`, {
        method: 'DELETE'
      });
      
      setTransactions([]);
      setPositions([]);
    } catch (error) {
      setTransactions([]);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchTransactions();
    fetchPositions();
  }, [fetchTransactions, fetchPositions]);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-vh-100 bg-light">      
      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <Activity className="text-primary me-3" size={40} />
                  <div>
                    <h1 className="card-title h2 mb-1">Equity Position Management System</h1>
                    <p className="card-text text-muted mb-0">
                      Real-time equity position tracking with Spring Boot backend
                    </p>
                  </div>
                </div>
                
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <AlertCircle size={20} className="me-2" />
                    <div>{error}</div>
                    <button 
                      type="button" 
                      className="btn-close ms-auto" 
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Add Transaction Form */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Plus size={20} className="me-2" />
                  Add Transaction
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={(e) => { e.preventDefault(); addTransaction(); }}>
                  <div className="mb-3">
                    <label className="form-label">Trade ID *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newTransaction.tradeId}
                      onChange={(e) => setNewTransaction({...newTransaction, tradeId: e.target.value})}
                      placeholder="Enter Trade ID"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Security Code *</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      value={newTransaction.securityCode}
                      onChange={(e) => setNewTransaction({...newTransaction, securityCode: e.target.value})}
                      placeholder="e.g., REL, ITC, INF"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newTransaction.quantity}
                      onChange={(e) => setNewTransaction({...newTransaction, quantity: e.target.value})}
                      placeholder="Enter quantity"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Buy/Sell</label>
                      <select
                        className="form-select"
                        value={newTransaction.buySell}
                        onChange={(e) => setNewTransaction({...newTransaction, buySell: e.target.value})}
                      >
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Action</label>
                      <select
                        className="form-select"
                        value={newTransaction.action}
                        onChange={(e) => setNewTransaction({...newTransaction, action: e.target.value})}
                      >
                        <option value="INSERT">INSERT</option>
                        <option value="UPDATE">UPDATE</option>
                        <option value="CANCEL">CANCEL</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <Plus size={16} className="me-2" />
                    )}
                    Add Transaction
                  </button>
                </form>
                
                <hr className="my-4" />
                
                <div className="d-grid gap-2">
                  <button
                    onClick={loadSampleData}
                    className="btn btn-success d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    <Database size={16} className="me-2" />
                    Load Sample Data
                  </button>
                  <button
                    onClick={clearData}
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    <RefreshCw size={16} className="me-2" />
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Positions and Transactions */}
          <div className="col-lg-8">
            {/* Current Positions */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <TrendingUp size={20} className="me-2" />
                  Current Positions
                </h5>
              </div>
              <div className="card-body">
                {loading && positions.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading positions...</p>
                  </div>
                ) : positions.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <Activity size={48} className="mb-3 text-muted" />
                    <p>No positions yet. Add some transactions to get started.</p>
                  </div>
                ) : (
                  <div className="row">
                    {positions.map((position) => (
                      <div key={position.securityCode} className="col-md-4 mb-3">
                        <div className={`card h-100 ${
                          position.quantity > 0 
                            ? 'border-success bg-success bg-opacity-10' 
                            : position.quantity < 0 
                            ? 'border-danger bg-danger bg-opacity-10'
                            : 'border-secondary bg-light'
                        }`}>
                          <div className="card-body text-center">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="card-title mb-0 fw-bold">{position.securityCode}</h6>
                              {position.quantity > 0 ? (
                                <TrendingUp size={16} className="text-success" />
                              ) : position.quantity < 0 ? (
                                <TrendingDown size={16} className="text-danger" />
                              ) : null}
                            </div>
                            <h4 className={`mb-0 fw-bold ${
                              position.quantity > 0 ? 'text-success' : 
                              position.quantity < 0 ? 'text-danger' : 'text-secondary'
                            }`}>
                              {position.quantity > 0 ? '+' : ''}{position.quantity}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Transaction History */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Database size={20} className="me-2" />
                  Transaction History ({transactions.length})
                </h5>
              </div>
              <div className="card-body">
                {loading && transactions.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading transactions...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <Database size={48} className="mb-3 text-muted" />
                    <p>No transactions yet. Add your first transaction above.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>Txn ID</th>
                          <th>Trade ID</th>
                          <th>Ver</th>
                          <th>Security</th>
                          <th className="text-end">Quantity</th>
                          <th className="text-center">Action</th>
                          <th className="text-center">Buy/Sell</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn) => (
                          <tr key={txn.transactionId}>
                            <td className="fw-bold">{txn.transactionId}</td>
                            <td>{txn.tradeId}</td>
                            <td>{txn.version}</td>
                            <td className="fw-bold">{txn.securityCode}</td>
                            <td className="text-end">{txn.quantity}</td>
                            <td className="text-center">
                              <span className={`badge ${
                                txn.action === 'INSERT' ? 'bg-success' :
                                txn.action === 'UPDATE' ? 'bg-primary' :
                                'bg-danger'
                              }`}>
                                {txn.action}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className={`badge ${
                                txn.buySell === 'Buy' ? 'bg-success' : 'bg-warning text-dark'
                              }`}>
                                {txn.buySell}
                              </span>
                            </td>
                            <td className="text-muted small">{formatDateTime(txn.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default App;