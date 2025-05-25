
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, UserCog, Lock, History, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import HoverSidebar from './HoverSidebar';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-medblue-500 text-white font-semibold">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-2" align="start" sideOffset={5}>
            <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
              {user?.email}
            </div>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => handleNavigation('/index')}
              className={`cursor-pointer ${isCurrentPath('/index') ? 'bg-medblue-50 text-medblue-700' : ''}`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Prescrição
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => handleNavigation('/receita-medica')}
              className={`cursor-pointer ${isCurrentPath('/receita-medica') ? 'bg-medblue-50 text-medblue-700' : ''}`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Receita Médica
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleNavigation('/historico')}
              className={`cursor-pointer ${isCurrentPath('/historico') ? 'bg-medblue-50 text-medblue-700' : ''}`}
            >
              <History className="mr-2 h-4 w-4" />
              Histórico
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => handleNavigation('/profile')}
              className={`cursor-pointer ${isCurrentPath('/profile') ? 'bg-medblue-50 text-medblue-700' : ''}`}
            >
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleNavigation('/change-password')}
              className={`cursor-pointer ${isCurrentPath('/change-password') ? 'bg-medblue-50 text-medblue-700' : ''}`}
            >
              <Lock className="mr-2 h-4 w-4" />
              Alterar Senha
            </DropdownMenuItem>
            
            {user?.user_metadata?.role === 'admin' && (
              <DropdownMenuItem 
                onClick={() => handleNavigation('/user-management')}
                className={`cursor-pointer ${isCurrentPath('/user-management') ? 'bg-medblue-50 text-medblue-700' : ''}`}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Gerenciar Usuários
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <HoverSidebar />
    </>
  );
};

export default UserMenu;
