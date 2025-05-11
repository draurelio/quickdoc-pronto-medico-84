
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
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
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs bg-medblue-50 border-medblue-200 text-medblue-600 hover:bg-medblue-100"
          onClick={() => openModelModal(field)}
        >
          <FilePlus className="h-3.5 w-3.5 mr-1" /> Modelos
        </Button>
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
