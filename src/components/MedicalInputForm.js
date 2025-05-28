import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Analysis from '../pages/Analysis';
import '../styles/MedicalInputForm.css';

function MedicalInputForm() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    medical_conditions: '',
    lab_reports: '',
    symptoms: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setAnalysisResult(null);

    const record_text = `Medical Conditions: ${formData.medical_conditions}\nLab Reports: ${formData.lab_reports}\nSymptoms: ${formData.symptoms}`;

    try {
      // Step 1: Call /analyze to get analysis result
      const analyzeResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ record: record_text })
      });

      if (!analyzeResponse.ok) {
        throw new Error('Failed to analyze medical data');
      }

      const analyzeData = await analyzeResponse.json();
      setAnalysisResult(analyzeData);

      // Step 2: Call /analysis with record_text and entities (optional, for history)
      const token = getToken();
      await fetch('http://localhost:8000/analysis', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          record_text,
          entities: analyzeData
        })
      });

      setSuccess(true);
      setFormData({
        medical_conditions: '',
        lab_reports: '',
        symptoms: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-input-form">
      <h2>New Medical Analysis</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="form-error">
            <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="form-success">
            <svg className="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Analysis submitted successfully!</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="medical_conditions">Previous Medical Conditions</label>
          <textarea
            id="medical_conditions"
            name="medical_conditions"
            value={formData.medical_conditions}
            onChange={handleChange}
            placeholder="Enter any previous medical conditions, separated by commas"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lab_reports">Lab Reports</label>
          <textarea
            id="lab_reports"
            name="lab_reports"
            value={formData.lab_reports}
            onChange={handleChange}
            placeholder="Enter lab report results and findings"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="symptoms">Current Symptoms</label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe current symptoms and their duration"
            rows="3"
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <>
              <div className="button-spinner"></div>
              Analyzing...
            </>
          ) : (
            'Submit for Analysis'
          )}
        </button>
      </form>
      {analysisResult && (
        <div style={{ marginTop: '2rem' }}>
          <Analysis analysisData={analysisResult} />
        </div>
      )}
    </div>
  );
}

export default MedicalInputForm; 