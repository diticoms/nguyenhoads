import React, { useState } from 'react';
import { Lock, User, LogIn } from 'lucide-react';
import { postData } from '../api';

export default function Login({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await postData('auth', 'login', { username, password });
      if (res.success && res.user) {
        localStorage.setItem('erp_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Sai tài khoản hoặc mật khẩu');
      }
    } catch (err: any) {
      setError(err.message || "Lỗi kết nối. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock size={30} color="white" />
          </div>
          <h2 style={{ color: 'var(--text-color)', margin: 0 }}>Đăng Nhập Hệ Thống</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Quản lý ERP Nguyễn Hồ</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tài khoản</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input 
                type="text" 
                className="form-control" 
                style={{ paddingLeft: '35px' }} 
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input 
                type="password" 
                className="form-control" 
                style={{ paddingLeft: '35px' }} 
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '8px' }}
            disabled={loading}
          >
            {loading ? "Đang xác thực..." : <><LogIn size={20} /> ĐĂNG NHẬP</>}
          </button>
        </form>
      </div>
    </div>
  );
}
