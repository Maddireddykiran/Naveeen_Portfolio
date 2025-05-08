'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      if (pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/check', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          window.location.href = '/admin/login';
        }
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/admin/login';
      }
    }

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-5">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className={`block px-5 py-3 ${
                  pathname === '/admin/dashboard'
                    ? 'bg-indigo-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/edit/hero"
                className={`block px-5 py-3 ${
                  pathname === '/admin/edit/hero'
                    ? 'bg-indigo-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                Hero Section
              </Link>
            </li>
            <li>
              <Link
                href="/admin/edit/projects"
                className={`block px-5 py-3 ${
                  pathname === '/admin/edit/projects'
                    ? 'bg-indigo-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/admin/edit/testimonials"
                className={`block px-5 py-3 ${
                  pathname === '/admin/edit/testimonials'
                    ? 'bg-indigo-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full px-5 py-3 text-left hover:bg-gray-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 bg-gray-100 p-6">
        {children}
      </div>
    </div>
  );
} 