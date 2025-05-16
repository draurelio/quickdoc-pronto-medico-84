import React, { useState, useRef } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image as ImageIcon, FileText } from "lucide-react";

const GEMINI_API_KEY = "AIzaSyAo8qRthzx1-qAdkisrBpiG7ZnvtXeTOCo";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface Message {
  role: "user" | "ai";
  text: string;
  image?: string;
  document?: {
    name: string;
    type: string;
    content: string;
  };
}

export default function ChatDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; type: string; content: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        setSelectedDocument({
          name: file.name,
          type: file.type,
          content: content
        });
      };
      reader.readAsText(file);
    }
  };

  const formatConversationHistory = (messages: Message[]): string => {
    return messages.map(msg => {
      if (msg.role === "user") {
        let text = `Usuário: ${msg.text}`;
        if (msg.image) text += " [Enviou uma imagem]";
        if (msg.document) text += ` [Enviou um documento: ${msg.document.name}]`;
        return text;
      } else {
        return `IA: ${msg.text}`;
      }
    }).join("\n");
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage && !selectedDocument) return;
    
    const userMessage: Message = { 
      role: "user", 
      text: input,
      image: selectedImage || undefined,
      document: selectedDocument || undefined
    };
    
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setSelectedImage(null);
    setSelectedDocument(null);
    setLoading(true);

    try {
      const conversationHistory = formatConversationHistory(messages);
      let prompt = conversationHistory 
        ? `${conversationHistory}\n\nUsuário: ${userMessage.text}`
        : `Usuário: ${userMessage.text}`;

      if (userMessage.image) prompt += " [Enviou uma imagem]";
      if (userMessage.document) {
        prompt += ` [Enviou um documento: ${userMessage.document.name}]\n\nConteúdo do documento:\n${userMessage.document.content}`;
      }
      prompt += "\n\nIA:";

      const response = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [
              { text: prompt },
              ...(userMessage.image ? [{ inlineData: { mimeType: "image/jpeg", data: userMessage.image.split(',')[1] } }] : [])
            ] 
          }],
        }),
      });
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[Sem resposta da IA]";
      setMessages((msgs) => [...msgs, { role: "ai", text: aiText }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: "ai", text: "[Erro ao conectar à IA]" }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent 
        className="fixed bottom-4 right-4 max-w-md w-full sm:w-[350px] h-[500px] flex flex-col z-50 rounded-xl shadow-2xl border bg-background p-0 animate-in fade-in"
        style={{ left: 'unset', top: 'unset' }}
      >
        <DrawerHeader className="flex flex-row items-center justify-between border-b p-4">
          <DrawerTitle className="text-sm font-medium">Chat com IA</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label="Fechar chat">
              ×
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted" style={{ minHeight: 0 }}>
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-xs">Inicie uma conversa com a IA!</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-3 py-2 max-w-xs text-xs ${msg.role === "user" ? "bg-medblue-100 text-medblue-900" : "bg-white text-gray-800 border"}`}>
                {msg.image && (
                  <img src={msg.image} alt="Imagem enviada" className="max-w-full h-auto rounded mb-2" />
                )}
                {msg.document && (
                  <div className="mb-2 p-2 bg-gray-50 rounded">
                    <FileText className="w-4 h-4 inline mr-1" />
                    <span className="text-xs">{msg.document.name}</span>
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2 bg-background sticky bottom-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={documentInputRef}
            onChange={handleDocumentSelect}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => documentInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
          >
            <FileText className="w-4 h-4" />
          </Button>
          {selectedImage && (
            <div className="relative">
              <img src={selectedImage} alt="Preview" className="h-8 w-8 object-cover rounded" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}
          {selectedDocument && (
            <div className="relative">
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                <FileText className="w-3 h-3" />
                <span className="text-xs truncate max-w-[100px]">{selectedDocument.name}</span>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 text-xs"
            autoFocus
          />
          <Button onClick={sendMessage} disabled={loading || (!input.trim() && !selectedImage && !selectedDocument)} size="sm">
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 