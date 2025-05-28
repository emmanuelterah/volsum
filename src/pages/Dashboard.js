import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MedicalInputForm from '../components/MedicalInputForm';
import '../styles/Dashboard.css';

function Dashboard() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    recentAnalyses: [],
    averageConfidence: 0,
    topConditions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getToken();
        const response = await fetch('http://localhost:8000/analysis', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        
        // Process the data for dashboard display
        setStats({
          totalAnalyses: data.length,
          recentAnalyses: data.slice(0, 5),
          averageConfidence: calculateAverageConfidence(data),
          topConditions: getTopConditions(data)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  const calculateAverageConfidence = (analyses) => {
    if (!analyses.length) return 0;
    const totalConfidence = analyses.reduce((sum, analysis) => {
      return sum + (analysis.entities?.confidence || 0);
    }, 0);
    return (totalConfidence / analyses.length).toFixed(1);
  };

  const getTopConditions = (analyses) => {
    const conditions = {};
    analyses.forEach(analysis => {
      const condition = analysis.entities?.predicted_condition;
      if (condition) {
        conditions[condition] = (conditions[condition] || 0) + 1;
      }
    });
    return Object.entries(conditions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([condition, count]) => ({ condition, count }));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <MedicalInputForm />
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Welcome to VolSum AI</h1>
          <p className="dashboard-subtitle">Your medical analysis dashboard</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Analyses</h3>
              <p className="stat-value">{stats.totalAnalyses}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Average Confidence</h3>
              <p className="stat-value">{stats.averageConfidence}%</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>Recent Activity</h3>
              <p className="stat-value">{stats.recentAnalyses.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Top Condition</h3>
              <p className="stat-value">
                {stats.topConditions[0]?.condition || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-card recent-analyses">
            <h2>Recent Analyses</h2>
            <div className="analyses-list">
              {stats.recentAnalyses.map((analysis, index) => (
                <div key={index} className="analysis-item">
                  <div className="analysis-header">
                    <span className="analysis-date">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                    <span className={`analysis-severity ${analysis.entities?.severity}`}>
                      {analysis.entities?.severity || 'Unknown'}
                    </span>
                  </div>
                  <p className="analysis-text">{analysis.record_text.substring(0, 100)}...</p>
                  <div className="analysis-footer">
                    <span className="analysis-condition">
                      {analysis.entities?.predicted_condition || 'Unknown'}
                    </span>
                    <span className="analysis-confidence">
                      Confidence: {analysis.entities?.confidence || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-card top-conditions">
            <h2>Top Conditions</h2>
            <div className="conditions-list">
              {stats.topConditions.map((item, index) => (
                <div key={index} className="condition-item">
                  <div className="condition-info">
                    <span className="condition-name">{item.condition}</span>
                    <span className="condition-count">{item.count} cases</span>
                  </div>
                  <div className="condition-bar">
                    <div 
                      className="condition-progress"
                      style={{ width: `${(item.count / stats.totalAnalyses) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 