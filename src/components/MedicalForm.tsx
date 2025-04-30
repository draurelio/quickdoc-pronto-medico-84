import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  const handleChange = (field: keyof MedicalFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onDataChange(updatedData);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-medblue-600">Admissão Médica e Evolução</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="admission" className="text-sm font-medium mb-1 block">
                Admissão
              </Label>
              <Textarea 
                id="admission"
                rows={4}
                value={formData.admission}
                onChange={(e) => handleChange('admission', e.target.value)}
                placeholder="Histórico de admissão do paciente"
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="comorbidities" className="text-sm font-medium mb-1 block">
                Comorbidades
              </Label>
              <Textarea 
                id="comorbidities"
                rows={3}
                value={formData.comorbidities}
                onChange={(e) => handleChange('comorbidities', e.target.value)}
                placeholder="Comorbidades do paciente"
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label htmlFor="medicationReason" className="text-sm font-medium mb-1 block">
                MUC (Medicação de uso contínuo)
              </Label>
              <Textarea 
                id="medicationReason"
                rows={3}
                value={formData.medicationReason}
                onChange={(e) => handleChange('medicationReason', e.target.value)}
                placeholder="Motivos para uso da medicação"
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="physicalExam" className="text-sm font-medium mb-1 block">
                Exame Físico
              </Label>
              <Textarea 
                id="physicalExam"
                rows={3}
                value={formData.physicalExam}
                onChange={(e) => handleChange('physicalExam', e.target.value)}
                placeholder="Resultados do exame físico"
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label htmlFor="analysis" className="text-sm font-medium mb-1 block">
                Análise
              </Label>
              <Textarea 
                id="analysis"
                rows={3}
                value={formData.analysis}
                onChange={(e) => handleChange('analysis', e.target.value)}
                placeholder="Análise geral da situação do paciente"
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label htmlFor="plans" className="text-sm font-medium mb-1 block">
                Condutas
              </Label>
              <Textarea 
                id="plans"
                rows={3}
                value={formData.plans}
                onChange={(e) => handleChange('plans', e.target.value)}
                placeholder="Condutas e planos de tratamento"
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalForm;
