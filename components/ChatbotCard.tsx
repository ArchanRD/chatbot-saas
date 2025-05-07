"use client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Bot } from "lucide-react";
import { Chatbot } from "@/db/schema";

const ChatbotCard = ({ chatbot }: { chatbot: Chatbot }) => {
  return (
    <div className="flex gap-5 items-center font-poppins">
      <Card className="w-full max-w-xl !rounded-2xl !border-none !shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Bot fontVariant="outline" className="text-xs font-normal" />
            <h1 className="font-medium">Chabot details</h1>
          </div>
        </CardHeader>
        <hr />
        <CardContent className="space-y-4 p-6">
          <div className="">
            <div>
              <div className="font-medium mb-1 ml-2">Name</div>
              <div className="text-gray-700 bg-gray-50 border border-gray-50 hover:border-gray-300 transition-all ease-in-out p-3 rounded-lg w-full">
                {chatbot.name}
              </div>
            </div>
            <div className="mt-3">
              <div className="font-medium mb-1 ml-2">Description</div>
              <div className="text-gray-700 bg-gray-50 border border-gray-50 hover:border-gray-300 transition-all ease-in-out p-3 rounded-lg w-full">
                {chatbot.description}
              </div>
            </div>
            <div className="mt-3">
              <div className="font-medium mb-1 ml-2">
                Add Website Domain
              </div>
              <input type="text" className="text-gray-700 bg-gray-50 border border-gray-50 hover:border-gray-300 transition-all ease-in-out p-3 rounded-lg w-full" />
            </div>
            <hr className="my-4" />

            <div className="flex flex-wrap items-center gap-2">
              <div className=" bg-slate-100 p-2 border border-slate-50 hover:border-slate-300 transition-all ease-in-out w-36 rounded-xl">
                <div className="font-medium mb-1 ml-2">Created at</div>
                <div className="text-slate-700  p-3 rounded-lg w-full">
                  {chatbot.created_at.toDateString()}
                </div>
              </div>
              <div className=" bg-slate-100 p-2 border border-slate-50 hover:border-slate-300 transition-all ease-in-out w-36 rounded-xl">
                <div className="font-medium mb-1 ml-2">Updated at</div>
                <div className="text-slate-700  p-3 rounded-lg w-full">
                  {chatbot.updated_at.toDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotCard;
