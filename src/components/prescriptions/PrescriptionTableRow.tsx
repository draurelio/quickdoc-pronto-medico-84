
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { PrescriptionItem } from '../PrescriptionTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PrescriptionTableRowProps {
  prescription: PrescriptionItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PrescriptionItem, value: string) => void;
}

const PrescriptionTableRow: React.FC<PrescriptionTableRowProps> = ({ 
  prescription, 
  onRemove, 
  onUpdate 
}) => {
  const renderInput = (field: keyof PrescriptionItem) => {
    if (prescription.options?.[field]) {
      return (
        <Select
          value={prescription[field] as string}
          onValueChange={(value) => onUpdate(prescription.id, field, value)}
        >
          <SelectTrigger className="w-full rounded-md border-medblue-200 focus:ring-1 focus:ring-medblue-300 bg-white">
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
        onChange={(e) => onUpdate(prescription.id, field, e.target.value)}
        placeholder={getPlaceholder(field)}
        className="uppercase w-full border-medblue-200 focus:ring-1 focus:ring-medblue-300 bg-white"
      />
    );
  };

  const getPlaceholder = (field: keyof PrescriptionItem): string => {
    const placeholders: Record<string, string> = {
      medication: "Medicação",
      dose: "Dose",
      route: "Via",
      frequency: "Posologia",
      notes: "Observação",
      time: "Horários"
    };
    
    return placeholders[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  return (
    <TableRow className="hover:bg-medblue-50/60 transition-colors">
      <TableCell className="p-1.5 border-b border-medblue-100">
        {renderInput('medication')}
      </TableCell>
      <TableCell className="p-1.5 border-b border-medblue-100">
        {renderInput('dose')}
      </TableCell>
      <TableCell className="p-1.5 border-b border-medblue-100">
        {renderInput('route')}
      </TableCell>
      <TableCell className="p-1.5 border-b border-medblue-100">
        {renderInput('frequency')}
      </TableCell>
      <TableCell className="p-1.5 border-b border-medblue-100">
        {renderInput('notes')}
      </TableCell>
      <TableCell className="p-1.5 border-b border-medblue-100">
        {renderInput('time')}
      </TableCell>
      <TableCell className="p-1.5 border-b border-medblue-100 text-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemove(prescription.id)}
          className="hover:bg-red-100 hover:text-red-600 rounded-full h-8 w-8"
        >
          <Minus size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default PrescriptionTableRow;
