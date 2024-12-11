"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "./ui/spinner";
import { redirect } from "next/navigation";
import { uploadFileEntry } from "@/lib/actions";
import { DialogDescription } from "@radix-ui/react-dialog";

export function UploadFile({ open, onOpenChange, orgDetails, chatbotId }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isOrgDetailsAvailable, setIsOrgDetailsAvailable] = useState(true);

  useEffect(() => {
    setIsOrgDetailsAvailable(true);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
    },
    maxSize: 25 * 1024 * 1024, // 25MB
    multiple: false,
  });

  const handleFileSubmit = async () => {
    if (file) {
      try {
        setUploadLoading(true);
        const path = `uploads/${file.name}`;
        const { error } = await supabase.storage
          .from("file uploads")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast({
            // @ts-expect-error: Supabase error object might not be typed correctly

            title: error.error,
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        await uploadFileEntry(
          file.name,
          orgDetails.orgId,
          chatbotId,
          path,
          file.type
        );
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploadLoading(false);
      }
    }
  };

  if (!isOrgDetailsAvailable) {
    return (
      <Dialog open>
        <DialogContent className="sm:max-w-[425px] font-poppins">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600">
              Your organisation id is not set
            </DialogTitle>
            <DialogDescription>
              Visit the dashboard page to set automatically. If you have not
              created the organisation then create and try again.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => redirect("/dashboard")}>
            Visit dashboard
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Upload file</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drag and Drop file here or{" "}
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Choose file
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Supported formats: TXT, PDF</span>
            <span>Maximum size: 25MB</span>
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileIcon className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div></div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleFileSubmit} size="sm" disabled={!file}>
                {uploadLoading ? <Spinner className="text-white" /> : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
