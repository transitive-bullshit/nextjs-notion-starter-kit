import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Redirect to the originally requested page or homepage
        const redirectUrl = router.query.redirect as string || '/';
        await router.push(redirectUrl);
      } else {
        const data = await res.json();
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Basic styling for the form
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
    },
    form: {
      padding: '2rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      minWidth: '300px',
    },
    input: {
      padding: '0.5rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      padding: '0.75rem',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#0070f3',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    error: {
      color: 'red',
      marginTop: '0.5rem',
      textAlign: 'center',
    },
  };

  return (
    <>
      <Head>
        <title>Sign In - Preview</title>
      </Head>
      <div style={styles.container}>
        <h2>Preview Site Sign In</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </>
  );
}
