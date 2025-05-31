import { useState } from 'react';
import ScenarioCard from '../components/ScenarioCard';
import './Generator.css';

const Generator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    count: 3,
    difficulty: 'intermediate',
    format: 'long',
    language: 'English'
  });
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/scenarios/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setScenarios(data.scenarios);
      
      // Add to history
      setHistory(prev => [{
        ...formData,
        date: new Date().toLocaleString(),
        count: data.scenarios.length
      }, ...prev.slice(0, 9)]);
      
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setFormData({
      topic: item.topic,
      count: item.count,
      difficulty: item.difficulty,
      format: item.format,
      language: item.language
    });
  };

  return (
    <div className="generator-container">
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="topic">Medical Topic</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., acute pancreatitis, heart failure"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="count">Number of Scenarios</label>
              <select
                id="count"
                name="count"
                value={formData.count}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="basic">Basic (MS1-2)</option>
                <option value="intermediate">Intermediate (MS3)</option>
                <option value="advanced">Advanced (MS4/Resident)</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="format">Format</label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
              >
                <option value="long">Detailed Narrative</option>
                <option value="short">Concise Bullet Points</option>
                <option value="sba">Single Best Answer</option>
                <option value="osce">OSCE Station</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Scenarios'}
          </button>
        </form>
        
        {history.length > 0 && (
          <div className="history-section">
            <h4>Recent Searches</h4>
            <ul>
              {history.map((item, index) => (
                <li key={index} onClick={() => loadFromHistory(item)}>
                  <span className="topic">{item.topic}</span>
                  <span className="meta">
                    {item.count} scenario{item.count > 1 ? 's' : ''} • {item.difficulty} • {item.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="results-section">
        {loading && (
          <div className="loading">
            <img src="/assets/loading.gif" alt="Loading..." />
            <p>Generating clinical scenarios...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        {!loading && !error && scenarios.length > 0 && (
          <>
            <div className="results-header">
              <h2>Generated Scenarios for: {formData.topic}</h2>
              <div className="result-meta">
                <span>Difficulty: {formData.difficulty}</span>
                <span>Format: {formData.format}</span>
                <button onClick={() => window.print()}>Print Scenarios</button>
              </div>
            </div>
            
            <div className="scenarios-list">
              {scenarios.map((scenario, index) => (
                <ScenarioCard 
                  key={index} 
                  scenario={scenario} 
                  format={formData.format} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Generator;