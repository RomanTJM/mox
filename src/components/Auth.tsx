import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { sendEmail } from '../utils/email';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import './auth.css';

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Проверяем авторизацию пользователя при монтировании компонента
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  const validateEmail = (email: string) => {
    // Только латиница, цифры, точки, дефисы, нижние подчёркивания, @ и домен
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError('Введите корректный email');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let message = error.message;
        if (message.toLowerCase().includes('unable to validate email address')) {
          message = 'Некорректный формат email';
        } else if (message.includes('Invalid login credentials')) {
          message = 'Неверный email или пароль';
        } else if (message.includes('user not found')) {
          message = 'Пользователь не найден';
        } else if (message.includes('Database error creating anonymous user')) {
          message = 'Ошибка базы данных при создании пользователя. Попробуйте позже.';
        } else if (message.includes('User already registered')) {
          message = 'Пользователь с таким email уже зарегистрирован';
        }
        setError(message);
        toast.error(message);
        return;
      }

      toast.success('Вход выполнен!');
      setIsLoggedIn(true);
      router.push('/venues');
    } catch (error: any) {
      setError('Неизвестная ошибка. Попробуйте позже.');
      toast.error('Неизвестная ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError('Введите корректный email');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setLoading(false);
      return;
    }

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        let message = error.message;
        if (message.includes('User already registered')) {
          message = 'Пользователь с таким email уже зарегистрирован';
        } else if (message.includes('Database error creating anonymous user')) {
          message = 'Ошибка базы данных при создании пользователя. Попробуйте позже.';
        }
        setError(message);
        toast.error(message);
        return;
      }
      if (role === 'admin' && data.user) {
        await fetch('/api/set-admin-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: data.user.id }),
        });
      }
      sendEmail(email, 'Добро пожаловать!', 'Вы успешно зарегистрировались на платформе бронирования.');
      setEmail('');
      setPassword('');
      setRole('user');
      setShowModal(true);
    } catch (error: any) {
      setError('Неизвестная ошибка. Попробуйте позже.');
      toast.error('Неизвестная ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Вход / Регистрация</h2>
      {!isLoggedIn && (
        <form className="">
          <div>
            <label className="auth-label">Электронная почта</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
              placeholder="Введите email"
              onInvalid={e => e.currentTarget.setCustomValidity('Пожалуйста, введите email')}
              onInput={e => e.currentTarget.setCustomValidity('')}
            />
          </div>
          <div>
            <label className="auth-label">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
              placeholder="Введите пароль"
              onInvalid={e => e.currentTarget.setCustomValidity('Пожалуйста, введите пароль')}
              onInput={e => e.currentTarget.setCustomValidity('')}
            />
          </div>
          <div>
            <label className="auth-label">Роль</label>
            <select
              className="auth-input"
              value={role}
              onChange={e => setRole(e.target.value as 'user' | 'admin')}
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <div className="auth-btn-row">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="auth-btn auth-btn-primary"
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="auth-btn auth-btn-outline"
            >
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </div>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
        </form>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <div className="modal-message">
              Для подтверждения регистрации перейдите по ссылке в письме на вашем email
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 