import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Venue } from '../types';
import Link from 'next/link';
import './venue-list.css';

export default function VenueList() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchVenues();
    fetchUser();
  }, []);

  const fetchVenues = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let data, error;
      if (!user) {
        // Неавторизованный — видит все площадки
        ({ data, error } = await supabase
          .from('venues')
          .select('*')
          .order('created_at', { ascending: false }));
      } else {
        // Получаем роль пользователя
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        if (userData?.role === 'admin') {
          // admin — только свои
          ({ data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('owner_user_id', user.id)
            .order('created_at', { ascending: false }));
        } else {
          // user — все площадки
          ({ data, error } = await supabase
            .from('venues')
            .select('*')
            .order('created_at', { ascending: false }));
        }
      }
      if (error) throw error;
      setVenues(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      setIsAdmin(data?.role === 'admin');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить площадку?')) return;
    const { error } = await supabase.from('venues').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setVenues((prev) => prev.filter((v) => v.id !== id));
    }
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="venue-list">
      {venues.map((venue) => {
        const canDelete = isAdmin || userId === venue.owner_user_id;
        return (
          <div key={venue.id} className="venue-card card group">
            <a href={`/venues/${venue.id}`} className="venue-link">
              {venue.image_url && (
                <img
                  src={venue.image_url}
                  alt={venue.name}
                  className="venue-img"
                />
              )}
              <div className="venue-info">
                <h3 className="venue-title">{venue.name}</h3>
                <p className="venue-address">{venue.address}</p>
                <p className="venue-capacity">Вместимость: {venue.capacity} человек</p>
                <p className="venue-capacity">Цена: {venue.price / 100} ₽</p>
              </div>
            </a>
            {canDelete && (
              <button
                onClick={() => handleDelete(venue.id)}
                className="btn btn-danger venue-delete-btn"
                title="Удалить площадку"
              >
                Удалить
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
} 