
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export interface ImprovedTextResponse {
  improvedText: string;
  success: boolean;
}

export const improveTextWithAI = async (text: string): Promise<ImprovedTextResponse> => {
  if (!text.trim()) {
    toast({
      title: "Texto vazio",
      description: "Por favor, insira algum texto para melhorar.",
      variant: "destructive",
    });
    return { improvedText: "", success: false };
  }

  try {
    // Chamada para função do Supabase Edge Function que faz a integração com IA
    // Esta função precisará ser criada no Supabase posteriormente
    const { data, error } = await supabase.functions.invoke('improve-text', {
      body: { text }
    });

    if (error) {
      console.error("Erro ao melhorar texto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível melhorar o texto. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return { improvedText: "", success: false };
    }

    return { improvedText: data.improvedText, success: true };
  } catch (error) {
    console.error("Erro ao melhorar texto:", error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao processar sua solicitação.",
      variant: "destructive",
    });
    return { improvedText: "", success: false };
  }
};

// Implementação temporária para demonstração, até que a Edge Function seja criada
export const mockImproveText = (text: string): Promise<ImprovedTextResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulação básica de melhorias de texto
      let improvedText = text
        .replace(/\s+/g, ' ')                          // Remove espaços duplos
        .replace(/\s+([.,;:])/g, '$1')                 // Remove espaços antes de pontuação
        .replace(/([.,;:])\s*([A-Z])/g, '$1 $2');      // Garante espaço após pontuação seguido por maiúscula
        
      // Melhorias básicas de texto
      improvedText = improvedText
        .replace(/paciente apresentou/i, 'O paciente apresentou')
        .replace(/paciente veio/i, 'O paciente chegou ao serviço')
        .replace(/paciente relatou/i, 'O paciente reportou')
        .replace(/dor/i, 'quadro álgico')
        .replace(/febre/i, 'estado febril')
        .replace(/normal/i, 'dentro dos parâmetros de normalidade')
        .replace(/exame físico/i, 'Ao exame físico')
        .replace(/normotensa/i, 'com níveis tensionais adequados')
        .replace(/sem alteracoes/i, 'sem alterações significativas');
      
      // Capitaliza a primeira letra se não estiver
      improvedText = improvedText.charAt(0).toUpperCase() + improvedText.slice(1);
      
      // Termina com ponto se não houver
      if (!improvedText.endsWith('.') && !improvedText.endsWith('!') && !improvedText.endsWith('?')) {
        improvedText += '.';
      }

      resolve({ improvedText, success: true });
    }, 1000); // Simula o tempo de resposta da API
  });
};
