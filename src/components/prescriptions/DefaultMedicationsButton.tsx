
import React from 'react';
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { PrescriptionItem } from '../PrescriptionTable';
import { defaultMedications } from '@/utils/defaultMedications';

interface DefaultMedicationsButtonProps {
  onAddDefaults: (medications: PrescriptionItem[]) => void;
}

const DefaultMedicationsButton: React.FC<DefaultMedicationsButtonProps> = ({ onAddDefaults }) => {
  // Helper function to safely convert to uppercase
  const safeToUpperCase = (value: string | string[] | undefined): string => {
    if (typeof value === 'string') {
      return value.toUpperCase();
    } else if (Array.isArray(value) && value.length > 0) {
      return value[0].toUpperCase();
    }
    return '';
  };

  const handleAddDefaultMedications = () => {
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
    
    onAddDefaults(defaultMedsWithIds);
  };

  return (
    <Button 
      onClick={handleAddDefaultMedications}
      className="bg-medblue-500 hover:bg-medblue-600"
    >
      <ListPlus size={16} className="mr-2" /> Medicações Padrão
    </Button>
  );
};

export default DefaultMedicationsButton;
