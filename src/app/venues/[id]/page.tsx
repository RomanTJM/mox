'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Venue } from '../../../types';
import Link from 'next/link';
import { generateVenuePDF } from '../../../utils/pdf';
import { useParams, useRouter } from 'next/navigation';
import './venue-detail.css';

export default function VenueDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminOrOwner, setIsAdminOrOwner] = useState(false);
  const router = useRouter();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const fetchVenue = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setVenue(data);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAdminOrOwner = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setIsAdminOrOwner(false);
    if (venue && venue.owner_user_id === user.id) return setIsAdminOrOwner(true);
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    setIsAdminOrOwner(data?.role === 'admin');
  }, [venue]);

  useEffect(() => {
    fetchVenue();
    checkAdminOrOwner();
    fetchUserRole();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [id, fetchVenue, checkAdminOrOwner]);

  const fetchUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setUserRole(null);
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    setUserRole(data?.role || null);
  };

  const handleDeleteVenue = async () => {
    if (!confirm('Вы уверены, что хотите удалить площадку?')) return;
    try {
      const { error } = await supabase.from('venues').delete().eq('id', id);
      if (error) {
        setError(error.message);
      } else {
        router.push('/venues');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    }
  };

  const handleDownloadPDF = async () => {
    if (!venue) return;

    try {
      const pdfBytes = await generateVenuePDF(venue);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${venue.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Ошибка генерации PDF
    }
  };

  const handleBookWithStripe = async () => {
    if (!venue) return;
    setBookingLoading(true);
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: venue.id,
          venueName: venue.name,
          price: venue.price,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Ошибка создания платежа: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      alert('Ошибка бронирования');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-center">Загрузка...</div>;
  if (error) return <div className="text-error text-center">{error}</div>;
  if (!venue) return <div className="text-center">Площадка не найдена</div>;

  return (
    <div className="venue-detail">
      <main className="venue-detail-main">
        <div className="venue-detail-back">
          <Link href="/venues" className="nav-link">
            ← Назад к списку площадок
          </Link>
        </div>
        <div className="venue-detail-card card">
          {venue.image_url && (
            <div className="venue-detail-img-wrap">
              <img
                src={venue.image_url}
                alt={venue.name}
                className="venue-detail-img"
              />
            </div>
          )}
          <div className="venue-detail-header">
            <h3 className="venue-detail-title">{venue.name}</h3>
            <p className="venue-detail-desc">Детальная информация о площадке</p>
          </div>
          <div className="venue-detail-info">
            <div className="venue-detail-row">
              <span className="venue-detail-label">Адрес</span>
              <span className="venue-detail-value">{venue.address}</span>
            </div>
            <div className="venue-detail-row">
              <span className="venue-detail-label">Вместимость</span>
              <span className="venue-detail-value">{venue.capacity} человек</span>
            </div>
            <div className="venue-detail-row">
              <span className="venue-detail-label">Цена</span>
              <span className="venue-detail-value">{venue.price / 100} ₽</span>
            </div>
          </div>
          <div className="venue-detail-btns">
            <button
              onClick={handleDownloadPDF}
              className="btn btn-primary"
            >
              Скачать PDF
            </button>
            {user && userRole === 'user' ? (
              <button
                onClick={handleBookWithStripe}
                className="btn btn-success"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Перенаправление...' : 'Забронировать с оплатой'}
              </button>
            ) : (
              <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '1rem' }}>
                Для бронирования и оплаты необходимо <a href="/auth" className="nav-link">войти в систему</a>
              </div>
            )}
            {user && isAdminOrOwner && (
              <button
                onClick={handleDeleteVenue}
                className="btn btn-danger"
              >
                Удалить площадку
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 