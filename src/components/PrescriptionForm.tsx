import React, { useState } from 'react';
import { OralMedication } from '../data/antibioticsData';
import AntibioticsModal from './AntibioticsModal';
import { PrescriptionItem } from './PrescriptionTable';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionFormProps {
  onSubmit: (data: any) => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ onSubmit }) => {
  const [isAntibioticsModalOpen, setIsAntibioticsModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { id: '1', medication: '', dose: '', route: '', frequency: '', notes: '', time: '' }
  ]);
  const { toast } = useToast();

  const handleAddAntibiotic = (antibiotic: OralMedication) => {
    const newPrescription: PrescriptionItem = {
      id: crypto.randomUUID(),
      medication: typeof antibiotic.name === 'string' ? antibiotic.name : Array.isArray(antibiotic.name) ? antibiotic.name[0] : '',
      dose: typeof antibiotic.dosage === 'string' ? antibiotic.dosage : Array.isArray(antibiotic.dosage) ? antibiotic.dosage[0] : '',
      route: typeof antibiotic.route === 'string' ? antibiotic.route : Array.isArray(antibiotic.route) ? antibiotic.route[0] : '',
      frequency: typeof antibiotic.posology === 'string' ? antibiotic.posology : Array.isArray(antibiotic.posology) ? antibiotic.posology[0] : '',
      notes: typeof antibiotic.observation === 'string' ? antibiotic.observation : Array.isArray(antibiotic.observation) ? antibiotic.observation[0] : '',
      time: typeof antibiotic.schedule === 'string' ? antibiotic.schedule : Array.isArray(antibiotic.schedule) ? antibiotic.schedule[0] : ''
    };
    setPrescriptions([...prescriptions, newPrescription]);
    setIsAntibioticsModalOpen(false);
    
    toast({
      title: 'Antibiótico adicionado',
      description: `${newPrescription.medication} foi adicionado à prescrição`,
    });
  };

  const handleRemoveAntibiotic = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setPrescriptions([
      ...prescriptions,
      { id: crypto.randomUUID(), medication: '', dose: '', route: '', frequency: '', notes: '', time: '' }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      // ... existing form data ...
      antibiotics: prescriptions
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tabela principal de prescrições */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2">Medicação</th>
            <th className="px-4 py-2">Dose</th>
            <th className="px-4 py-2">Via</th>
            <th className="px-4 py-2">Posologia</th>
            <th className="px-4 py-2">Observações</th>
            <th className="px-4 py-2">Horário</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription, index) => (
            <tr key={prescription.id} className="bg-white border-b">
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={prescription.medication}
                  onChange={e => {
                    const newPrescriptions = [...prescriptions];
                    newPrescriptions[index].medication = e.target.value;
                    setPrescriptions(newPrescriptions);
                  }}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={prescription.dose}
                  onChange={e => {
                    const newPrescriptions = [...prescriptions];
                    newPrescriptions[index].dose = e.target.value;
                    setPrescriptions(newPrescriptions);
                  }}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={prescription.route}
                  onChange={e => {
                    const newPrescriptions = [...prescriptions];
                    newPrescriptions[index].route = e.target.value;
                    setPrescriptions(newPrescriptions);
                  }}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={prescription.frequency}
                  onChange={e => {
                    const newPrescriptions = [...prescriptions];
                    newPrescriptions[index].frequency = e.target.value;
                    setPrescriptions(newPrescriptions);
                  }}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={prescription.notes}
                  onChange={e => {
                    const newPrescriptions = [...prescriptions];
                    newPrescriptions[index].notes = e.target.value;
                    setPrescriptions(newPrescriptions);
                  }}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={prescription.time}
                  onChange={e => {
                    const newPrescriptions = [...prescriptions];
                    newPrescriptions[index].time = e.target.value;
                    setPrescriptions(newPrescriptions);
                  }}
                />
              </td>
              <td className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => handleRemoveAntibiotic(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2 mt-4">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addRow}>
          + Adicionar linha
        </button>
        <button type="button" className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => setIsAntibioticsModalOpen(true)}>
          + Antibióticos
        </button>
      </div>

      {/* ... existing form buttons ... */}

      <AntibioticsModal
        isOpen={isAntibioticsModalOpen}
        onClose={() => setIsAntibioticsModalOpen(false)}
        onAddAntibiotic={handleAddAntibiotic}
      />
    </form>
  );
};

export default PrescriptionForm;
