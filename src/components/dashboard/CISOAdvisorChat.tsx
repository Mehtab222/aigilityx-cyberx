import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Volume2, Copy, Send, Mic, Paperclip, Square, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "advisor";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export function CISOAdvisorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Attempt to connect to backend API
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error("Backend connection failed");
      }

      const data = await response.json();
      
      const advisorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "advisor",
        content: data.response || "Response received successfully.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, advisorMessage]);
    } catch (error) {
      // Handle backend connection error gracefully
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "advisor",
        content: "I encountered an error. Please verify the backend is running on port 8000 and try again.",
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  const handleListen = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser",
      });
    }
  };

  const suggestedPrompts = [
    "How should I respond to an active ransomware incident?",
    "Explain NIST CSF 2.0 framework requirements",
    "Generate a risk assessment report template",
    "What are the key SOC 2 Type II controls?",
  ];

  return (
    <div className="flex flex-col h-[600px] rounded-xl overflow-hidden border border-border bg-card">
      {/* Header */}
      <div 
        className="px-6 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, hsl(252 65% 50%) 0%, hsl(217 91% 60%) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AlgilityX CISOs Advisor</h2>
            <p className="text-sm text-white/80">AI-Powered Cybersecurity Co-Pilot</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}
            style={{ boxShadow: isOnline ? '0 0 8px hsl(142 76% 45% / 0.6)' : undefined }}
          />
          <span className="text-sm text-white/90">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Ask me anything about cybersecurity, incident response, compliance, or risk management.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(prompt)}
                  className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "user" ? (
              <div 
                className="max-w-[70%] px-4 py-3 rounded-2xl text-white"
                style={{
                  background: "linear-gradient(135deg, hsl(252 65% 50%) 0%, hsl(252 65% 45%) 100%)",
                }}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ) : (
              <div className="max-w-[80%] space-y-2">
                {isLoading && messages[messages.length - 1]?.id === message.id && (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-muted w-fit">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <p className={`text-sm ${message.isError ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {message.content}
                  </p>
                </div>
                <div className="flex items-center gap-3 px-2">
                  <button
                    onClick={() => handleListen(message.content)}
                    className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    Listen
                  </button>
                  <button
                    onClick={() => handleCopy(message.content)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator when loading */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 px-4 py-3 rounded-full bg-muted">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-card border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-10 w-10 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question here..."
              className="pr-4 bg-muted border-none rounded-full h-10 text-sm placeholder:text-muted-foreground"
              disabled={isLoading}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80"
          >
            <Paperclip className="h-4 w-4 text-secondary-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-10 w-10 rounded-full bg-destructive/80 hover:bg-destructive"
          >
            <Square className="h-4 w-4 text-white" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="shrink-0 h-10 w-10 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
