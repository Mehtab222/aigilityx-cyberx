import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConversXCore } from "@/components/dashboard/ConversXCore";

const ConversXPage = () => {
  return (
    <DashboardLayout
      title="ConversX Advisor"
      subtitle="Multi-modal conversation engine with voice, avatar, and multi-agent capabilities"
    >
      <div className="animate-fade-in">
        <ConversXCore />
      </div>
    </DashboardLayout>
  );
};

export default ConversXPage;
