import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';

export function CrudDemo() {
  const [title, setTitle] = useState('');
  
  // GET запит
  const { data, loading, error, refetch } = useApi('https://jsonplaceholder.typicode.com/posts?_limit=3');
  
  // Стан для POST запиту
  const [postResult, setPostResult] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ title, body: 'test', userId: 1 }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      const json = await res.json();
      setPostResult(json);
      setTitle('');
      refetch(); // Оновлюємо список
    } catch (err) {
      alert('Помилка створення: ' + err.message);
    }
  };

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">05 / CRUD Demo (Custom Hook)</h2>
      
      <form onSubmit={handleCreate} className="lab-controls" style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          className="lab-input" 
          placeholder="Новий пост..." 
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button type="submit" className="btn">Створити (POST)</button>
      </form>

      {postResult && (
        <div className="status-msg status-msg--success">
          Створено: {postResult.title} (ID: {postResult.id})
        </div>
      )}

      {loading && <div className="status-msg">Завантаження через useApi...</div>}
      {error && <div className="status-msg status-msg--error">{error}</div>}
      
      {!loading && data && (
        <ul className="comment-list">
          {data.map(post => (
            <li key={post.id}>
              <strong>{post.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
