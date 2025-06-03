'use client';

import Auth from '../../components/Auth';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Вход в систему
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Войдите в систему, чтобы управлять своими площадками
          </p>
        </div>
        <Auth />
      </div>
    </div>
  );
} 