import { useEffect, useState } from 'react';
import { getHealth } from './features/health/api/get-health';
//import './App.css';

type ApiStatus = 'checking' | 'connected' | 'unavailable';

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');

  useEffect(() => {
    let isActive = true;

    async function checkApi(): Promise<void> {
      try {
        const health = await getHealth();

        if (isActive && health.status === 'ok') {
          setApiStatus('connected');
        }
      } catch {
        if (isActive) {
          setApiStatus('unavailable');
        }
      }
    }

    void checkApi();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main>
      <h1>Attention Spanner</h1>
      <p>Your routines, one task at a time.</p>

      <p>
        API status: <strong>{apiStatus}</strong>
      </p>
    </main>
  );
}

export default App;
