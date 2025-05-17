import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleClick = async () => {
    if (isAuthenticated) {
      await logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 50 }}>
      <Button
        variant="outline"
        className="bg-white/80 hover:bg-white text-medblue-700 border-medblue-200 shadow"
        onClick={handleClick}
        title={isAuthenticated ? 'Sair' : 'Entrar'}
      >
        {isAuthenticated ? (
          <><UserRound className="mr-2 h-4 w-4" /> Sair</>
        ) : (
          <><LogIn className="mr-2 h-4 w-4" /> Login</>
        )}
      </Button>
    </div>
  );
};

export default LoginButton; 