import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import ReportView from '../components/ReportView.jsx';
import { ErrorState } from '../components/States.jsx';
import { api } from '../lib/api.js';

const schema = z.object({
  jobTitle: z.string().max(120).optional(),
  jobDescription: z.string().trim().min(50, 'Paste at least 50 characters of the job description').max(20000),
  resumeText: z.string().optional(),
});

export default function Home() {
  const [mode, setMode] = useState('text');
  const [file, setFile] = useState(null);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { jobTitle: '', jobDescription: '', resumeText: '' } });
  const mutation = useMutation({
    mutationFn: (values) => {
      if (mode === 'pdf') {
        const body = new FormData();
        body.append('resume', file);
        body.append('jobTitle', values.jobTitle || 'Target role');
        body.append('jobDescription', values.jobDescription);
        return api('/api/analyze', { method: 'POST', body });
      }
      return api('/api/analyze/text', { method: 'POST', body: values });
    },
  });

  const resumeError = mode === 'text' && form.formState.isSubmitted && !form.getValues('resumeText')?.trim()
    ? 'Paste your resume text to continue'
    : null;

  return (
    <div className="page-container">
      <section className="hero">
        <p className="eyebrow"><span className="status-dot" /> CAREER TOOLKIT / 01</p>
        <h1>Make your next move<br /><span>with confidence.</span></h1>
        <p>See how your resume lines up with the role you want. Get clear, practical feedback—before you apply.</p>
      </section>
      <section className="analyzer-layout" aria-label="Resume analyzer">
        <form className="analysis-form panel" onSubmit={form.handleSubmit((values) => {
          mutation.reset();
          if (mode === 'pdf' && !file) return;
          if (mode === 'text' && !values.resumeText?.trim()) return;
          mutation.mutate(values);
        })}>
          <div className="section-heading"><span className="step-number">01</span><div><h2>Build your match report</h2><p>Start with your resume and the job description.</p></div></div>
          <label className="field">
            <span>Target job title <span className="optional">Optional</span></span>
            <input placeholder="e.g. Product Designer" {...form.register('jobTitle')} />
          </label>
          <div className="field">
            <span id="resume-label">Your resume</span>
            <div className="mode-switch" role="group" aria-labelledby="resume-label">
              <button type="button" className={mode === 'text' ? 'active' : ''} onClick={() => { setMode('text'); mutation.reset(); }}>Paste text</button>
              <button type="button" className={mode === 'pdf' ? 'active' : ''} onClick={() => { setMode('pdf'); mutation.reset(); }}>Upload PDF</button>
            </div>
            {mode === 'text' ? (
              <textarea rows="8" placeholder="Paste the resume content you want to compare…" {...form.register('resumeText')} aria-invalid={Boolean(resumeError)} />
            ) : (
              <label className="upload-zone">
                <input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} aria-label="Choose PDF resume" />
                <span className="upload-icon" aria-hidden="true">↑</span>
                <strong>{file ? file.name : 'Choose a PDF to upload'}</strong>
                <span>PDF only · 5 MB maximum</span>
              </label>
            )}
            {resumeError && <small role="alert">{resumeError}</small>}
            {mode === 'pdf' && !file && form.formState.isSubmitted && <small role="alert">Choose a PDF resume to continue</small>}
          </div>
          <label className="field">
            <span>Job description</span>
            <textarea rows="7" placeholder="Paste the full job description for a more useful match…" {...form.register('jobDescription')} aria-invalid={Boolean(form.formState.errors.jobDescription)} />
            {form.formState.errors.jobDescription && <small role="alert">{form.formState.errors.jobDescription.message}</small>}
          </label>
          {mutation.error && <ErrorState message={mutation.error.message} />}
          <button className="button button-primary button-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Reading your resume…' : 'Analyze my resume'} <span aria-hidden="true">→</span>
          </button>
          <p className="privacy-note">Your resume is analyzed for your account and is not shared publicly.</p>
        </form>
        <aside className="guide-card">
          <p className="eyebrow">WHAT YOU'LL GET</p>
          <h2>A better application starts here.</h2>
          <ul>
            <li><span>01</span><div><strong>Match score</strong><p>A quick view of how closely your resume reflects the role.</p></div></li>
            <li><span>02</span><div><strong>Keyword gaps</strong><p>Requirements you may want to address with real experience.</p></div></li>
            <li><span>03</span><div><strong>Practical next steps</strong><p>Simple ways to make your application more specific.</p></div></li>
          </ul>
          <p className="fine-print">This score is a writing aid, not a hiring decision or guarantee.</p>
        </aside>
      </section>
      {mutation.data?.data && <ReportView report={mutation.data.data} />}
    </div>
  );
}
