import React, { useState, useEffect } from 'react';

export function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchArticles = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', { signal: controller.signal });
        if (!res.ok) throw new Error('Помилка завантаження статей');
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchArticles();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="status-msg">Завантаження статей...</div>;
  if (error) return <div className="status-msg status-msg--error">Помилка: {error}</div>;

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">01 / Список статей (useEffect)</h2>
      <div className="article-grid">
        {articles.map(a => (
          <div key={a.id} className="article-card">
            <h3>{a.title}</h3>
            <p>{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
