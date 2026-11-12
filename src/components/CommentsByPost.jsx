import React, { useState, useEffect } from 'react';

export function CommentsByPost() {
  const [postId, setPostId] = useState(1);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;
    const controller = new AbortController();
    
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      setComments([]);
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Не вдалося завантажити коментарі');
        const data = await res.json();
        setComments(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchComments();
    return () => controller.abort();
  }, [postId]);

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">02 / Коментарі до поста</h2>
      <div className="lab-controls">
        <button className="btn" onClick={() => setPostId(id => id - 1)} disabled={postId <= 1}>Попередній</button>
        <span style={{ fontFamily: 'var(--font-mono)' }}>Пост ID: {postId}</span>
        <button className="btn" onClick={() => setPostId(id => id + 1)}>Наступний</button>
      </div>

      {loading && <div className="status-msg">Завантаження коментарів...</div>}
      {error && <div className="status-msg status-msg--error">{error}</div>}
      {!loading && !error && comments.length === 0 && <div className="status-msg">Коментарів немає</div>}
      
      {!loading && !error && (
        <ul className="comment-list">
          {comments.map(c => (
            <li key={c.id}>
              <strong>{c.email}</strong>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
