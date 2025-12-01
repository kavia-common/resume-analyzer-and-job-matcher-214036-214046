import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * History: Lists prior analysis tasks for quick access.
 */
function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.getHistory().then((res) => {
      if (!mounted) return;
      setItems(res?.items || []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <Card title="History" subtitle="Your recent analyses">
      <div className="grid">
        {items.length === 0 && <p className="subtitle">No history found.</p>}
        {items.map((it) => (
          <div className="card" key={it.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <div>
                <strong>{it.type === 'url' ? 'Profile URL' : 'Resume'}</strong>
                <p className="subtitle" style={{ margin: 0 }}>{it.created_at}</p>
              </div>
              <a className="btn" href={`/results/${encodeURIComponent(it.id)}`}>View</a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default History;
