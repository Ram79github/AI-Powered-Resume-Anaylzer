import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { ErrorState } from '../components/States.jsx';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});
const registerSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(80),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(10, 'Use at least 10 characters').max(72)
    .refine((password) => new TextEncoder().encode(password).length <= 72, 'Password must be no more than 72 bytes'),
});

export default function Auth({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const schema = mode === 'login' ? loginSchema : registerSchema;
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '' } });
  const mutation = useMutation({
    mutationFn: (data) => api(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: data }),
    onSuccess: (result) => {
      queryClient.setQueryData(['me'], result);
      navigate('/');
    },
  });

  function switchMode(nextMode) {
    setMode(nextMode);
    mutation.reset();
    form.reset();
  }

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <Link to="/" className="brand"><span className="brand-mark">R</span><span>resume<span className="brand-accent">lens</span></span></Link>
        <p className="eyebrow">A clearer path to your next role</p>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="muted">Compare your experience to the roles you want.</p>
        <div className="auth-switch" aria-label="Account options">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => switchMode('login')}>Sign in</button>
          <button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => switchMode('register')}>Create account</button>
        </div>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} noValidate>
          {mode === 'register' && (
            <label className="field">
              <span>Your name</span>
              <input autoComplete="name" {...form.register('name')} aria-invalid={Boolean(form.formState.errors.name)} />
              {form.formState.errors.name && <small role="alert">{form.formState.errors.name.message}</small>}
            </label>
          )}
          <label className="field">
            <span>Email address</span>
            <input type="email" autoComplete="email" {...form.register('email')} aria-invalid={Boolean(form.formState.errors.email)} />
            {form.formState.errors.email && <small role="alert">{form.formState.errors.email.message}</small>}
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} {...form.register('password')} aria-invalid={Boolean(form.formState.errors.password)} />
            {form.formState.errors.password && <small role="alert">{form.formState.errors.password.message}</small>}
          </label>
          {mutation.error && <ErrorState message={mutation.error.message} />}
          <button className="button button-primary button-full" disabled={mutation.isPending} type="submit">
            {mutation.isPending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}
