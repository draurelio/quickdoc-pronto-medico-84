
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

export interface PrescriptionItem {
  id: string;
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  notes: string;
  time: string;
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

  const addRow = () => {
    const newRow: PrescriptionItem = { 
      id: Date.now().toString(), 
      medication: '', 
      dose: '', 
      route: '', 
      frequency: '', 
      notes: '', 
      time: '' 
    };
    const updatedPrescriptions = [...prescriptions, newRow];
    setPrescriptions(updatedPrescriptions);
    onDataChange(updatedPrescriptions);
  };

  const removeRow = (id: string) => {
    if (prescriptions.length > 1) {
      const updatedPrescriptions = prescriptions.filter(item => item.id !== id);
      setPrescriptions(updatedPrescriptions);
      onDataChange(updatedPrescriptions);
    }
  };

  const updateField = (id: string, field: keyof PrescriptionItem, value: string) => {
    const updatedPrescriptions = prescriptions.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setPrescriptions(updatedPrescriptions);
    onDataChange(updatedPrescriptions);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-medblue-600">Prescrição Médica</CardTitle>
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
                    <Input 
                      value={prescription.medication} 
                      onChange={(e) => updateField(prescription.id, 'medication', e.target.value)}
                      placeholder="Medicamento"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input 
                      value={prescription.dose} 
                      onChange={(e) => updateField(prescription.id, 'dose', e.target.value)}
                      placeholder="Dose"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input 
                      value={prescription.route} 
                      onChange={(e) => updateField(prescription.id, 'route', e.target.value)}
                      placeholder="Via"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input 
                      value={prescription.frequency} 
                      onChange={(e) => updateField(prescription.id, 'frequency', e.target.value)}
                      placeholder="Posologia"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input 
                      value={prescription.notes} 
                      onChange={(e) => updateField(prescription.id, 'notes', e.target.value)}
                      placeholder="Observações"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input 
                      value={prescription.time} 
                      onChange={(e) => updateField(prescription.id, 'time', e.target.value)}
                      placeholder="Horário"
                    />
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
        <Button 
          onClick={addRow} 
          className="mt-4 bg-medblue-500 hover:bg-medblue-600"
        >
          <Plus size={16} className="mr-1" /> Adicionar linha
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrescriptionTable;
