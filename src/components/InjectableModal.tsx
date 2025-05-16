import React, { useState } from 'react';
import { InjectableMedication, injectableMedications } from '../data/injectablesData';
import { formatDate } from '../utils/formatUtils';

interface InjectableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedication: (medication: InjectableMedication) => void;
}

const InjectableModal: React.FC<InjectableModalProps> = ({ isOpen, onClose, onAddMedication }) => {
  const [selectedMedication, setSelectedMedication] = useState<InjectableMedication | null>(null);
  const [selectedDosage, setSelectedDosage] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [selectedPosology, setSelectedPosology] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleMedicationSelect = (medication: InjectableMedication) => {
    setSelectedMedication(medication);
    setSelectedDosage(Array.isArray(medication.dosage) ? medication.dosage[0] : medication.dosage);
    setSelectedRoute(Array.isArray(medication.route) ? medication.route[0] : medication.route);
    setSelectedPosology(Array.isArray(medication.posology) ? medication.posology[0] : medication.posology);
    setSelectedSchedule('');
  };

  const handleAddMedication = () => {
    if (selectedMedication) {
      const medicationToAdd: InjectableMedication = {
        ...selectedMedication,
        dosage: selectedDosage,
        route: selectedRoute,
        posology: selectedPosology,
        schedule: selectedSchedule
      };
      onAddMedication(medicationToAdd);
      onClose();
    }
  };

  const filteredMedications = injectableMedications.filter((medication) =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">SELECIONAR INJETÁVEL</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar injetável..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">LISTA DE INJETÁVEIS</h3>
              <div className="max-h-96 overflow-y-auto">
                {filteredMedications.map((medication) => (
                  <div
                    key={medication.id}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      selectedMedication?.id === medication.id ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleMedicationSelect(medication)}
                  >
                    {medication.name}
                  </div>
                ))}
                {filteredMedications.length === 0 && (
                  <div className="text-gray-500 text-center py-4">Nenhum injetável encontrado.</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {selectedMedication && (
              <>
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold mb-2">DETALHES DO INJETÁVEL</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold">NOME</label>
                      <div className="p-2 bg-gray-100 rounded">{selectedMedication.name}</div>
                    </div>

                    <div>
                      <label className="block font-semibold">DOSAGEM</label>
                      {Array.isArray(selectedMedication.dosage) ? (
                        <select
                          className="w-full p-2 border rounded"
                          value={selectedDosage}
                          onChange={(e) => setSelectedDosage(e.target.value)}
                        >
                          {selectedMedication.dosage.map((dosage) => (
                            <option key={dosage} value={dosage}>
                              {dosage}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-2 bg-gray-100 rounded">{selectedMedication.dosage}</div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold">VIA</label>
                      {Array.isArray(selectedMedication.route) ? (
                        <select
                          className="w-full p-2 border rounded"
                          value={selectedRoute}
                          onChange={(e) => setSelectedRoute(e.target.value)}
                        >
                          {selectedMedication.route.map((route) => (
                            <option key={route} value={route}>
                              {route}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-2 bg-gray-100 rounded">{selectedMedication.route}</div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold">POSOLOGIA</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedPosology}
                        onChange={(e) => setSelectedPosology(e.target.value)}
                      >
                        {Array.isArray(selectedMedication.posology)
                          ? selectedMedication.posology.map((posology) => (
                              <option key={posology} value={posology}>
                                {posology}
                              </option>
                            ))
                          : <option value={selectedMedication.posology}>{selectedMedication.posology}</option>}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold">OBSERVAÇÃO</label>
                      <div className="p-2 bg-gray-100 rounded">
                        {selectedMedication.observation}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold">HORÁRIO</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={selectedSchedule}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                        placeholder="Digite o horário"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={handleAddMedication}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ADICIONAR
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjectableModal; 