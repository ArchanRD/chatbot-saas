import { Building2, Palette, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function BrandProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Brand Profile</h2>
            <p className="text-sm text-muted-foreground">Select the brand you are briefing for</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
            <span className="text-white text-xs font-bold">BROYA</span>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Bro-Yah Living</div>
            <div className="font-semibold">Broya Living</div>
            <div className="text-sm text-muted-foreground">Wellness / CPG</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {['at', 'twitter', 'tiktok', 'linkedin', 'instagram', 'youtube'].map((platform) => (
            <Button key={platform} variant="ghost" size="icon" className="h-8 w-8">
              <img
                src={`/placeholder.svg?height=16&width=16&text=${platform}`}
                alt={platform}
                className="h-4 w-4"
              />
            </Button>
          ))}
          <Button variant="outline" className="ml-4">Change profile</Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <div className="text-sm text-muted-foreground">
            <Palette className="h-4 w-4 inline mr-1" />
            Brand Colors
          </div>
          <div className="flex gap-2">
            {[
              { color: '#B0352F', label: 'Primary' },
              { color: '#221F20', label: 'Secondary' },
              { color: '#F0D6AB', label: 'Accent 1' },
              { color: '#ADC35D', label: 'Accent 2' },
            ].map((item) => (
              <div key={item.color} className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded-full border"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.color}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <div className="text-sm text-muted-foreground">
            <FileText className="h-4 w-4 inline mr-1" />
            Guidelines Doc
          </div>
          <a
            href="drive.google.com/58us1Sdfz..."
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            drive.google.com/58us1Sdfz...
          </a>
        </div>
      </div>
    </div>
  )
}

