import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || "http://10.20.30.2:8000";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLogin, setIsLogin] = useState(true);
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // File state
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password };
        
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Auth failed');
      
      if (isLogin) {
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
      } else {
        alert("Registration successful, please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setFiles([]);
  };

  const fetchFiles = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/files/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileToUpload) return;
    
    const formData = new FormData();
    formData.append('upload', fileToUpload);
    
    try {
      const res = await fetch(`${API_URL}/files/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        setFileToUpload(null);
        document.getElementById('file-upload-input').value = '';
        fetchFiles();
      } else {
        const data = await res.json();
        alert(data.detail || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const res = await fetch(`${API_URL}/files/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Download failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const res = await fetch(`${API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchFiles();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="container center-container">
        <div className="auth-box">
          <h1>NAS Drive</h1>
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleAuth} className="auth-form">
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            )}
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </form>
          <button className="link-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>NAS Drive</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>
      
      <main className="main-content">
        <section className="card upload-section">
          <h3>Upload a File</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <input 
              id="file-upload-input"
              type="file" 
              onChange={e => setFileToUpload(e.target.files[0])} 
              required 
            />
            <button type="submit" disabled={!fileToUpload}>Upload</button>
          </form>
        </section>

        <section className="card files-section">
          <h3>My Files</h3>
          {files.length === 0 ? (
             <div className="empty-state">No files uploaded yet.</div>
          ) : (
            <ul className="file-list">
              {files.map(f => (
                <li key={f.id} className="file-item">
                  <div className="file-info">
                    <span className="filename">{f.filename}</span>
                    <span className="filesize">{(f.size_bytes / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="file-actions">
                    <button onClick={() => handleDownload(f.id, f.filename)} className="download-btn">Download</button>
                    <button onClick={() => handleDelete(f.id)} className="delete-btn">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
