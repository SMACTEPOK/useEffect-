import React, { useState, useEffect } from 'react';

export function SearchPhotos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        // JSONPlaceholder не має пошуку, тому використовуємо фільтр по albumId
        const res = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${term}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Помилка пошуку');
        const data = await res.json();
        setPhotos(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 500); // Debounce 500ms

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchTerm]);

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">03 / Пошук фото (Debounce)</h2>
      <input 
        type="number" 
        className="lab-input" 
        placeholder="Введіть Album ID (1-100)..." 
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', marginBottom: '20px' }}
      />

      {loading && <div className="status-msg">Пошук...</div>}
      {error && <div className="status-msg status-msg--error">{error}</div>}
      {!loading && !error && searchTerm && photos.length === 0 && (
        <div className="status-msg">Нічого не знайдено</div>
      )}

      <div className="photo-grid">
        {photos.slice(0, 6).map(p => (
          <div key={p.id} className="photo-item">
            <img src={p.thumbnailUrl} alt={p.title} />
            <p>{p.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
