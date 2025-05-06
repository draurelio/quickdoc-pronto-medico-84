
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PrescriptionTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-medblue-50">
        <TableHead className="font-medium text-medblue-800">Medicação</TableHead>
        <TableHead className="font-medium text-medblue-800">Dose</TableHead>
        <TableHead className="font-medium text-medblue-800">Via</TableHead>
        <TableHead className="font-medium text-medblue-800">Posologia</TableHead>
        <TableHead className="font-medium text-medblue-800">Observação</TableHead>
        <TableHead className="font-medium text-medblue-800">Horários</TableHead>
        <TableHead className="font-medium text-medblue-800 w-[60px] text-center">Ação</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PrescriptionTableHeader;
