import React, { useState, useEffect } from 'react';

export function UserProfileComplete() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [userRes, postsRes, albumsRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users/1', { signal }),
          fetch('https://jsonplaceholder.typicode.com/posts?userId=1', { signal }),
          fetch('https://jsonplaceholder.typicode.com/albums?userId=1', { signal })
        ]);

        if (!userRes.ok || !postsRes.ok || !albumsRes.ok) {
          throw new Error('Один із запитів завершився помилкою');
        }

        const [user, posts, albums] = await Promise.all([
          userRes.json(), postsRes.json(), albumsRes.json()
        ]);

        setData({ user, posts, albums });
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchAll();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="status-msg">Завантаження дашборду (Promise.all)...</div>;
  if (error) return <div className="status-msg status-msg--error">{error}</div>;

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">04 / Профіль користувача (Promise.all)</h2>
      <div className="profile-stats">
        <div className="stat-box">
          <h3>{data.user.name}</h3>
          <p>{data.user.email}</p>
          <p>{data.user.phone}</p>
        </div>
        <div className="stat-box">
          <h3>Пости</h3>
          <p className="stat-number">{data.posts.length}</p>
        </div>
        <div className="stat-box">
          <h3>Альбоми</h3>
          <p className="stat-number">{data.albums.length}</p>
        </div>
      </div>
    </div>
  );
}
