
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export interface ImprovedTextResponse {
  improvedText: string;
  success: boolean;
}

// Chave da API Gemini do Google
const GEMINI_API_KEY = "AIzaSyAo8qRthzx1-qAdkisrBpiG7ZnvtXeTOCo";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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
    console.log("Iniciando chamada para API Gemini");
    
    const prompt = `
      Você é um assistente especializado em textos médicos em português. 
      Por favor, revise e melhore o seguinte texto médico, corrigindo erros gramaticais, 
      melhorando a fluência e o vocabulário médico, mas mantenha o significado original:
      
      "${text}"
      
      Forneça apenas o texto melhorado, sem comentários adicionais.
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    console.log("Status da resposta API:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na resposta da API Gemini:", errorData);
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resposta completa da API:", data);
    
    // Extrair o texto melhorado da resposta da API Gemini
    const improvedText = data.candidates[0]?.content?.parts[0]?.text || "";
    
    if (!improvedText) {
      console.error("Resposta da API sem texto:", data);
      throw new Error("Não foi possível extrair o texto melhorado da resposta da API");
    }

    console.log("Texto melhorado extraído com sucesso:", improvedText);
    return { improvedText, success: true };
  } catch (error) {
    console.error("Erro ao melhorar texto com API Gemini:", error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao processar sua solicitação com a IA.",
      variant: "destructive",
    });
    return { improvedText: "", success: false };
  }
};

// Mantemos a função mock como fallback caso haja problemas com a API
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

      console.log("Mock text improvement:", improvedText);
      resolve({ improvedText, success: true });
    }, 1000); // Simula o tempo de resposta da API
  });
};
