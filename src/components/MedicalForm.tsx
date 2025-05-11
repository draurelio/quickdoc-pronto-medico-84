
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FilePlus, Wand2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import MedicalModelsModal from './medical/MedicalModelsModal';

export interface MedicalFormData {
  admission: string;
  comorbidities: string;
  medicationReason: string;
  physicalExam: string;
  analysis: string;
  plans: string;
}

interface MedicalFormProps {
  onDataChange: (data: MedicalFormData) => void;
}

const MedicalForm: React.FC<MedicalFormProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState<MedicalFormData>({
    admission: '',
    comorbidities: '',
    medicationReason: '',
    physicalExam: '',
    analysis: '',
    plans: '',
  });

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState<keyof MedicalFormData | null>(null);
  const [isImproving, setIsImproving] = useState<keyof MedicalFormData | null>(null);

  const handleChange = (field: keyof MedicalFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onDataChange(updatedData);
  };

  const openModelModal = (field: keyof MedicalFormData) => {
    setCurrentField(field);
    setIsModelModalOpen(true);
  };

  const handleApplyModel = (field: keyof MedicalFormData, content: string) => {
    handleChange(field, content);
    setIsModelModalOpen(false);
  };

  const improveText = async (field: keyof MedicalFormData) => {
    if (!formData[field].trim()) {
      toast({
        title: "Texto vazio",
        description: "Por favor, insira algum texto para melhorar.",
        variant: "destructive",
      });
      return;
    }

    setIsImproving(field);
    
    try {
      // Simulação de melhoria de texto com IA
      // Em uma implementação real, isso seria uma chamada a uma API de IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const originalText = formData[field];
      let improvedText = originalText;
      
      // Simulação de melhorias simples no texto
      improvedText = improvedText
        .replace(/\s+/g, ' ')                          // Remove espaços duplos
        .replace(/\s+([.,;:])/g, '$1')                 // Remove espaços antes de pontuação
        .replace(/([.,;:])\s*([A-Z])/g, '$1 $2');      // Garante espaço após pontuação seguido por maiúscula
        
      // Adiciona algumas melhorias cosméticas para simular a IA
      if (field === 'admission') {
        improvedText = improvedText
          .replace(/paciente apresentou/i, 'O paciente apresentou')
          .replace(/paciente veio/i, 'O paciente chegou ao serviço')
          .replace(/dor/i, 'quadro álgico');
      } else if (field === 'analysis') {
        improvedText = improvedText
          .replace(/normotensa/i, 'com níveis tensionais adequados')
          .replace(/sem alteracoes/i, 'sem alterações significativas');
      }
      
      // Capitaliza a primeira letra se não estiver
      improvedText = improvedText.charAt(0).toUpperCase() + improvedText.slice(1);
      
      // Termina com ponto se não houver
      if (!improvedText.endsWith('.') && !improvedText.endsWith('!') && !improvedText.endsWith('?')) {
        improvedText += '.';
      }
      
      handleChange(field, improvedText);
      
      toast({
        title: "Texto melhorado",
        description: "O texto foi melhorado com sucesso!",
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao melhorar o texto. Tente novamente mais tarde.",
        variant: "destructive",
      });
      console.error("Erro ao melhorar texto:", error);
    } finally {
      setIsImproving(null);
    }
  };

  const fieldLabels: Record<keyof MedicalFormData, string> = {
    admission: 'Admissão',
    comorbidities: 'Comorbidades',
    medicationReason: 'MUC (Medicação de uso contínuo)',
    physicalExam: 'Exame Físico',
    analysis: 'Análise',
    plans: 'Condutas'
  };

  const renderField = (field: keyof MedicalFormData) => (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-1">
        <Label htmlFor={field} className="text-sm font-medium block">
          {fieldLabels[field]}
        </Label>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-gradient-to-r from-purple-50 to-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
            onClick={() => improveText(field)}
            disabled={isImproving !== null}
          >
            <Wand2 className="h-3.5 w-3.5 mr-1" /> 
            {isImproving === field ? 'Melhorando...' : 'Melhorar texto'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-medblue-50 border-medblue-200 text-medblue-600 hover:bg-medblue-100"
            onClick={() => openModelModal(field)}
          >
            <FilePlus className="h-3.5 w-3.5 mr-1" /> Modelos
          </Button>
        </div>
      </div>
      <Textarea 
        id={field}
        rows={3}
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={`Insira ${fieldLabels[field].toLowerCase()} aqui...`}
        className="min-h-[120px] w-full"
      />
    </div>
  );

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-medblue-600">Admissão Médica e Evolução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {renderField('admission')}
            {renderField('comorbidities')}
            {renderField('medicationReason')}
            {renderField('physicalExam')}
            {renderField('analysis')}
            {renderField('plans')}
          </div>
        </CardContent>
      </Card>

      <MedicalModelsModal 
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        currentField={currentField}
        fieldValue={currentField ? formData[currentField] : ''}
        onApplyModel={handleApplyModel}
      />
    </>
  );
};

export default MedicalForm;
