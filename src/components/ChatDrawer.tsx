import React, { useState, useRef } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const GEMINI_API_KEY = "AIzaSyAo8qRthzx1-qAdkisrBpiG7ZnvtXeTOCo";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function ChatDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage.text }] }],
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
          <DrawerTitle>Chat com IA</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label="Fechar chat">
              ×
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted" style={{ minHeight: 0 }}>
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground">Inicie uma conversa com a IA!</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-3 py-2 max-w-xs ${msg.role === "user" ? "bg-medblue-100 text-medblue-900" : "bg-white text-gray-800 border"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2 bg-background sticky bottom-0">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1"
            autoFocus
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 