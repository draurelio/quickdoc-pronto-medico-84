
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FilePlus, Wand2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import MedicalModelsModal from './medical/MedicalModelsModal';
import { mockImproveText } from '@/utils/aiTextUtils';

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

  const [improvedTexts, setImprovedTexts] = useState<Partial<MedicalFormData>>({});
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
      // Utilizando a versão mock para demonstração
      // Em produção, usar improveTextWithAI
      const { improvedText, success } = await mockImproveText(formData[field]);
      
      if (success) {
        setImprovedTexts((prev) => ({ ...prev, [field]: improvedText }));
        
        toast({
          title: "Texto melhorado",
          description: "O texto foi melhorado com sucesso!",
        });
      }
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
      
      {improvedTexts[field] && (
        <div className="mt-3 p-3 border border-green-200 bg-green-50 rounded-md">
          <div className="mb-1 flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs font-medium text-green-700">Texto melhorado</span>
          </div>
          <p className="text-sm text-gray-700">{improvedTexts[field]}</p>
        </div>
      )}
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
