
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  // Only show login button for unauthenticated users
  // (authenticated users will use the UserMenu component instead)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 50 }}>
      <Button
        variant="outline"
        className="bg-white/80 hover:bg-white text-medblue-700 border-medblue-200 shadow"
        onClick={handleClick}
        title="Entrar"
      >
        <LogIn className="mr-2 h-4 w-4" /> Login
      </Button>
    </div>
  );
};

export default LoginButton;
