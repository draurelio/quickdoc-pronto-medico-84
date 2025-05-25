import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PatientHeaderProps {
  onDataChange: (data: PatientData) => void;
}

export interface PatientData {
  name: string;
  age: string;
  admissionDate: string;
  currentDate: string;
  diagnosis: string;
  allergies: string;
  origin: string;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ onDataChange }) => {
  const [patientData, setPatientData] = React.useState<PatientData>({
    name: '',
    age: '',
    admissionDate: '',
    currentDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    allergies: '',
    origin: '',
  });

  const handleChange = (field: keyof PatientData, value: string) => {
    const updatedData = { ...patientData, [field]: value };
    setPatientData(updatedData);
    onDataChange(updatedData);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      handleChange('age', value);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 text-medblue-600">Dados do Paciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Paciente</Label>
            <Input 
              id="name" 
              value={patientData.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Idade</Label>
            <Input 
              id="age" 
              value={patientData.age} 
              onChange={handleAgeChange}
              placeholder="Idade"
              inputMode="numeric"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admissionDate">DIH (Data de Internação Hospitalar)</Label>
            <Input 
              id="admissionDate"
              type="date"
              value={patientData.admissionDate} 
              onChange={(e) => handleChange('admissionDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentDate">Data Atual</Label>
            <Input 
              id="currentDate"
              type="date"
              value={patientData.currentDate} 
              onChange={(e) => handleChange('currentDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin">Origem</Label>
            <Input 
              id="origin" 
              value={patientData.origin} 
              onChange={(e) => handleChange('origin', e.target.value)}
              placeholder="Origem/Procedência"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea 
              id="diagnosis" 
              value={patientData.diagnosis} 
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              placeholder="Diagnóstico principal"
              className="h-[38px] min-h-[38px]"
            />
          </div>
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label htmlFor="allergies">Alergias</Label>
            <Textarea 
              id="allergies" 
              value={patientData.allergies} 
              onChange={(e) => handleChange('allergies', e.target.value)}
              placeholder="Alergias e reações medicamentosas"
              className="h-[38px] min-h-[38px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientHeader;
