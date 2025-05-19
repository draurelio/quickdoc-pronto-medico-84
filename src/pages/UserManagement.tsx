
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PendingUser {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  status: string;
}

const UserManagement = () => {
  const { isAdmin, getPendingUsers, approveUser, rejectUser } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: '', action: '' });

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    fetchPendingUsers();
  }, [isAdmin, navigate]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const users = await getPendingUsers();
      setPendingUsers(users);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários pendentes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId);
      // Update the local state
      setPendingUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: 'approved' } : user
        )
      );
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setConfirmDialog({ open: false, userId: '', action: '' });
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await rejectUser(userId);
      // Update the local state
      setPendingUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: 'rejected' } : user
        )
      );
    } catch (error) {
      console.error('Error rejecting user:', error);
    } finally {
      setConfirmDialog({ open: false, userId: '', action: '' });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pendente
        </span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Aprovado
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejeitado
        </span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Aprove ou rejeite solicitações de novos usuários para o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue-600"></div>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Não há solicitações pendentes de aprovação
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data de Registro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || 'Sem nome'}</TableCell>
                    <TableCell>{user.email || user.id}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {user.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                            onClick={() => setConfirmDialog({ open: true, userId: user.id, action: 'approve' })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                            onClick={() => setConfirmDialog({ open: true, userId: user.id, action: 'reject' })}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, userId: '', action: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === 'approve'
                ? 'Você tem certeza que deseja aprovar este usuário? Ele terá acesso ao sistema.'
                : 'Você tem certeza que deseja rejeitar este usuário? Ele não poderá acessar o sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, userId: '', action: '' })}
            >
              Cancelar
            </Button>
            <Button
              variant={confirmDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={() => 
                confirmDialog.action === 'approve' 
                  ? handleApprove(confirmDialog.userId) 
                  : handleReject(confirmDialog.userId)
              }
            >
              {confirmDialog.action === 'approve' ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
