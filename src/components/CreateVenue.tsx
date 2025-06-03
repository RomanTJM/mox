'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { sendEmail } from '../utils/email';
import './create-venue-form.css';

export default function CreateVenue() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
    image_url: '',
    price: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Необходима авторизация');

      const { error } = await supabase.from('venues').insert([
        {
          ...formData,
          capacity: parseInt(formData.capacity),
          price: Math.round(parseFloat(formData.price.replace(',', '.')) * 100),
          owner_user_id: user.id,
        },
      ]);

      if (error) throw error;
      if (user.email) {
        sendEmail(
          user.email,
          'Объявление добавлено на сайт',
          `Ваше объявление "${formData.name}" успешно добавлено на сайт и теперь доступно для бронирования!`
        );
      }
      router.push('/venues');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="create-venue-form">
      <h2 className="create-venue-title">Создать новую площадку</h2>

      {error && (
        <div className="create-venue-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label className="create-venue-label">Название</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="create-venue-input"
            required
            onInvalid={e => e.currentTarget.setCustomValidity('Пожалуйста, введите название площадки')}
            onInput={e => e.currentTarget.setCustomValidity('')}
          />
        </div>

        <div>
          <label className="create-venue-label">Адрес</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="create-venue-input"
            required
            onInvalid={e => e.currentTarget.setCustomValidity('Пожалуйста, введите адрес площадки')}
            onInput={e => e.currentTarget.setCustomValidity('')}
          />
        </div>

        <div>
          <label className="create-venue-label">Вместимость</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="create-venue-input"
            required
            onInvalid={e => e.currentTarget.setCustomValidity('Пожалуйста, укажите вместимость')}
            onInput={e => e.currentTarget.setCustomValidity('')}
          />
        </div>

        <div>
          <label className="create-venue-label">URL изображения</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="create-venue-input"
          />
        </div>

        <div>
          <label className="create-venue-label">Цена (₽)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="create-venue-input"
            required
            min="1"
            step="0.01"
            onInvalid={e => e.currentTarget.setCustomValidity('Пожалуйста, укажите цену')}
            onInput={e => e.currentTarget.setCustomValidity('')}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary create-venue-btn"
        >
          {loading ? 'Создание...' : 'Создать площадку'}
        </button>
      </form>
    </div>
  );
} 