
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
        onChange={(e) => onUpdate(prescription.id, field, e.target.value)}
        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
        className="uppercase"
      />
    );
  };

  return (
    <TableRow>
      <TableCell className="p-2">
        {renderInput('medication')}
      </TableCell>
      <TableCell className="p-2">
        {renderInput('dose')}
      </TableCell>
      <TableCell className="p-2">
        {renderInput('route')}
      </TableCell>
      <TableCell className="p-2">
        {renderInput('frequency')}
      </TableCell>
      <TableCell className="p-2">
        {renderInput('notes')}
      </TableCell>
      <TableCell className="p-2">
        {renderInput('time')}
      </TableCell>
      <TableCell className="p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemove(prescription.id)}
        >
          <Minus size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default PrescriptionTableRow;
