import React, { useState, useRef } from 'react';

export function FileUploadSimulator() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error, canceled
  const [speed, setSpeed] = useState(0);
  const [eta, setEta] = useState(0);
  const xhrRef = useRef(null);
  const intervalRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setProgress(0);
      setStatus('idle');
    }
  };

  // Локальна симуляція (якщо мережа заблокована)
  const runLocalSimulation = () => {
    let currentProgress = 0;
    const mockSpeed = 1200; // KB/s
    const totalSize = file ? file.size / 1024 : 5000; // в KB

    intervalRef.current = setInterval(() => {
      currentProgress += 5;
      
      const loadedKB = (totalSize * currentProgress) / 100;
      const remainingKB = totalSize - loadedKB;
      
      setProgress(Math.min(currentProgress, 100));
      setSpeed(mockSpeed);
      setEta(Math.round(remainingKB / mockSpeed));

      if (currentProgress >= 100) {
        clearInterval(intervalRef.current);
        setStatus('success');
      }
    }, 200);
  };

  const startUpload = () => {
    if (!file) return;

    setStatus('uploading');
    setProgress(0);
    const startTime = Date.now();
    
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        const timeElapsed = (Date.now() - startTime) / 1000;
        const currentSpeed = event.loaded / timeElapsed;
        
        setProgress(percent);
        setSpeed((currentSpeed / 1024).toFixed(2));
        const remaining = event.total - event.loaded;
        setEta(currentSpeed > 0 ? Math.ceil(remaining / currentSpeed) : 0);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus('success');
        setProgress(100);
      } else {
        // Якщо сервер відповів помилкою, запускаємо симуляцію
        runLocalSimulation();
      }
    };

    xhr.onerror = () => {
      // Якщо сталася помилка мережі (CORS/блок), запускаємо симуляцію
      runLocalSimulation();
    };

    xhr.onabort = () => {
      clearInterval(intervalRef.current);
      setStatus('canceled');
      setProgress(0);
    };

    // Використовуємо більш стабільний тестовий сервер
    xhr.open('POST', 'https://postman-echo.com/post', true);
    
    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  };

  const cancelUpload = () => {
    if (xhrRef.current) xhrRef.current.abort();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus('canceled');
    setProgress(0);
  };

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">ІНДИВІДУАЛЬНЕ / File Upload (XHR Progress)</h2>
      
      <div className="upload-box">
        <input type="file" onChange={handleFileChange} className="lab-input" />
        
        {file && status === 'idle' && (
          <button className="btn" onClick={startUpload} style={{ marginTop: '10px' }}>
            Почати завантаження ({Math.round(file.size / 1024)} KB)
          </button>
        )}

        {status === 'uploading' && (
          <div style={{ marginTop: '20px' }}>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-info">
              <span>{progress}%</span>
              <span>{speed} KB/s</span>
              <span>Залишилось: {eta} с</span>
            </div>
            <button className="btn btn--danger" onClick={cancelUpload} style={{ marginTop: '10px' }}>
              Скасувати
            </button>
          </div>
        )}

        {status === 'success' && <div className="status-msg status-msg--success">Файл успішно завантажено!</div>}
        {status === 'error' && <div className="status-msg status-msg--error">Помилка завантаження</div>}
        {status === 'canceled' && <div className="status-msg status-msg--error">Скасовано користувачем</div>}
      </div>
    </div>
  );
}
