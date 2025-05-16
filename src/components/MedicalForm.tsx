import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FilePlus, Wand2, Mic } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import MedicalModelsModal from './medical/MedicalModelsModal';
import { improveTextWithAI, mockImproveText } from '@/utils/aiTextUtils';
import axios from "axios";

export interface MedicalFormData {
  admission: string;
  comorbidities: string;
  medicationReason: string;
  physicalExam: string;
  analysis: string;
  plans: string;
}

interface MedicalFormProps {
  onDataChange: (data: MedicalFormData) => void;
}

const ASSEMBLYAI_API_KEY = "5749f2947b544ff89f8dad00858f287b";
const BASE_URL = "https://api.assemblyai.com/v2";

function AudioToTextButton({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [recording, setRecording] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setLoading(true);
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        try {
          // 1. Upload audio
          const uploadRes = await axios.post(
            `${BASE_URL}/upload`,
            audioBlob,
            {
              headers: {
                authorization: ASSEMBLYAI_API_KEY,
                "content-type": "application/octet-stream",
              },
            }
          );
          const audioUrl = uploadRes.data.upload_url;
          // 2. Request transcription
          const transcriptRes = await axios.post(
            `${BASE_URL}/transcript`,
            { audio_url: audioUrl },
            { headers: { authorization: ASSEMBLYAI_API_KEY } }
          );
          const transcriptId = transcriptRes.data.id;
          // 3. Polling
          let completed = false;
          while (!completed) {
            await new Promise((res) => setTimeout(res, 3000));
            const pollRes = await axios.get(
              `${BASE_URL}/transcript/${transcriptId}`,
              { headers: { authorization: ASSEMBLYAI_API_KEY } }
            );
            if (pollRes.data.status === "completed") {
              onChange((value ? value + " " : "") + pollRes.data.text);
              completed = true;
            } else if (pollRes.data.status === "error") {
              alert("Erro na transcrição: " + pollRes.data.error);
              completed = true;
            }
          }
        } catch (err) {
          alert("Erro ao transcrever áudio");
        }
        setLoading(false);
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert("Microfone não encontrado ou permissão negada. Verifique as configurações do navegador e tente novamente.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={recording ? "bg-red-100 border-red-300 text-red-700" : "bg-blue-50 border-blue-200 text-blue-600"}
      onClick={recording ? stopRecording : startRecording}
      disabled={loading}
      title={recording ? "Parar gravação" : "Gravar áudio"}
      style={{ marginLeft: 8 }}
    >
      <Mic className="h-4 w-4" />
      <span className="sr-only">Microfone</span>
    </Button>
  );
}

const MedicalForm: React.FC<MedicalFormProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState<MedicalFormData>({
    admission: '',
    comorbidities: '',
    medicationReason: '',
    physicalExam: '',
    analysis: '',
    plans: '',
  });

  const [improvedTexts, setImprovedTexts] = useState<Partial<MedicalFormData>>({});
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState<keyof MedicalFormData | null>(null);
  const [isImproving, setIsImproving] = useState<keyof MedicalFormData | null>(null);

  const handleChange = (field: keyof MedicalFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onDataChange(updatedData);
  };

  const openModelModal = (field: keyof MedicalFormData) => {
    setCurrentField(field);
    setIsModelModalOpen(true);
  };

  const handleApplyModel = (field: keyof MedicalFormData, content: string) => {
    handleChange(field, content);
    setIsModelModalOpen(false);
  };

  const improveText = async (field: keyof MedicalFormData) => {
    if (!formData[field].trim()) {
      toast({
        title: "Texto vazio",
        description: "Por favor, insira algum texto para melhorar.",
        variant: "destructive",
      });
      return;
    }

    setIsImproving(field);
    console.log(`Tentando melhorar texto para o campo: ${field}`);
    
    try {
      // Tente primeiro a API real Gemini
      console.log("Chamando a API Gemini para melhoria de texto");
      const result = await improveTextWithAI(formData[field]);
      
      if (result.success && result.improvedText) {
        console.log("Texto melhorado com sucesso:", result.improvedText);
        setImprovedTexts((prev) => ({ ...prev, [field]: result.improvedText }));
        
        toast({
          title: "Texto melhorado",
          description: "O texto foi melhorado com sucesso pela IA!",
        });
      } else {
        // Se a API falhar, tente o mock como fallback
        console.log("API falhou, usando fallback mock");
        const mockResult = await mockImproveText(formData[field]);
        
        if (mockResult.success) {
          console.log("Texto melhorado com mock:", mockResult.improvedText);
          setImprovedTexts((prev) => ({ ...prev, [field]: mockResult.improvedText }));
          
          toast({
            title: "Texto melhorado (modo offline)",
            description: "O texto foi melhorado com nosso sistema local.",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao melhorar texto:", error);
      
      // Tente o mock como última opção
      try {
        console.log("Erro na API real, tentando mock como último recurso");
        const mockResult = await mockImproveText(formData[field]);
        if (mockResult.success) {
          setImprovedTexts((prev) => ({ ...prev, [field]: mockResult.improvedText }));
          
          toast({
            title: "Texto melhorado (modo offline)",
            description: "O texto foi melhorado com nosso sistema local.",
          });
        }
      } catch (mockError) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao melhorar o texto. Tente novamente mais tarde.",
          variant: "destructive",
        });
        console.error("Erro no fallback mock:", mockError);
      }
    } finally {
      setIsImproving(null);
    }
  };

  const fieldLabels: Record<keyof MedicalFormData, string> = {
    admission: 'Admissão',
    comorbidities: 'Comorbidades',
    medicationReason: 'MUC (Medicação de uso contínuo)',
    physicalExam: 'Exame Físico',
    analysis: 'Análise',
    plans: 'Condutas'
  };

  const renderField = (field: keyof MedicalFormData) => (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-1">
        <Label htmlFor={field} className="text-sm font-medium block">
          {fieldLabels[field]}
        </Label>
        <div className="flex gap-2">
          {field === 'admission' && (
            <AudioToTextButton value={formData.admission} onChange={v => handleChange('admission', v)} />
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-gradient-to-r from-purple-50 to-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
            onClick={() => improveText(field)}
            disabled={isImproving !== null}
          >
            <Wand2 className="h-3.5 w-3.5 mr-1" /> 
            {isImproving === field ? 'Melhorando...' : 'Melhorar texto'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-medblue-50 border-medblue-200 text-medblue-600 hover:bg-medblue-100"
            onClick={() => openModelModal(field)}
          >
            <FilePlus className="h-3.5 w-3.5 mr-1" /> Modelos
          </Button>
        </div>
      </div>
      <Textarea 
        id={field}
        rows={3}
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={`Insira ${fieldLabels[field].toLowerCase()} aqui...`}
        className="min-h-[120px] w-full"
      />
      
      {improvedTexts[field] && (
        <div className="mt-3 p-3 border border-green-200 bg-green-50 rounded-md">
          <div className="mb-1 flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs font-medium text-green-700">Texto melhorado pela IA</span>
          </div>
          <p className="text-sm text-gray-700">{improvedTexts[field]}</p>
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
              onClick={() => handleChange(field, improvedTexts[field] || '')}
            >
              Aplicar texto melhorado
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-medblue-600">Admissão Médica e Evolução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {renderField('admission')}
            {renderField('comorbidities')}
            {renderField('medicationReason')}
            {renderField('physicalExam')}
            {renderField('analysis')}
            {renderField('plans')}
          </div>
        </CardContent>
      </Card>

      <MedicalModelsModal 
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        currentField={currentField}
        fieldValue={currentField ? formData[currentField] : ''}
        onApplyModel={handleApplyModel}
      />
    </>
  );
};

export default MedicalForm;
