import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Language } from '../../data/content';
import { authUi } from './authUi';

interface LoginPageProps {
  lang: Language;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

interface LoginLocationState {
  from?: string;
  reason?: 'save' | 'payment';
}

type AuthMode = 'login' | 'register';

export default function LoginPage({ lang, onLogin, onRegister }: LoginPageProps) {
  const labels = authUi[lang];
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationState = location.state as LoginLocationState | null;
  const from = locationState?.from;
  const returnPath = typeof from === 'string' && /^\/(?!\/)/.test(from) && !from.includes('\\') && !Array.from(from).some((char) => char.charCodeAt(0) < 32) ? from : '/places';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if ((mode === 'register' && !normalizedName) || !normalizedEmail || !password) {
      setError(labels.requiredError);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError(labels.emailError);
      return;
    }
    if (password.length < 8) {
      setError(labels.passwordError);
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await onRegister(normalizedName, normalizedEmail, password);
      } else {
        await onLogin(normalizedEmail, password);
      }
      navigate(returnPath, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : labels.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mvp-auth-page">
      <section className="mvp-auth-intro">
        <span className="mvp-eyebrow">{labels.eyebrow}</span>
        <h1>{labels.title}</h1>
        <p>{labels.body}</p>
        {locationState?.reason === 'save' && (
          <p className="mvp-auth-notice" role="status">{labels.saveRequired}</p>
        )}
        {locationState?.reason === 'payment' && (
          <p className="mvp-auth-notice" role="status">{labels.paymentRequired}</p>
        )}
        <Link className="mvp-back-link" to="/places">← {labels.back}</Link>
      </section>

      <form className="mvp-auth-form" noValidate onSubmit={handleSubmit}>
        <div className="mvp-auth-mode" role="group" aria-label={labels.eyebrow}>
          <button className={mode === 'login' ? 'is-active' : ''} type="button" onClick={() => { setMode('login'); setError(''); }}>{labels.loginMode}</button>
          <button className={mode === 'register' ? 'is-active' : ''} type="button" onClick={() => { setMode('register'); setError(''); }}>{labels.registerMode}</button>
        </div>
        {mode === 'register' && (
          <label>
            <span>{labels.nameLabel}</span>
            <input
              autoComplete="name"
              name="name"
              placeholder={labels.namePlaceholder}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        )}
        <label>
          <span>{labels.emailLabel}</span>
          <input
            autoComplete="email"
            inputMode="email"
            name="email"
            placeholder={labels.emailPlaceholder}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          <span>{labels.passwordLabel}</span>
          <input
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            name="password"
            placeholder={labels.passwordPlaceholder}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <p className="mvp-form-error" role="alert">{error}</p>}
        <button className="mvp-primary-action" disabled={isSubmitting} type="submit">
          {isSubmitting ? labels.submitting : (mode === 'login' ? labels.submit : labels.registerSubmit)}
        </button>
        <small>{labels.privacy}</small>
      </form>
    </main>
  );
}
