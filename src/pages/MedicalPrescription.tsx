
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface PrescriptionData {
  patientName: string;
  medication: string;
  posology: string;
}

const MedicalPrescription = () => {
  const [formData, setFormData] = useState<PrescriptionData>({
    patientName: '',
    medication: '',
    posology: ''
  });

  const handleInputChange = (field: keyof PrescriptionData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePrescription = async () => {
    if (!formData.patientName || !formData.medication || !formData.posology) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de gerar a receita.",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "RECEITA MÉDICA",
              heading: HeadingLevel.HEADING_1,
              alignment: "center",
              spacing: {
                after: 400
              }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Paciente: ",
                  bold: true,
                }),
                new TextRun(formData.patientName)
              ],
              spacing: {
                after: 200
              }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Medicação: ",
                  bold: true,
                }),
                new TextRun(formData.medication)
              ],
              spacing: {
                after: 200
              }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Posologia: ",
                  bold: true,
                }),
                new TextRun(formData.posology)
              ],
              spacing: {
                after: 400
              }
            }),

            new Paragraph({
              text: `Data: ${new Date().toLocaleDateString('pt-BR')}`,
              spacing: {
                before: 400
              }
            }),
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const fileName = `Receita_${formData.patientName.replace(/\s+/g, '_')}.docx`;
      saveAs(blob, fileName);

      toast({
        title: "Sucesso!",
        description: "Receita médica gerada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar receita:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar a receita. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-medblue-600 mb-2">Receita Médica</h1>
        <p className="text-gray-600">Preencha os dados para gerar uma receita médica</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-medblue-600">Dados da Receita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientName">Nome do Paciente</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => handleInputChange('patientName', e.target.value)}
              placeholder="Digite o nome completo do paciente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medication">Medicação</Label>
            <Textarea
              id="medication"
              value={formData.medication}
              onChange={(e) => handleInputChange('medication', e.target.value)}
              placeholder="Digite a medicação prescrita"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="posology">Posologia</Label>
            <Textarea
              id="posology"
              value={formData.posology}
              onChange={(e) => handleInputChange('posology', e.target.value)}
              placeholder="Digite a posologia (como tomar, frequência, duração, etc.)"
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={generatePrescription}
            className="bg-medblue-600 hover:bg-medblue-700 text-lg py-6 w-full"
            size="lg"
          >
            <FileText className="mr-2" />
            Gerar Receita
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalPrescription;
