
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PrescriptionTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-medblue-50">
        <TableHead className="font-medium">Paciente</TableHead>
        <TableHead className="font-medium">Idade</TableHead>
        <TableHead className="font-medium">Diagnóstico</TableHead>
        <TableHead className="font-medium">Data de Admissão</TableHead>
        <TableHead className="font-medium">Data de Criação</TableHead>
        <TableHead className="font-medium w-[180px] text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PrescriptionTableHeader;
