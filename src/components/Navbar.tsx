import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          {t('app.name')}
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/hotels">
            <Button variant="ghost" size="sm">{t('nav.hotels')}</Button>
          </Link>

          {user && (
            <Link to="/bookings">
              <Button variant="ghost" size="sm">{t('nav.bookings')}</Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
          >
            <Globe className="h-4 w-4 mr-1" />
            {language === 'en' ? '🇳🇵 नेपाली' : '🇬🇧 English'}
          </Button>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    {t('nav.admin')}
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">{t('nav.register')}</Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-1" />
                  {t('nav.admin')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
