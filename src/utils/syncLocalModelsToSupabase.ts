import { supabase } from '@/lib/supabase';

export async function syncLocalModelsToSupabase(userId?: string) {
  if (!userId) return;

  // Sincronizar modelos médicos
  const medicalModelsRaw = localStorage.getItem('medical_models');
  if (medicalModelsRaw) {
    const medicalModels = JSON.parse(medicalModelsRaw);
    for (const model of medicalModels) {
      try {
        await supabase.from('medical_models').insert({
          name: model.name,
          field: model.field,
          content: model.content,
          user_id: userId
        });
      } catch (e) {
        // Ignorar erros individuais para não travar a sincronização
      }
    }
    localStorage.removeItem('medical_models');
  }

  // Sincronizar modelos de prescrição
  const prescriptionModelsRaw = localStorage.getItem('prescription_models');
  if (prescriptionModelsRaw) {
    const prescriptionModels = JSON.parse(prescriptionModelsRaw);
    for (const model of prescriptionModels) {
      try {
        await supabase.from('prescription_models').insert({
          name: model.name,
          prescriptions: model.prescriptions,
          user_id: userId
        });
      } catch (e) {
        // Ignorar erros individuais para não travar a sincronização
      }
    }
    localStorage.removeItem('prescription_models');
  }
} 