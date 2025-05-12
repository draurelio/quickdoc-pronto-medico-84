
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Trash2, Save, FilePlus, Edit, Check } from 'lucide-react';
import { PrescriptionItem } from '../PrescriptionTable';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionModelsModal {
  isOpen: boolean;
  onClose: () => void;
  prescriptions: PrescriptionItem[];
  onApplyModel: (model: PrescriptionItem[]) => void;
}

interface PrescriptionModel {
  id?: string;
  name: string;
  prescriptions: PrescriptionItem[];
}

const PrescriptionModelsModal: React.FC<PrescriptionModelsModal> = ({ isOpen, onClose, prescriptions, onApplyModel }) => {
  const [models, setModels] = useState<PrescriptionModel[]>([]);
  const [modelName, setModelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const { toast } = useToast();

  // Carregar modelos do Supabase
  const fetchModels = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        const { data, error } = await supabase
          .from('prescription_models')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setModels(data?.map(item => ({
          id: item.id,
          name: item.name,
          prescriptions: item.prescriptions
        })) || []);
      } else {
        // Fallback para localStorage se não estiver autenticado
        const saved = localStorage.getItem('prescription_models');
        if (saved) setModels(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os modelos salvos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchModels();
    }
  }, [isOpen]);

  // Salvar modelo no Supabase
  const handleSaveModel = async () => {
    if (!modelName.trim()) return;
    
    try {
      setLoading(true);
      const modelPrescriptions = prescriptions.filter(p => p.medication);
      
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        // Salvar no Supabase
        const { data, error } = await supabase
          .from('prescription_models')
          .insert({
            name: modelName.trim(),
            prescriptions: modelPrescriptions,
            user_id: session.session.user.id
          })
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          setModels([
            {
              id: data[0].id,
              name: data[0].name,
              prescriptions: data[0].prescriptions
            },
            ...models
          ]);
          
          toast({
            title: 'Modelo salvo',
            description: 'O modelo foi salvo com sucesso.',
          });
        }
      } else {
        // Fallback para localStorage
        const newModel = {
          id: crypto.randomUUID(),
          name: modelName.trim(),
          prescriptions: modelPrescriptions
        };
        
        const updatedModels = [newModel, ...models];
        setModels(updatedModels);
        localStorage.setItem('prescription_models', JSON.stringify(updatedModels));
        
        toast({
          title: 'Modelo salvo localmente',
          description: 'Faça login para salvar os modelos na nuvem.',
        });
      }
      
      setModelName('');
    } catch (error) {
      console.error('Erro ao salvar modelo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o modelo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Atualizar modelo no Supabase
  const handleUpdateModel = async (id: string) => {
    if (!editName.trim()) return;
    
    try {
      setLoading(true);
      
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        // Atualizar no Supabase
        const { error } = await supabase
          .from('prescription_models')
          .update({
            name: editName.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
        
        // Atualizar estado local
        setModels(models.map(model => 
          model.id === id ? { ...model, name: editName.trim() } : model
        ));
        
        toast({
          title: 'Modelo atualizado',
          description: 'O modelo foi atualizado com sucesso.',
        });
      } else {
        // Fallback para localStorage
        const updatedModels = models.map(model =>
          model.id === id ? { ...model, name: editName.trim() } : model
        );
        
        setModels(updatedModels);
        localStorage.setItem('prescription_models', JSON.stringify(updatedModels));
      }
      
      setEditingModelId(null);
      setEditName('');
    } catch (error) {
      console.error('Erro ao atualizar modelo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o modelo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Excluir modelo do Supabase
  const handleDeleteModel = async (id: string) => {
    try {
      setLoading(true);
      
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        // Excluir do Supabase
        const { error } = await supabase
          .from('prescription_models')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      }
      
      // Atualizar estado local
      const updatedModels = models.filter(model => model.id !== id);
      setModels(updatedModels);
      
      // Atualizar localStorage (para fallback)
      localStorage.setItem('prescription_models', JSON.stringify(updatedModels));
      
      toast({
        title: 'Modelo excluído',
        description: 'O modelo foi excluído com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir modelo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o modelo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (model: PrescriptionModel) => {
    setEditingModelId(model.id as string);
    setEditName(model.name);
  };

  const cancelEditing = () => {
    setEditingModelId(null);
    setEditName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
          onClick={onClose}
          disabled={loading}
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FilePlus size={20}/> Modelos de Prescrição
        </h2>
        
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Nome do modelo"
            className="w-full p-2 border rounded"
            value={modelName}
            onChange={e => setModelName(e.target.value)}
            disabled={loading}
          />
          <Button 
            onClick={handleSaveModel} 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            title="Salvar modelo"
            disabled={loading || !modelName.trim()}
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <Save size={18}/>
            )}
          </Button>
        </div>
        
        {loading && !models.length && (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin" />
          </div>
        )}
        
        <div className="max-h-72 overflow-y-auto divide-y">
          {models.length === 0 && !loading && (
            <div className="text-gray-500 text-center py-4">Nenhum modelo salvo.</div>
          )}
          
          {models.map(model => (
            <div key={model.id} className="flex items-center justify-between py-2">
              {editingModelId === model.id ? (
                <div className="flex items-center gap-2 w-full pr-2">
                  <input
                    type="text"
                    className="w-full p-1 border rounded"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                  />
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700" 
                    onClick={() => handleUpdateModel(model.id as string)}
                    disabled={!editName.trim()}
                    title="Confirmar"
                  >
                    <Check size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={cancelEditing}
                    title="Cancelar"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="font-medium truncate max-w-[180px]">{model.name}</div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white" 
                      onClick={() => onApplyModel(model.prescriptions)}
                      title="Aplicar modelo"
                    >
                      Aplicar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-blue-500 border-blue-200 hover:bg-blue-50" 
                      onClick={() => startEditing(model)}
                      title="Editar nome"
                    >
                      <Edit size={16}/>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 border-red-200 hover:bg-red-50" 
                      onClick={() => handleDeleteModel(model.id as string)}
                      title="Excluir"
                    >
                      <Trash2 size={16}/>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModelsModal;
