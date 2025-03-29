"use client";

import { useState } from "react";
import { Mail, Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ShowMembersModal({ collaborators, isOpen, setIsOpen }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter members based on search term
  const filteredMembers = collaborators.filter(
    (member) =>
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort members based on username
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortDirection === "asc") {
      return a.username.localeCompare(b.username);
    } else {
      return b.username.localeCompare(a.username);
    }
  });

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  if(collaborators.length == 0){
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-black font-inter">
                No members found
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-black">
            Members List
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search members..."
            className="pl-8 border-blue-200 focus:border-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-medium text-black">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers &&
                  filteredMembers.map((member, index) => (
                    <tr
                      key={index}
                      className={`
                      ${index % 2 === 0 ? "bg-white" : "bg-blue-50/50"}
                      hover:bg-blue-100/50 transition-colors
                    `}
                    >
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-blue-500" />
                          {member.email}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {collaborators && (
          <div className="mt-4 text-right">
            <span className="text-sm text-gray-500">
              Showing {filteredMembers.length} of {collaborators.length} members
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
