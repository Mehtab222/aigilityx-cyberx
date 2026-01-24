import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Send } from "lucide-react";

interface Advisor {
  id: string;
  name: string;
  role: string;
  title: string;
  selected: boolean;
  status: "Ready" | "Busy" | "Offline";
}

interface Message {
  id: string;
  type: "system" | "user" | "advisor";
  content: string;
  advisorName?: string;
  advisorRole?: string;
  timestamp: Date;
}

export function MultiAgentChat() {
  const [advisors, setAdvisors] = useState<Advisor[]>([
    { id: "aisha", name: "Aisha", role: "vCISO", title: "vCISO", selected: false, status: "Ready" },
    { id: "omar", name: "Omar", role: "vSOC Manager", title: "vSOC Manager", selected: false, status: "Ready" },
    { id: "sara", name: "Sara", role: "vCyberSec Auditor", title: "vCyberSec Auditor", selected: false, status: "Ready" },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "system",
      content: 'Welcome. Select advisors on the left, then ask a security question (e.g., "Draft an incident response plan for ransomware").',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdvisorToggle = (id: string, checked: boolean) => {
    setAdvisors((prev) =>
      prev.map((advisor) =>
        advisor.id === id ? { ...advisor, selected: checked } : advisor
      )
    );
  };

  const selectedAdvisors = advisors.filter((a) => a.selected);

  const generateMockResponse = (advisor: Advisor, question: string): string => {
    const responses: Record<string, string> = {
      aisha: `As your vCISO, I recommend a comprehensive approach to "${question.slice(0, 30)}...". We should align this with our risk management framework and ensure board-level visibility. I'll prepare an executive summary with key metrics and strategic recommendations.`,
      omar: `From the SOC perspective on "${question.slice(0, 30)}...", we need to focus on detection capabilities and incident response procedures. I'll coordinate with the team to ensure 24/7 monitoring coverage and establish clear escalation paths.`,
      sara: `Regarding compliance and audit considerations for "${question.slice(0, 30)}...", we must ensure proper documentation and control evidence. I'll review our current posture against relevant frameworks (NIST, ISO 27001) and identify any gaps.`,
    };
    return responses[advisor.id] || `[${advisor.name}] Response to: ${question}`;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || selectedAdvisors.length === 0) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate mock responses from each selected advisor
    await new Promise((resolve) => setTimeout(resolve, 800));

    const advisorResponses: Message[] = selectedAdvisors.map((advisor) => ({
      id: `${advisor.id}-${Date.now()}`,
      type: "advisor" as const,
      content: generateMockResponse(advisor, inputValue),
      advisorName: advisor.name,
      advisorRole: advisor.role,
      timestamp: new Date(),
    }));

    setMessages((prev) => [...prev, ...advisorResponses]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Multi-Agent Chat</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select one or more active advisors. This prototype returns a mock "panel response" per agent (replace with real orchestration later).
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          {/* Roster Panel */}
          <Card className="bg-background border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Roster</CardTitle>
              <p className="text-xs text-muted-foreground">
                Pick advisors to join the conversation.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {advisors.map((advisor) => (
                <div
                  key={advisor.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`roster-${advisor.id}`}
                    checked={advisor.selected}
                    onCheckedChange={(checked) =>
                      handleAdvisorToggle(advisor.id, checked as boolean)
                    }
                  />
                  <div className="flex-1 text-right">
                    <div className="font-medium text-foreground">{advisor.name}</div>
                    <div className="text-xs text-primary">{advisor.role}</div>
                    <div className="text-xs text-muted-foreground">{advisor.status}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Conversation Panel */}
          <Card className="bg-background border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Log */}
              <div className="h-[280px] overflow-y-auto space-y-3 pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : message.type === "advisor"
                          ? "bg-muted border border-border"
                          : "bg-info/20 text-info-foreground border border-info/30"
                      }`}
                    >
                      {message.type === "advisor" && (
                        <div className="text-xs font-semibold text-primary mb-1">
                          {message.advisorName} ({message.advisorRole})
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3 border border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        Advisors thinking...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || selectedAdvisors.length === 0}
                  className="flex-1 bg-background border-border"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading || selectedAdvisors.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Policy Note */}
              <p className="text-xs text-muted-foreground">
                Policy note: in real deployment, your Tool Proxy / Policy Gateway should enforce tool calls + approvals.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
