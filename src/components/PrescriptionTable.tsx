
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, ListPlus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { defaultMedications } from '@/utils/defaultMedications';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Antibiotic } from '../data/antibioticsData';
import AntibioticsModal from './AntibioticsModal';

export interface PrescriptionItem {
  id: string;
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  notes: string;
  time: string;
  options?: {
    medication?: string[];
    dose?: string[];
    route?: string[];
    frequency?: string[];
    notes?: string[];
  };
}

interface PrescriptionTableProps {
  onDataChange: (data: PrescriptionItem[]) => void;
}

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({ onDataChange }) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { 
      id: '1', 
      medication: '', 
      dose: '', 
      route: '', 
      frequency: '', 
      notes: '', 
      time: '' 
    }
  ]);
  const [isAntibioticsModalOpen, setIsAntibioticsModalOpen] = useState(false);

  const updateField = (id: string, field: keyof PrescriptionItem, value: string) => {
    const upperValue = value.toUpperCase();
    const updatedPrescriptions = prescriptions.map(prescription => 
      prescription.id === id ? { ...prescription, [field]: upperValue } : prescription
    );
    setPrescriptions(updatedPrescriptions);
    onDataChange(updatedPrescriptions);
  };

  const addRow = () => {
    const newPrescription: PrescriptionItem = { 
      id: uuidv4(), 
      medication: '', 
      dose: '', 
      route: '', 
      frequency: '', 
      notes: '', 
      time: '' 
    };
    const updatedPrescriptions = [...prescriptions, newPrescription];
    setPrescriptions(updatedPrescriptions);
    onDataChange(updatedPrescriptions);
  };

  const removeRow = (id: string) => {
    if (prescriptions.length > 1) {
      const updatedPrescriptions = prescriptions.filter(p => p.id !== id);
      setPrescriptions(updatedPrescriptions);
      onDataChange(updatedPrescriptions);
    }
  };

  // Helper function to safely convert to uppercase
  const safeToUpperCase = (value: string | string[] | undefined): string => {
    if (typeof value === 'string') {
      return value.toUpperCase();
    } else if (Array.isArray(value) && value.length > 0) {
      return value[0].toUpperCase();
    }
    return '';
  };

  const addDefaultMedications = () => {
    const defaultMedsWithIds = defaultMedications.map(med => ({
      ...med,
      id: uuidv4(),
      medication: safeToUpperCase(med.medication),
      dose: safeToUpperCase(med.dose),
      route: safeToUpperCase(med.route),
      frequency: safeToUpperCase(med.frequency),
      notes: safeToUpperCase(med.notes),
      time: safeToUpperCase(med.time),
    }));
    setPrescriptions(defaultMedsWithIds);
    onDataChange(defaultMedsWithIds);
  };

  const handleAddAntibiotic = (antibiotic: Antibiotic) => {
    const newPrescription: PrescriptionItem = {
      id: uuidv4(),
      medication: safeToUpperCase(antibiotic.name),
      dose: safeToUpperCase(antibiotic.dosage),
      route: safeToUpperCase(antibiotic.route),
      frequency: safeToUpperCase(antibiotic.posology),
      notes: safeToUpperCase(antibiotic.observation),
      time: safeToUpperCase(antibiotic.schedule)
    };
    const updatedPrescriptions = [...prescriptions, newPrescription];
    setPrescriptions(updatedPrescriptions);
    onDataChange(updatedPrescriptions);
    setIsAntibioticsModalOpen(false);
  };

  const renderInput = (prescription: PrescriptionItem, field: keyof PrescriptionItem) => {
    if (prescription.options?.[field]) {
      return (
        <Select
          value={prescription[field] as string}
          onValueChange={(value) => updateField(prescription.id, field, value)}
        >
          <SelectTrigger className="w-full uppercase">
            <SelectValue placeholder={`Selecione ${field}`.toUpperCase()} />
          </SelectTrigger>
          <SelectContent>
            {prescription.options[field]?.map((option) => (
              <SelectItem key={option} value={option.toUpperCase()} className="uppercase">
                {option.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input 
        value={prescription[field] as string}
        onChange={(e) => updateField(prescription.id, field, e.target.value)}
        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
        className="uppercase"
      />
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-medblue-600">Prescrição Médica</CardTitle>
          <Button 
            onClick={addDefaultMedications}
            className="bg-medblue-500 hover:bg-medblue-600"
          >
            <ListPlus size={16} className="mr-2" /> Medicações Padrão
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-medblue-50">
                <TableHead className="font-medium">Medicação</TableHead>
                <TableHead className="font-medium">Dose</TableHead>
                <TableHead className="font-medium">Via</TableHead>
                <TableHead className="font-medium">Posologia</TableHead>
                <TableHead className="font-medium">Observações</TableHead>
                <TableHead className="font-medium">Horário</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="p-2">
                    {renderInput(prescription, 'medication')}
                  </TableCell>
                  <TableCell className="p-2">
                    {renderInput(prescription, 'dose')}
                  </TableCell>
                  <TableCell className="p-2">
                    {renderInput(prescription, 'route')}
                  </TableCell>
                  <TableCell className="p-2">
                    {renderInput(prescription, 'frequency')}
                  </TableCell>
                  <TableCell className="p-2">
                    {renderInput(prescription, 'notes')}
                  </TableCell>
                  <TableCell className="p-2">
                    {renderInput(prescription, 'time')}
                  </TableCell>
                  <TableCell className="p-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeRow(prescription.id)}
                    >
                      <Minus size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={addRow} 
            className="bg-medblue-500 hover:bg-medblue-600"
          >
            <Plus size={16} className="mr-1" /> Adicionar linha
          </Button>
          <Button 
            onClick={() => setIsAntibioticsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            + Antibióticos
          </Button>
        </div>
        <AntibioticsModal
          isOpen={isAntibioticsModalOpen}
          onClose={() => setIsAntibioticsModalOpen(false)}
          onAddAntibiotic={handleAddAntibiotic}
        />
      </CardContent>
    </Card>
  );
};

export default PrescriptionTable;
