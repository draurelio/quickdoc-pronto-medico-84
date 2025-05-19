
import React from 'react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRound, Settings, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const email = user?.email || '';
  const initials = email ? email.substring(0, 2).toUpperCase() : 'US';
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await logout();
      if (error) throw error;
      navigate('/login');
      toast({
        title: "Desconectado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao desconectar",
        description: error.message || "Não foi possível desconectar",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full p-0 w-10 h-10 flex items-center justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={email} />
              <AvatarFallback className="bg-medblue-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">Minha Conta</span>
              <span className="text-xs text-gray-500 truncate">{email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEditProfile}>
            <UserRound className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleChangePassword}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Alterar Senha</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
            <Mail className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
