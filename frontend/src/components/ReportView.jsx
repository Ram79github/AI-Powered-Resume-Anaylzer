import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ReportView({ report }) {
  const [exportError, setExportError] = useState('');

  async function handleDownload() {
    try {
      const { downloadReport } = await import('../lib/reportPdf.js');
      downloadReport(report);
      setExportError('');
    } catch {
      setExportError('The PDF report could not be created. Please try again.');
    }
  }

  return (
    <section className="report-card" aria-labelledby="report-heading">
      <div className="report-header">
        <div>
          <p className="eyebrow">YOUR ANALYSIS</p>
          <h2 id="report-heading">{report.jobTitle}</h2>
          <p className="muted">{report.resumeName}</p>
        </div>
        <div className="score" aria-label={`Match score ${report.score} out of 100`}>
          <strong>{report.score}</strong><span>/100</span>
        </div>
      </div>
      <p className="report-summary">{report.summary}</p>
      <div className="keyword-columns">
        <div>
          <h3>Matched keywords <span className="count">{report.matchedKeywords.length}</span></h3>
          {report.matchedKeywords.length
            ? <ul className="tag-list">{report.matchedKeywords.map((word) => <li key={word}>{word}</li>)}</ul>
            : <p className="muted">No matching keywords detected yet.</p>}
        </div>
        <div>
          <h3>Skills to address <span className="count">{report.missingKeywords.length}</span></h3>
          {report.missingKeywords.length
            ? <ul className="tag-list missing">{report.missingKeywords.map((word) => <li key={word}>{word}</li>)}</ul>
            : <p className="muted">All detected keywords matched.</p>}
        </div>
      </div>
      <div className="suggestions">
        <h3>Recommendations</h3>
        <ol>{report.suggestions.map((suggestion, index) => <li key={`${index}-${suggestion}`}>{suggestion}</li>)}</ol>
      </div>
      <div className="report-actions">
        <button className="button button-secondary" type="button" onClick={handleDownload}>Download PDF</button>
        <Link className="text-link" to="/">Analyze another resume <span aria-hidden="true">→</span></Link>
      </div>
      {exportError && <p className="notice notice-error" role="alert">{exportError}</p>}
    </section>
  );
}
