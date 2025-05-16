import React, { useState } from 'react';
import { oralMedications, OralMedication } from '../data/antibioticsData';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AntibioticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAntibiotic: (antibiotic: OralMedication) => void;
}

const AntibioticsModal: React.FC<AntibioticsModalProps> = ({ isOpen, onClose, onAddAntibiotic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<OralMedication | null>(null);
  const [fieldSelections, setFieldSelections] = useState<any>({});

  const handleSelectAntibiotic = (antibiotic: OralMedication) => {
    setSelectedAntibiotic(antibiotic);
    setFieldSelections({
      dosage: Array.isArray(antibiotic.dosage) ? antibiotic.dosage[0] : antibiotic.dosage,
      route: Array.isArray(antibiotic.route) ? antibiotic.route[0] : antibiotic.route,
      posology: Array.isArray(antibiotic.posology) ? antibiotic.posology[0] : antibiotic.posology,
      observation: Array.isArray(antibiotic.observation) ? antibiotic.observation[0] : antibiotic.observation,
      schedule: Array.isArray(antibiotic.schedule) ? antibiotic.schedule[0] : antibiotic.schedule,
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    setFieldSelections((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (selectedAntibiotic) {
      onAddAntibiotic({
        ...selectedAntibiotic,
        dosage: fieldSelections.dosage,
        route: fieldSelections.route,
        posology: fieldSelections.posology,
        observation: fieldSelections.observation,
        schedule: fieldSelections.schedule,
      });
      setSelectedAntibiotic(null);
      setFieldSelections({});
    }
  };

  if (!isOpen) return null;

  const sortedMedications = oralMedications.slice().sort((a, b) => a.name.localeCompare(b.name));
  const filteredMedications = sortedMedications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Selecionar Comprimido</h2>
        {!selectedAntibiotic ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar comprimido..."
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {filteredMedications.map((antibiotic) => (
                <div
                  key={antibiotic.id}
                  className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectAntibiotic(antibiotic)}
                >
                  <div className="font-bold">{antibiotic.name}</div>
                  <div className="text-sm text-gray-600">
                    <div>Dosagem: {Array.isArray(antibiotic.dosage) ? antibiotic.dosage.join(' / ') : antibiotic.dosage}</div>
                    <div>Via: {Array.isArray(antibiotic.route) ? antibiotic.route.join(' / ') : antibiotic.route}</div>
                    <div>Posologia: {Array.isArray(antibiotic.posology) ? antibiotic.posology.join(' / ') : antibiotic.posology}</div>
                    {antibiotic.observation && (
                      <div>Observação: {Array.isArray(antibiotic.observation) ? antibiotic.observation.join(' / ') : antibiotic.observation}</div>
                    )}
                    {antibiotic.schedule && (
                      <div>Horário: {Array.isArray(antibiotic.schedule) ? antibiotic.schedule.join(' / ') : antibiotic.schedule}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="font-bold text-lg mb-2">{selectedAntibiotic.name}</div>
            <div className="grid grid-cols-1 gap-2">
              {/* Dosagem */}
              {Array.isArray(selectedAntibiotic.dosage) ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Dosagem</label>
                  <Select value={fieldSelections.dosage} onValueChange={v => handleFieldChange('dosage', v)}>
                    <SelectTrigger className="w-full uppercase">
                      <SelectValue placeholder="Selecione a dosagem" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAntibiotic.dosage.map((d: string) => (
                        <SelectItem key={d} value={d} className="uppercase">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>Dosagem: {selectedAntibiotic.dosage}</div>
              )}
              {/* Via */}
              {Array.isArray(selectedAntibiotic.route) ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Via</label>
                  <Select value={fieldSelections.route} onValueChange={v => handleFieldChange('route', v)}>
                    <SelectTrigger className="w-full uppercase">
                      <SelectValue placeholder="Selecione a via" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAntibiotic.route.map((r: string) => (
                        <SelectItem key={r} value={r} className="uppercase">{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>Via: {selectedAntibiotic.route}</div>
              )}
              {/* Posologia */}
              {Array.isArray(selectedAntibiotic.posology) ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Posologia</label>
                  <Select value={fieldSelections.posology} onValueChange={v => handleFieldChange('posology', v)}>
                    <SelectTrigger className="w-full uppercase">
                      <SelectValue placeholder="Selecione a posologia" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAntibiotic.posology.map((p: string) => (
                        <SelectItem key={p} value={p} className="uppercase">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>Posologia: {selectedAntibiotic.posology}</div>
              )}
              {/* Observação */}
              {Array.isArray(selectedAntibiotic.observation) ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Observação</label>
                  <Select value={fieldSelections.observation} onValueChange={v => handleFieldChange('observation', v)}>
                    <SelectTrigger className="w-full uppercase">
                      <SelectValue placeholder="Selecione a observação" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAntibiotic.observation.map((o: string) => (
                        <SelectItem key={o} value={o} className="uppercase">{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                selectedAntibiotic.observation && <div>Observação: {selectedAntibiotic.observation}</div>
              )}
              {/* Horário */}
              {Array.isArray(selectedAntibiotic.schedule) ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Horário</label>
                  <Select value={fieldSelections.schedule} onValueChange={v => handleFieldChange('schedule', v)}>
                    <SelectTrigger className="w-full uppercase">
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAntibiotic.schedule.map((s: string) => (
                        <SelectItem key={s} value={s} className="uppercase">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                selectedAntibiotic.schedule && <div>Horário: {selectedAntibiotic.schedule}</div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAdd} className="bg-green-600 text-white">Adicionar</Button>
              <Button onClick={() => setSelectedAntibiotic(null)} variant="outline">Voltar</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AntibioticsModal; 