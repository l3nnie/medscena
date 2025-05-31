const ScenarioCard = ({ scenario, format }) => {
  return (
    <div className="scenario">
      <h3>Scenario {scenario.id}</h3>
      
      <div className="scenario-section presentation">
        <h4>Patient Presentation</h4>
        <p>{scenario.presentation}</p>
      </div>
      
      <div className="scenario-section question">
        <h4>Question</h4>
        <p>{scenario.question}</p>
        
        {format === 'sba' && scenario.options.length > 0 && (
          <div className="options">
            {scenario.options.map((option, i) => (
              <div key={i} className="option">
                <span className="option-letter">{String.fromCharCode(65 + i)})</span>
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="scenario-section answer">
        <h4>Answer</h4>
        <div dangerouslySetInnerHTML={{ __html: formatText(scenario.answer) }} />
        
        {format === 'osce' && scenario.markingCriteria.length > 0 && (
          <div className="marking-criteria">
            <h5>Marking Criteria</h5>
            <ul>
              {scenario.markingCriteria.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const formatText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/- (.*?)(<br>|$)/g, '• $1<br>')
    .replace(/##(.*?)##/g, '<span class="highlight">$1</span>');
};

export default ScenarioCard;