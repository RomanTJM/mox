'use client';

import CreateVenue from '../../../components/CreateVenue';
import './create-venue.css';
import Link from 'next/link';

export default function CreateVenuePage() {
  return (
    <div className="create-venue-page">
      <main className="create-venue-main">
        <div className="create-venue-back">
          <Link href="/venues" className="nav-link">
            ← Назад к списку площадок
          </Link>
        </div>
        <CreateVenue />
      </main>
    </div>
  );
} 