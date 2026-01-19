import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useAgents, AgentType } from "@/hooks/useAgents";

const agentTypes: { value: AgentType; label: string; description: string }[] = [
  { value: "vcompliance", label: "VCompliance", description: "Continuous compliance monitoring" },
  { value: "vaudit", label: "VAudit", description: "Automated audit trail analysis" },
  { value: "vrisk", label: "VRisk", description: "Real-time risk assessment" },
  { value: "vgovernance", label: "VGovernance", description: "Policy enforcement automation" },
];

export function CreateAgentDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AgentType | "">("");
  const [description, setDescription] = useState("");

  const { createAgent, isCreating } = useAgents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;

    try {
      await createAgent({
        name,
        type: type as AgentType,
        description: description || undefined,
      });
      setOpen(false);
      setName("");
      setType("");
      setDescription("");
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cyber">
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              Deploy a new AI agent to automate your security operations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                placeholder="e.g., Compliance Monitor Alpha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Agent Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as AgentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex flex-col">
                        <span>{t.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {t.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the agent's purpose and configuration..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" variant="cyber" disabled={isCreating || !name || !type}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Agent"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
