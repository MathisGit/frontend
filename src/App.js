import React, { useState } from 'react';
import './App.css';

function App() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setJsonData(null);

    try {
      const response = await fetch('/analyze_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: pdfUrl }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse du PDF");
      }

      const data = await response.json();
      setJsonData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'result.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <img src="banner.png" alt="pdf" className='banner'/>
    <div className="container">
    <div className="first">
      <h1>1. Renseignez l'url</h1>
      <input
        type="text"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
        placeholder="Entrez l'URL du PDF"
        className="input"
      />
      <button onClick={handleAnalyze} disabled={loading} className="go-button">
        {loading ? 'Analyse en cours...' : 'GO'}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
    <div className="second">
      <h1>2. Télécharger le JSON</h1>
      <button onClick={handleDownload} disabled={!jsonData} className="download-button">
        <span role="img" aria-label="download">⬇️</span>
      </button>
      </div>
    </div>
    </div>
  );
}

export default App;
