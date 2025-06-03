'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Вы вышли из аккаунта!');
      setIsLoggedIn(false);
      router.push('/');
    }
  };

  const handleSignIn = () => {
    router.push('/auth');
  };

  return isLoggedIn ? (
    <button
      onClick={handleSignOut}
      className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
    >
      Выйти
    </button>
  ) : (
    <button
      onClick={handleSignIn}
      className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    >
      Войти
    </button>
  );
} 