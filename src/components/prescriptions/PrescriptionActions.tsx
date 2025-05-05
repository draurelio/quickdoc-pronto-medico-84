import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { PrescriptionItem } from '../PrescriptionTable';

interface PrescriptionActionsProps {
  onAddRow: () => void;
  onOpenAntibioticsModal: () => void;
}

const PrescriptionActions: React.FC<PrescriptionActionsProps> = ({ 
  onAddRow,
  onOpenAntibioticsModal
}) => {
  return (
    <div className="flex gap-2 mt-4">
      <Button 
        onClick={onAddRow} 
        className="bg-medblue-500 hover:bg-medblue-600"
      >
        <Plus size={16} className="mr-1" /> Adicionar linha
      </Button>
      <Button 
        onClick={onOpenAntibioticsModal}
        className="bg-green-600 hover:bg-green-700"
      >
        + Comprimidos
      </Button>
    </div>
  );
};

export default PrescriptionActions;
