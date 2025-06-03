import './globals.css';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import LogoutButton from '../components/LogoutButton';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Toaster position="top-right" />
        <nav className="header">
          <div className="header-content">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="header-title">
                  Booking Service
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </nav>
        <div className="main-container">
          {children}
        </div>
      </body>
    </html>
  );
}