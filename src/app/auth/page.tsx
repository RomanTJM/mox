'use client';

import Auth from '../../components/Auth';

export default function AuthPage() {
  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">
            Вход в систему
          </h2>
          <p className="auth-desc">
            Войдите в систему, чтобы управлять своими площадками
          </p>
        </div>
        <Auth />
      </div>
    </div>
  );
} 
