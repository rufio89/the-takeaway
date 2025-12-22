import { Outlet, Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link to="/" className="group">
              <h1 className="text-3xl font-serif tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors">
                The Takeaway
              </h1>
            </Link>
            <div className="flex items-center gap-6">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500 text-sm">
            © 2025 The Takeaway
          </p>
        </div>
      </footer>
    </div>
  );
}
