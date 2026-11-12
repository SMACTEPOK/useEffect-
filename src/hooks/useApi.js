import { useState, useEffect, useCallback } from 'react';

export function useApi(url, options = {}, skip = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(0);

  const fetchData = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { ...options, signal });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    if (skip) return;
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData, skip, trigger]);

  const refetch = () => setTrigger(prev => prev + 1);

  return { data, loading, error, refetch };
}
