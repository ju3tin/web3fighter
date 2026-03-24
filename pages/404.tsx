import Link from 'next/link';
import { useEffect } from 'react';

export default function Custom404() {
  useEffect(() => {
    // remove margin
    document.body.style.margin = '0';

    // optional: cleanup when leaving page
    return () => {
      document.body.style.margin = '';
    };
  }, []);

export default function Custom404() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>404</h1>
      <p style={{ marginTop: '1rem', color: '#aaa' }}>
        This page could not be found dude.
      </p>

      <Link href="/" style={{
        marginTop: '1.5rem',
        padding: '0.75rem 1.5rem',
        background: '#fff',
        color: '#000',
        borderRadius: '1rem'
      }}>
        Go Home
      </Link>
    </div>
  );
}
