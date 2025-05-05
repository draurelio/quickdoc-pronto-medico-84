
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { v4 as uuidv4 } from 'uuid';
import { Antibiotic } from '../data/antibioticsData';
import AntibioticsModal from './AntibioticsModal';
import PrescriptionTableHeader from './prescriptions/PrescriptionTableHeader';
import PrescriptionTableRow from './prescriptions/PrescriptionTableRow';
import DefaultMedicationsButton from './prescriptions/DefaultMedicationsButton';
import PrescriptionActions from './prescriptions/PrescriptionActions';

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

  const handleAddDefaultMedications = (defaultMeds: PrescriptionItem[]) => {
    setPrescriptions(defaultMeds);
    onDataChange(defaultMeds);
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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-medblue-600">Prescrição Médica</CardTitle>
          <DefaultMedicationsButton onAddDefaults={handleAddDefaultMedications} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <PrescriptionTableHeader />
            <TableBody>
              {prescriptions.map((prescription) => (
                <PrescriptionTableRow 
                  key={prescription.id}
                  prescription={prescription}
                  onRemove={removeRow}
                  onUpdate={updateField}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <PrescriptionActions 
          onAddRow={addRow}
          onOpenAntibioticsModal={() => setIsAntibioticsModalOpen(true)}
        />
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
