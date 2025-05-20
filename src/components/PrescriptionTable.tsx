
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { v4 as uuidv4 } from 'uuid';
import { OralMedication } from '../data/antibioticsData';
import AntibioticsModal from './AntibioticsModal';
import PrescriptionTableHeader from './prescriptions/PrescriptionTableHeader';
import PrescriptionTableRow from './prescriptions/PrescriptionTableRow';
import DefaultMedicationsButton from './prescriptions/DefaultMedicationsButton';
import PrescriptionActions from './prescriptions/PrescriptionActions';
import InjectableModal from './InjectableModal';
import { InjectableMedication } from '../data/injectablesData';
import PrescriptionModelsModal from './prescriptions/PrescriptionModelsModal';
import { FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Atualizado para o caminho correto

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

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({
  onDataChange
}) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([{
    id: '1',
    medication: '',
    dose: '',
    route: '',
    frequency: '',
    notes: '',
    time: ''
  }]);
  const [isAntibioticsModalOpen, setIsAntibioticsModalOpen] = useState(false);
  const [isInjectableModalOpen, setIsInjectableModalOpen] = useState(false);
  const [isModelsModalOpen, setIsModelsModalOpen] = useState(false);

  const updateField = (id: string, field: keyof PrescriptionItem, value: string) => {
    const upperValue = value.toUpperCase();
    const updatedPrescriptions = prescriptions.map(prescription => prescription.id === id ? {
      ...prescription,
      [field]: upperValue
    } : prescription);
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

  const handleAddAntibiotic = (antibiotic: OralMedication) => {
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

  const handleAddInjectable = (medication: InjectableMedication) => {
    const newPrescription: PrescriptionItem = {
      id: uuidv4(),
      medication: safeToUpperCase(medication.name),
      dose: safeToUpperCase(medication.dosage),
      route: safeToUpperCase(medication.route),
      frequency: safeToUpperCase(medication.posology),
      notes: safeToUpperCase(medication.observation),
      time: safeToUpperCase(medication.schedule)
    };
    const updatedPrescriptions = [...prescriptions, newPrescription];
    setPrescriptions(updatedPrescriptions);
    onDataChange(updatedPrescriptions);
    setIsInjectableModalOpen(false);
  };

  const handleApplyModel = (model: PrescriptionItem[]) => {
    setPrescriptions(model);
    onDataChange(model);
    setIsModelsModalOpen(false);
  };

  return <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-medblue-600">Prescrição Médica</CardTitle>
          <div className="flex gap-2">
            <DefaultMedicationsButton onAddDefaults={handleAddDefaultMedications} />
            <button type="button" onClick={() => setIsModelsModalOpen(true)} className="flex items-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded shadow-sm border border-blue-200 font-medium text-base">
              <FilePlus size={18} /> Modelos Compartilhados
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <PrescriptionTableHeader />
            <TableBody>
              {prescriptions.map(prescription => <PrescriptionTableRow key={prescription.id} prescription={prescription} onRemove={removeRow} onUpdate={updateField} />)}
            </TableBody>
          </Table>
        </div>
        <PrescriptionActions onAddRow={addRow} onOpenAntibioticsModal={() => setIsAntibioticsModalOpen(true)} onOpenInjectablesModal={() => setIsInjectableModalOpen(true)} />
        <AntibioticsModal isOpen={isAntibioticsModalOpen} onClose={() => setIsAntibioticsModalOpen(false)} onAddAntibiotic={handleAddAntibiotic} />
        <InjectableModal isOpen={isInjectableModalOpen} onClose={() => setIsInjectableModalOpen(false)} onAddMedication={handleAddInjectable} />
        <PrescriptionModelsModal isOpen={isModelsModalOpen} onClose={() => setIsModelsModalOpen(false)} prescriptions={prescriptions} onApplyModel={handleApplyModel} />
      </CardContent>
    </Card>;
};

export default PrescriptionTable;
