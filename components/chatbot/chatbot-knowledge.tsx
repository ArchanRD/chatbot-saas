"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { removeFileById, uploadFileEntry } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { Files } from "@/db/schema";

export function ChatbotKnowledge({ knowledgeBase, onRefresh }) {
  const [file, setFile] = useState<Files | null>(knowledgeBase);

  // Sync internal file state with prop
  useEffect(() => {
    setFile(knowledgeBase ?? null);
  }, [knowledgeBase]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data } = useSession();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!file) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (file) return; // Already have a file

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (file) return; // Already have a file

    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = async (file: File) => {
    // Check if file is PDF
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are supported",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 25MB",
        variant: "destructive",
      });
      return;
    }

    const filename =
      Math.random().toString(36).substring(2, 9) + "_" + file.name;

    /**
     * Upload file
     */
    const fileUploadResponse = await supabase.storage
      .from("file uploads")
      .upload("uploads/" + filename, file);

    /**
     * Create entry of the file in table
     */
    const fileEntryResponse = await uploadFileEntry(
      filename,
      data!.user!.orgId!,
      data!.user!.chatbotId!,
      fileUploadResponse.data!.path,
      "pdf"
    );

    if (fileEntryResponse.error) {
      toast({
        title: "Error",
        description: "Failed to upload file. System error.",
        variant: "destructive",
      });
    }

    toast({
      title: "File uploaded",
      description: "The file has been uploaded to your knowledge base",
    });
    onRefresh();
  };

  const removeFile = async () => {
    const removeFileResponse = await removeFileById(file!.id!, file!.url!);
    if (removeFileResponse.error) {
      toast({
        title: "Error",
        description: "Failed to remove file. System error.",
        variant: "destructive",
      });
    }
    toast({
      title: "File removed",
      description: "The file has been removed from your knowledge base",
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Knowledge Base</h2>
        <p className="text-sm text-gray-500">
          Upload a PDF document to train your chatbot with specific knowledge.
        </p>
      </div>

      {!file && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center",
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            className="hidden"
            accept=".pdf"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium">Upload PDF File</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Drag and drop your PDF file here, or click to browse. The file
              will be processed and added to your chatbot&apos;s knowledge base.
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              Select File
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Maximum file size: 25MB
            </p>
          </div>
        </div>
      )}

      {file && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-md border">
                <File className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>Uploaded {file.updated_at.toDateString()}</span>
                  <span>•</span>
                  <span className="uppercase">{file.type}</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
