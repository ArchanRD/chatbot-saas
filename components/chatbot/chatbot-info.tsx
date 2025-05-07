import { Chatbot } from "@/db/schema";
import { Calendar, MessageSquare, Clock } from "lucide-react";

export function ChatbotInfo({ info }: { info: Chatbot }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Chatbot Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="font-medium">{info.name}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Welcome Message</label>
            <p className="font-medium">{info.welcome_mesg}</p>   
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Created At
            </label>
            <p>{info.created_at.toDateString()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Description
            </label>
            <p className="text-gray-700">{info.description}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last Updated
            </label>
            <p>{info.updated_at.toDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
