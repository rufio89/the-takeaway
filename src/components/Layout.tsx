import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Headphones, Settings, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  The Takeaway
                </h1>
                <p className="text-sm text-gray-600">High-signal podcast insights for busy entrepreneurs</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-semibold">Admin</span>
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-semibold">Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg transition-all shadow-md"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="text-sm font-semibold">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-1.5 bg-primary-100 rounded-lg">
              <Headphones className="w-4 h-4 text-primary-600" />
            </div>
            <span className="font-semibold text-gray-900">The Takeaway</span>
          </div>
          <p className="text-center text-gray-600 text-sm">
            Curated podcast digests for actionable insights
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            © 2025 The Takeaway. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
