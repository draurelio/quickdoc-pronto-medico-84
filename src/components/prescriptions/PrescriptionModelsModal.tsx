import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Trash2, Save, FilePlus } from 'lucide-react';
import { PrescriptionItem } from '../PrescriptionTable';

interface PrescriptionModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptions: PrescriptionItem[];
  onApplyModel: (model: PrescriptionItem[]) => void;
}

interface PrescriptionModel {
  name: string;
  prescriptions: PrescriptionItem[];
}

const STORAGE_KEY = 'prescription_models';

const PrescriptionModelsModal: React.FC<PrescriptionModelsModalProps> = ({ isOpen, onClose, prescriptions, onApplyModel }) => {
  const [models, setModels] = useState<PrescriptionModel[]>([]);
  const [modelName, setModelName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setModels(JSON.parse(saved));
  }, [isOpen]);

  const saveModels = (newModels: PrescriptionModel[]) => {
    setModels(newModels);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newModels));
  };

  const handleSaveModel = () => {
    if (!modelName.trim()) return;
    const newModel: PrescriptionModel = {
      name: modelName.trim(),
      prescriptions: prescriptions.filter(p => p.medication)
    };
    const updated = [...models, newModel];
    saveModels(updated);
    setModelName('');
  };

  const handleDeleteModel = (name: string) => {
    const updated = models.filter(m => m.name !== name);
    saveModels(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={22} />
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FilePlus size={20}/> Modelos de Prescrição</h2>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Nome do modelo"
            className="w-full p-2 border rounded"
            value={modelName}
            onChange={e => setModelName(e.target.value)}
          />
          <Button onClick={handleSaveModel} className="bg-blue-600 hover:bg-blue-700 text-white" title="Salvar modelo"><Save size={18}/></Button>
        </div>
        <div className="max-h-72 overflow-y-auto divide-y">
          {models.length === 0 && <div className="text-gray-500 text-center py-4">Nenhum modelo salvo.</div>}
          {models.map(model => (
            <div key={model.name} className="flex items-center justify-between py-2">
              <div className="font-medium truncate max-w-[180px]">{model.name}</div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onApplyModel(model.prescriptions)}>Aplicar</Button>
                <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleDeleteModel(model.name)} title="Excluir"><Trash2 size={16}/></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModelsModal; 