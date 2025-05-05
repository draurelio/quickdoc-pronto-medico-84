
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
import { FileText, ChevronLeft, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { formatDate } from '@/utils/formatUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateDocxFromTemplate } from '@/utils/documentTemplate';

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
}

const PrescriptionHistory = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar o histórico de prescrições.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      setLoading(true);
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

  const handleDeletePrescription = async (id: string) => {
    try {
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

  return (
    <div className="container py-8 px-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-medblue-100 to-medblue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-medblue-800">Histórico de Prescrições</CardTitle>
              <CardDescription>
                Visualize e gerencie todas as prescrições geradas anteriormente
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
              <p className="text-muted-foreground">Nenhuma prescrição encontrada no histórico.</p>
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
                  <TableRow className="bg-medblue-50">
                    <TableHead className="font-medium">Paciente</TableHead>
                    <TableHead className="font-medium">Idade</TableHead>
                    <TableHead className="font-medium">Diagnóstico</TableHead>
                    <TableHead className="font-medium">Data de Admissão</TableHead>
                    <TableHead className="font-medium">Data de Criação</TableHead>
                    <TableHead className="font-medium w-[180px] text-right">Ações</TableHead>
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
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeletePrescription(prescription.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Excluir Prescrição"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
