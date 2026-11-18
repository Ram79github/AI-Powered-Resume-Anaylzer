import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { EmptyState, ErrorState, LoadingState } from '../components/States.jsx';

export default function History() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const history = useQuery({
    queryKey: ['history', page],
    queryFn: () => api(`/api/history?page=${page}&limit=10`),
  });
  const remove = useMutation({
    mutationFn: (id) => api(`/api/history/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['history'] }),
  });

  return (
    <section className="page-container history-page">
      <div className="page-title-row">
        <div><p className="eyebrow">YOUR WORKSPACE</p><h1>Analysis history</h1><p className="muted">Reports you have created, all in one place.</p></div>
        <Link className="button button-primary" to="/">New analysis <span aria-hidden="true">→</span></Link>
      </div>
      {history.isPending && <LoadingState label="Loading your reports…" />}
      {history.error && <ErrorState message={history.error.message} />}
      {history.data && history.data.data.length === 0 && (
        <EmptyState>You haven't created any reports yet. <Link to="/">Analyze your first resume</Link>.</EmptyState>
      )}
      {history.data?.data.length > 0 && (
        <>
          <div className="history-list">
            {history.data.data.map((report) => (
              <article className="history-item" key={report._id}>
                <div className="history-score" aria-label={`${report.score} out of 100`}>{report.score}</div>
                <div className="history-info">
                  <Link to={`/reports/${report._id}`}><h2>{report.jobTitle}</h2></Link>
                  <p>{report.resumeName} <span aria-hidden="true">·</span> {new Date(report.createdAt).toLocaleDateString()}</p>
                  <p className="muted">{report.matchedKeywords.length} matched <span aria-hidden="true">·</span> {report.missingKeywords.length} to address</p>
                </div>
                <button className="button button-quiet delete-button" type="button" disabled={remove.isPending} onClick={() => {
                  if (window.confirm(`Delete the report for "${report.jobTitle}"? This cannot be undone.`)) remove.mutate(report._id);
                }}>Delete</button>
              </article>
            ))}
          </div>
          {history.data.pagination.pages > 1 && (
            <nav className="pagination" aria-label="History pages">
              <button className="button button-secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
              <span>Page {page} of {history.data.pagination.pages}</span>
              <button className="button button-secondary" disabled={page >= history.data.pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button>
            </nav>
          )}
        </>
      )}
      {remove.error && <ErrorState message={remove.error.message} />}
    </section>
  );
}
