import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Mic, Code } from "lucide-react";

interface Advisor {
  id: string;
  label: string;
  checked: boolean;
}

export function ConversXCore() {
  const [conversationTopic, setConversationTopic] = useState("");
  const [advisors, setAdvisors] = useState<Advisor[]>([
    { id: "ceo", label: "CEO Advisor", checked: false },
    { id: "cfo", label: "CFO Advisor", checked: false },
    { id: "cio", label: "CIO Advisor", checked: false },
  ]);

  const handleAdvisorChange = (id: string, checked: boolean) => {
    setAdvisors((prev) =>
      prev.map((advisor) =>
        advisor.id === id ? { ...advisor, checked } : advisor
      )
    );
  };

  const handleStartConversation = () => {
    const selectedAdvisors = advisors.filter((a) => a.checked);
    console.log("Starting conversation:", {
      topic: conversationTopic,
      advisors: selectedAdvisors.map((a) => a.label),
    });
    // TODO: Implement actual conversation start logic
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Multi-Agent Chat",
      description: "Interact with multiple AI personas in a single conversation",
    },
    {
      icon: Mic,
      title: "Voice I/O & Avatar Sync",
      description: "Voice interaction with synchronized avatar animations",
    },
    {
      icon: Code,
      title: "Prompt Engine",
      description: "Dynamic prompt injection and context management",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">ConversX Core</h2>
        <p className="text-muted-foreground mt-1">
          Multi-modal conversation engine with voice, avatar, and multi-agent capabilities
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-border hover:border-primary/50"
          >
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Multi-Agent Conversation Wizard */}
      <Card className="bg-card border border-border">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-semibold">
            Start a Multi-Agent Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conversation Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="conversation-topic" className="text-foreground font-medium">
              Conversation Topic
            </Label>
            <Input
              id="conversation-topic"
              placeholder="Enter topic for discussion"
              value={conversationTopic}
              onChange={(e) => setConversationTopic(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          {/* Advisor Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Select Advisors</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {advisors.map((advisor) => (
                <div key={advisor.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`advisor-${advisor.id}`}
                    checked={advisor.checked}
                    onCheckedChange={(checked) =>
                      handleAdvisorChange(advisor.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`advisor-${advisor.id}`}
                    className="text-foreground cursor-pointer"
                  >
                    {advisor.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Start Conversation Button */}
          <Button
            onClick={handleStartConversation}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!conversationTopic || !advisors.some((a) => a.checked)}
          >
            Start Conversation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
