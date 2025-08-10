'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { useRef, useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function Chat({ closeToggle }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Ref para o contêiner de mensagens
  const messagesEndRef = useRef(null);

  // Rola automaticamente para o final sempre que as mensagens mudarem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: updatedMessages }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    const assistantMessage = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMessage]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const cleanChunk = chunk.replace(/^"+|"+$/g, '');
      assistantMessage.content += cleanChunk;

      // Atualiza o último item (mensagem da IA) em tempo real
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { ...assistantMessage };
        return newMessages;
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="2xl:w-[440px] md:w-[340px] shadow-md">
      <CardHeader className="shadow-md mb-2 grid grid-cols-2 items-center">
        <CardTitle>Chat AI</CardTitle>
        <div className="flex justify-end">
          <a
            href="#"
            className="bg-transparent hover:text-slate-300 text-slate-600"
            onClick={closeToggle}
          >
            <X />
          </a>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] 2xl:h-[600px] w-[250px] md:w-full pr-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-slate-600 mb-4 ${message.role === 'user'
                ? 'flex-row-reverse text-right'
                : 'justify-start'
                }`}
            >
              {message.role === 'user' && (
                <Avatar>
                  <AvatarFallback>SM</AvatarFallback>
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
              )}

              {message.role === 'assistant' && (
                <Avatar className="flex-row-reverse">
                  <AvatarFallback>AI</AvatarFallback>
                  <AvatarImage src="images/droid.jpg" />
                </Avatar>
              )}

              <ReactMarkdown
                className="leading-relaxed"
                components={{
                  p: ({ children }) => (
                    <span className={`block text-sm text-slate-700 ${message.role === 'user' ? 'font-medium' : 'font-bold'}`}>
                      {children}
                    </span>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Como eu posso te ajudar?"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send size={28} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
