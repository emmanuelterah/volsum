import React from 'react';
import '../styles/Analysis.css';

function Analysis({ analysisData }) {
  if (!analysisData) return null;

  return (
    <div className="analysis">
      <div className="analysis-card">
        <div className="analysis-header">
          <h2 className="analysis-title">Analysis Results</h2>
          <p className="analysis-subtitle">AI-powered diagnostic analysis</p>
        </div>

        <div className="analysis-content">
          <div className="alert">
            <div className="alert-content">
              <div className="alert-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="alert-text">
                <h3 className="alert-title">High Probability of Misdiagnosis</h3>
                <p className="alert-description">
                  There is an {analysisData.mismatchProbability}% chance that the current diagnosis may be incorrect.
                </p>
              </div>
            </div>
          </div>

          <div className="diagnosis-section">
            <div className="diagnosis-header">
              <h3>Suggested Diagnosis</h3>
            </div>
            <div className="diagnosis-content">
              <div className="diagnosis-info">
                <h4 className="diagnosis-name">{analysisData.suggestedDiagnosis}</h4>
                <div className="diagnosis-confidence">
                  {analysisData.confidence}% Confidence
                </div>
              </div>
              <div className="diagnosis-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="symptoms-section">
            <div className="symptoms-header">
              <h3>Identified Symptoms</h3>
            </div>
            <div className="symptoms-grid">
              {analysisData.symptoms && analysisData.symptoms.map((symptom, index) => (
                <div key={index} className="symptom-item">
                  <div className="symptom-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="symptom-text">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="research-section">
            <div className="research-header">
              <h3>Research Support</h3>
            </div>
            <p className="research-text">{analysisData.research?.description}</p>
            
            <div className="citations-header">
              <h4>Supporting Literature</h4>
            </div>
            <div className="citations-list">
              {analysisData.research?.citations && analysisData.research.citations.map((citation, index) => (
                <div key={index} className="citation-item">
                  <div className="citation-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="citation-content">
                    <div className="citation-title">{citation.title}</div>
                    <div className="citation-meta">
                      {citation.authors} • {citation.journal} • {citation.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis; 