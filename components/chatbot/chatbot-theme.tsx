import { Chatbot } from "@/db/schema";

// Define theme interface
interface ThemeOptions {
  primary_color: string;
  text_color: string;

  font_size: string;
  border_radius: number;
  chat_position: string;
}

type ChatbotWithTheme = Chatbot & {
  theme?: {
    primary_color?: string;
    text_color?: string;

    font_size?: string;
    border_radius?: number;
    chat_position?: string;
  };
}
import { Palette, Layout, Type, Circle, Save, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface ChatbotThemeProps {
  info?: ChatbotWithTheme;
  onUpdate?: (data: Partial<Chatbot>) => Promise<void>;
}

export function ChatbotTheme({ info, onUpdate }: ChatbotThemeProps): React.ReactNode {
  // Default theme values
  const defaultTheme: ThemeOptions = {
    primary_color: "#4F46E5",
    text_color: "#1F2937",

    font_size: "medium",
    border_radius: 8,
    chat_position: "bottom-right"
  };

  // Theme state variables
  const [primaryColor, setPrimaryColor] = useState(info?.theme?.primary_color || defaultTheme.primary_color);
  const [textColor, setTextColor] = useState(info?.theme?.text_color || defaultTheme.text_color);

  const [fontSize, setFontSize] = useState(info?.theme?.font_size || defaultTheme.font_size);
  const [borderRadius, setBorderRadius] = useState(info?.theme?.border_radius || defaultTheme.border_radius);
  const [chatPosition, setChatPosition] = useState(info?.theme?.chat_position || defaultTheme.chat_position);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles saving the theme settings to the database
   * Validates inputs and formats data before sending to the server
   */
  const handleSave = async () => {
    // Check if onUpdate function is provided
    if (!onUpdate) {
      console.error("No update function provided");
      toast({
        title: "Error",
        description: "Unable to save theme settings: missing update handler",
        variant: "destructive"
      });
      return;
    }
    
    // Validate inputs
    if (!primaryColor || !textColor || !fontSize) {
      toast({
        title: "Error",
        description: "Please fill in all required theme settings",
        variant: "destructive"
      });
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Format the theme data
      const themeData = {
        theme: {
          primary_color: primaryColor,
          text_color: textColor,

          font_size: fontSize,
          border_radius: borderRadius,
          chat_position: chatPosition
        }
      };
      
      // Send data to the server
      await onUpdate(themeData);
      
      // Show success message
      toast({
        title: "Success",
        description: "Theme settings saved successfully",
        variant: "default"
      });
    } catch (error) {
      // Handle errors
      toast({
        title: "Error",
        description: "Failed to save theme settings",
        variant: "destructive"
      });
      console.error("Error saving theme settings:", error);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  // Preview component to show how the chatbot will look
  const ChatbotPreview = () => (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="text-center mb-4 text-sm text-gray-500">Preview</div>
      <div 
        className="border shadow-sm rounded-lg overflow-hidden"
        style={{ 
          borderRadius: `${borderRadius}px`,

        }}
      >
        <div 
          className="p-3 flex items-center justify-between"
          style={{ backgroundColor: primaryColor, color: textColor }}
        >
          <div className="font-medium">Chatbot</div>
          <button className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="bg-white p-3" style={{ fontSize: fontSize === "small" ? "0.875rem" : fontSize === "large" ? "1.125rem" : "1rem" }}>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="bg-gray-100 p-2 rounded-lg max-w-[80%]" style={{ borderRadius: `${Math.max(borderRadius - 2, 4)}px` }}>
                Hello! How can I help you today?
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div 
                className="p-2 rounded-lg max-w-[80%]" 
                style={{ 
                  backgroundColor: primaryColor, 
                  color: textColor,
                  borderRadius: `${Math.max(borderRadius - 2, 4)}px`
                }}
              >
                I have a question about your services.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400 text-center">
        Position: {chatPosition}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Chatbot Theme</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium">Colors</h3>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Primary Color
              </Label>
              <div className="flex items-center gap-2">
                <div 
                  className="h-6 w-6 rounded-full border"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                This color will be used for the chatbot header and user messages.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Text Color
              </Label>
              <div className="flex items-center gap-2">
                <div 
                  className="h-6 w-6 rounded-full border"
                  style={{ backgroundColor: textColor }}
                ></div>
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                This color will be used for text in messages and on primary color backgrounds.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Type className="h-4 w-4" />
                Font Size
              </Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium">Layout</h3>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Circle className="h-4 w-4" />
                Border Radius
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[borderRadius]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(value) => setBorderRadius(value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{borderRadius}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Chat Position
              </Label>
              <Select value={chatPosition} onValueChange={setChatPosition}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select chat position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ChatbotPreview />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving Theme Settings...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Theme Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
