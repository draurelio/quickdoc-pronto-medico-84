
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, ChevronLeft, Trash2, Eye, LogIn, UserRound, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { formatDate } from '@/utils/formatUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateDocxFromTemplate } from '@/utils/documentTemplate';
import { useAuth } from '@/hooks/useAuth';

interface Prescription {
  id: string;
  patient_name: string;
  patient_age: string;
  diagnosis: string;
  admission_date: string;
  created_at: string;
  patient_data: any;
  prescription_data: any;
  medical_data: any;
  user_id: string;
}

const PrescriptionHistory = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPrescriptions();
    }
  }, [isAuthenticated]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      // Buscar todas as prescrições (compartilhadas entre usuários)
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Erro ao buscar prescrições:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de prescrições.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrescription = async (id: string, prescriptionUserId: string) => {
    try {
      // Verificar se o usuário atual é o criador da prescrição
      if (user?.id !== prescriptionUserId) {
        toast({
          title: "Permissão negada",
          description: "Você só pode excluir suas próprias prescrições.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setPrescriptions(prescriptions.filter(p => p.id !== id));
      toast({
        title: "Prescrição excluída",
        description: "A prescrição foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir prescrição:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a prescrição.",
        variant: "destructive",
      });
    }
  };

  const handleRegeneratePrescription = async (prescription: Prescription) => {
    try {
      await generateDocxFromTemplate({
        patient: prescription.patient_data,
        prescriptions: prescription.prescription_data,
        medical: prescription.medical_data
      });
      
      toast({
        title: "Sucesso!",
        description: "Documento DOCX gerado com sucesso. O download iniciará automaticamente.",
      });
    } catch (error) {
      console.error("Erro ao gerar documento DOCX:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o documento DOCX.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-8 px-4">
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-medblue-100 to-medblue-50">
            <CardTitle className="text-xl text-medblue-800">Histórico de Prescrições</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center py-8 flex flex-col items-center gap-4">
              <Lock size={48} className="text-gray-400" />
              <p className="text-muted-foreground">É necessário fazer login para acessar o histórico de prescrições.</p>
              <Button 
                onClick={() => navigate('/login')} 
                className="mt-2"
              >
                <LogIn className="mr-2 h-4 w-4" /> Fazer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-medblue-100 to-medblue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-medblue-800">Histórico de Prescrições (Compartilhado)</CardTitle>
              <CardDescription>
                Visualize e gerencie todas as prescrições compartilhadas
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue-600"></div>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma prescrição encontrada no histórico compartilhado.</p>
              <Button 
                onClick={() => navigate('/')} 
                className="mt-4"
              >
                Criar Nova Prescrição
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Paciente</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Data de Admissão</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Criado por</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{prescription.patient_name}</TableCell>
                      <TableCell>{prescription.patient_age}</TableCell>
                      <TableCell>{prescription.diagnosis || "Não informado"}</TableCell>
                      <TableCell>{prescription.admission_date ? formatDate(prescription.admission_date) : "Não informado"}</TableCell>
                      <TableCell>{new Date(prescription.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <UserRound size={14} className="text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {prescription.user_id === user?.id ? 'Você' : 'Outro usuário'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRegeneratePrescription(prescription)}
                            title="Visualizar Prescrição"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRegeneratePrescription(prescription)}
                            title="Gerar Documento"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          {prescription.user_id === user?.id && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeletePrescription(prescription.id, prescription.user_id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              title="Excluir Prescrição"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionHistory;
