"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "../ui/toast";
import { ToastProvider } from "@radix-ui/react-toast";

const chatbotFormSchema = z.object({
  name: z.string().min(2, {
    message: "Chatbot name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  welcomeMessage: z.string().min(5, {
    message: "Welcome message must be at least 5 characters.",
  }),
  orgId: z
    .string()
    .nonempty({ message: "Select your organisation" })
    .refine((val) => val !== "Select your organisation", {
      message: "Invalid orgnanisation selected",
    }),
});

type ChatbotFormValues = z.infer<typeof chatbotFormSchema>;

const defaultValues: Partial<ChatbotFormValues> = {
  name: "",
  description: "",
  welcomeMessage: "",
  orgId: "",
};

export function ChatbotModal({ orgName, orgId }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast()
  const form = useForm<ChatbotFormValues>({
    resolver: zodResolver(chatbotFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ChatbotFormValues) {
    const res = await fetch("/api/chatbot/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    if (res.status == 200) {
      toast({
        title: "Chatbot created!",
        description: `${res.message}`,
      });
    }else{
      toast({
        title: "Failed",
        description: `${res.message}`,
        variant:"destructive"
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Chatbot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Chatbot</DialogTitle>
          <DialogDescription>
            Set up your new chatbot here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Chatbot" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your chatbot&apos;s display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="This chatbot helps with..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe what your chatbot does.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="welcomeMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hello! How can I assist you today?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The first message your chatbot will send.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orgId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select organisation</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-auto">
                      <SelectValue placeholder="Select your organisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={orgId}>{orgName}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormMessage />
            <DialogFooter>
              <Button type="submit">Save Chatbot</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <ToastProvider>
        <Toast />
      </ToastProvider>
    </Dialog>
  );
}
