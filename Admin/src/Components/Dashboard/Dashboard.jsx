import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Get admin data from localStorage
    const adminDataStr = localStorage.getItem('admin-data');
    if (adminDataStr) {
      setAdminData(JSON.parse(adminDataStr));
    }

    // Fetch dashboard stats
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsResponse, usersResponse] = await Promise.all([
        fetch('http://localhost:4000/allproducts'),
        fetch('http://localhost:4000/allusers') // You'll need to create this endpoint
      ]);

      if (productsResponse.ok) {
        const products = await productsResponse.json();
        setStats(prev => ({ ...prev, totalProducts: products.length }));
      }

      // For now, we'll set some default values
      setStats(prev => ({ 
        ...prev, 
        totalUsers: 150, // Mock data
        totalOrders: 45  // Mock data
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-data');
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {adminData?.username || 'Admin'}!</h1>
          <p>Here's what's happening with your store today.</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Registered Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>$12,450</h3>
            <p>Revenue (This Month)</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card">
            <h3>Add New Product</h3>
            <p>Create a new product listing</p>
            <button onClick={() => window.location.href = '/admin/addproduct'}>
              Add Product
            </button>
          </div>

          <div className="action-card">
            <h3>Manage Products</h3>
            <p>View and edit existing products</p>
            <button onClick={() => window.location.href = '/admin/listproduct'}>
              View Products
            </button>
          </div>

          <div className="action-card">
            <h3>View Analytics</h3>
            <p>Check sales and performance data</p>
            <button disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 