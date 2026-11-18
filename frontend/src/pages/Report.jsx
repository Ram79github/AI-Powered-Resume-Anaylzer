import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import ReportView from '../components/ReportView.jsx';
import { ErrorState, LoadingState } from '../components/States.jsx';
import { api } from '../lib/api.js';

export default function Report() {
  const { id } = useParams();
  const report = useQuery({ queryKey: ['report', id], queryFn: () => api(`/api/history/${id}`) });

  return (
    <section className="page-container">
      <Link className="text-link back-link" to="/history">← Back to history</Link>
      {report.isPending && <LoadingState label="Loading report…" />}
      {report.error && <ErrorState message={report.error.message} />}
      {report.data?.data && <ReportView report={report.data.data} />}
    </section>
  );
}
