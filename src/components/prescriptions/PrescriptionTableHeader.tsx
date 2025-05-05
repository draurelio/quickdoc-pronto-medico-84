
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PrescriptionTableHeader: React.FC = () => {
  return (
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
  );
};

export default PrescriptionTableHeader;
