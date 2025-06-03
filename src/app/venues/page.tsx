'use client';

import { useEffect, useState } from 'react';
import VenueList from '../../components/VenueList';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import './venues.css';

export default function VenuesPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        setIsAdmin(data?.role === 'admin');
      }
    }
    checkRole();
  }, []);

  return (
    <main className="venues-main">
      <div>
        <div className="venues-header">
          <h1 className="venues-title">Площадки</h1>
          {isAdmin && (
            <button
              onClick={() => router.push('/venues/create')}
              className="btn btn-primary"
            >
              Создать площадку
            </button>
          )}
        </div>
        <VenueList />
      </div>
    </main>
  );
} 