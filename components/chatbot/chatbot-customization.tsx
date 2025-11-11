import { Chatbot } from "@/db/schema";
import { Sparkles, MessageCircle, Upload, X, MessageSquare } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ChatbotCustomizationProps {
  info?: Chatbot;
  onUpdate?: (data: Partial<Chatbot>) => Promise<void>;
}

export function ChatbotCustomization({ info, onUpdate }: ChatbotCustomizationProps) {
  const [tone, setTone] = useState(info?.tone || "friendly");
  const [answerStyle, setAnswerStyle] = useState(info?.answer_style || "concise");
  const [welcomeMessage, setWelcomeMessage] = useState(info?.welcome_mesg || "Hey! How can I help you?");
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(info?.logo_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !info?.id) return;
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Logo image must be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatbotId', info.id);
      
      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }
      
      const data = await response.json();
      setLogoUrl(data.logoUrl);
      
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveLogo = async () => {
    if (!info?.id || !onUpdate) return;
    
    setIsLoading(true);
    try {
      await onUpdate({
        logo_url: null
      });
      setLogoUrl("");
      toast({
        title: "Success",
        description: "Logo removed successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove logo",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    setIsLoading(true);
    try {
      await onUpdate({
        tone,
        answer_style: answerStyle,
        welcome_mesg: welcomeMessage
      });
      toast({
        title: "Success",
        description: "Customization settings saved successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customization settings",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Chatbot Customization</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Tone of Chatbot
            </Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Choose how your chatbot should sound when interacting with users.
            </p>
          </div>

          <div className="space-y-2 mt-6">
            <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Chatbot Logo
            </Label>
            <Card className="p-4 border border-gray-200 rounded-md">
              <div className="flex flex-col items-center space-y-4">
                {logoUrl ? (
                  <div className="relative">
                    <div className="w-[60px] h-[60px] rounded-md overflow-hidden relative">
                      <img 
                        src={logoUrl} 
                        alt="Chatbot Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveLogo}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-[60px] h-[60px] bg-gray-100 rounded-md flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                
                <div className="flex flex-col items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mb-1"
                  >
                    {isUploading ? "Uploading..." : "Upload Logo"}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Recommended size: 60x60px
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Welcome Message
            </Label>
            <Textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Enter a welcome message for your chatbot"
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-500">
              This is the first message users will see when they open the chat.
            </p>
          </div>

          <div className="space-y-2 mt-6">
            <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Answer Style
            </Label>
            <Select value={answerStyle} onValueChange={setAnswerStyle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select answer style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Determine how detailed or brief your chatbot&apos;s responses should be.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Saving..." : "Save Customization"}
        </Button>
      </div>
    </div>
  );
}
