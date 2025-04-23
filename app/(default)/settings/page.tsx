"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Palette, Ruler, Map as MapIcon, Database, Bell, Moon, Sun, BookUser,
  Thermometer, Eye, Mountain, Wind, Gauge, Clock
} from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"
import { PageHeader } from "@/components/ui/page-header"

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
        <PageHeader title="Settings" />
        
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-6">
            <TabsList className="flex flex-col h-auto justify-start p-2 bg-muted/30 rounded-lg w-full md:w-48">
              <TabsTrigger value="general" className="w-full justify-start text-sm px-3 py-2"><Palette className="h-4 w-4 mr-2"/> General</TabsTrigger>
              <TabsTrigger value="units" className="w-full justify-start text-sm px-3 py-2"><Ruler className="h-4 w-4 mr-2"/> Units</TabsTrigger>
              <TabsTrigger value="map" className="w-full justify-start text-sm px-3 py-2"><MapIcon className="h-4 w-4 mr-2"/> Map</TabsTrigger>
              <TabsTrigger value="briefing" className="w-full justify-start text-sm px-3 py-2"><BookUser className="h-4 w-4 mr-2"/> Briefing</TabsTrigger>
              <TabsTrigger value="data" className="w-full justify-start text-sm px-3 py-2"><Database className="h-4 w-4 mr-2"/> Data</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-14rem)] pr-4 -mr-4">
                <TabsContent value="general">
                  <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-1 py-2">
                      <CardTitle className="text-lg flex items-center"><Palette className="h-5 w-5 mr-2"/> General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="px-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <Label className="text-sm">Appearance Theme</Label>
                          <Select defaultValue="system">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="system"><Sun className="inline h-4 w-4 mr-2"/>/<Moon className="inline h-4 w-4 mr-2"/> System</SelectItem>
                              <SelectItem value="light"><Sun className="inline h-4 w-4 mr-2"/> Light</SelectItem>
                              <SelectItem value="dark"><Moon className="inline h-4 w-4 mr-2"/> Dark</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">Select your preferred interface theme.</p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notifications" className="text-sm">Weather Alerts</Label>
                            <p className="text-xs text-muted-foreground">Notify on new SIGMETs/AIRMETs for saved routes.</p>
                          </div>
                          <Switch id="notifications" defaultChecked />
                        </div>
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="save-plans" className="text-sm">Auto-Save Plans</Label>
                            <p className="text-xs text-muted-foreground">Automatically save recent flight plans.</p>
                          </div>
                          <Switch id="save-plans" defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="units">
                   <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-1 py-2">
                      <CardTitle className="text-lg flex items-center"><Ruler className="h-5 w-5 mr-2"/> Units Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="px-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-5">
                         <SettingSelect label="Temperature" description="Units for temperature display." icon={Thermometer}
                           options={[{value: 'C', label: 'Celsius (°C)'}, {value: 'F', label: 'Fahrenheit (°F)'}]} defaultValue="C"/>
                         <SettingSelect label="Visibility" description="Units for visibility reports." icon={Eye}
                           options={[{value: 'SM', label: 'Statute Miles (SM)'}, {value: 'KM', label: 'Kilometers (KM)'}, {value: 'M', label: 'Meters (M)'}]} defaultValue="SM"/>
                         <SettingSelect label="Wind Speed" description="Units for wind speed." icon={Wind}
                           options={[{value: 'KT', label: 'Knots (KT)'}, {value: 'MPS', label: 'Meters/sec (MPS)'}, {value: 'KPH', label: 'KM/Hour (KPH)'}]} defaultValue="KT"/>
                      </div>
                      <div className="space-y-5">
                         <SettingSelect label="Altitude" description="Units for altitude/elevation." icon={Mountain}
                           options={[{value: 'FT', label: 'Feet (FT)'}, {value: 'M', label: 'Meters (M)'}]} defaultValue="FT"/>
                         <SettingSelect label="Pressure" description="Units for altimeter/pressure." icon={Gauge}
                           options={[{value: 'inHg', label: 'Inches Hg (inHg)'}, {value: 'hPa', label: 'Hectopascals (hPa)'}]} defaultValue="inHg"/>
                         <SettingSelect label="Time Format" description="Preferred time display format." icon={Clock}
                           options={[{value: 'UTC', label: 'Zulu (UTC)'}, {value: 'LOCAL_12', label: 'Local (12-hr)'}, {value: 'LOCAL_24', label: 'Local (24-hr)'}]} defaultValue="UTC"/>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="map">
                   <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-1 py-2">
                      <CardTitle className="text-lg flex items-center"><MapIcon className="h-5 w-5 mr-2"/> Map Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="px-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <SettingSelect label="Map Style" description="Base layer for the map." 
                           options={[{value: 'default', label: 'Default Vector'}, {value: 'satellite', label: 'Satellite Imagery'}, {value: 'terrain', label: 'Terrain Shading'}]} defaultValue="default"/>
                        <div className="space-y-1.5">
                          <Label className="text-sm">Radar Opacity</Label>
                          <Slider defaultValue={[60]} max={100} step={5} />
                          <p className="text-xs text-muted-foreground">Adjust weather radar overlay transparency.</p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <SettingSwitch id="show-airways" label="Show Airways" description="Display VOR airways on map." defaultChecked={true} />
                        <SettingSwitch id="show-markers" label="Show Waypoint Markers" description="Display markers for route waypoints." defaultChecked={true} />
                        <SettingSwitch id="show-path" label="Show Flight Path" description="Draw the flight path line." defaultChecked={true} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="briefing">
                   <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-1 py-2">
                      <CardTitle className="text-lg flex items-center"><BookUser className="h-5 w-5 mr-2"/> Briefing Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="px-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <SettingSwitch id="brief-metar" label="Include METAR" description="Show METAR reports in briefing." defaultChecked={true} />
                        <SettingSwitch id="brief-taf" label="Include TAF" description="Show TAF reports in briefing." defaultChecked={true} />
                        <SettingSwitch id="brief-pirep" label="Include PIREPs" description="Show PIREPs in briefing." defaultChecked={true} />
                         <div className="space-y-1.5">
                          <Label className="text-sm">PIREP Max Age (minutes)</Label>
                          <Input type="number" defaultValue={90} min={15} step={15} className="w-24"/>
                          <p className="text-xs text-muted-foreground">Only show PIREPs newer than this age.</p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <SettingSwitch id="brief-sigmet" label="Include SIGMET/AIRMET" description="Show alerts in briefing." defaultChecked={true} />
                        <SettingSwitch id="brief-decoded" label="Show Decoded Reports" description="Attempt to decode raw weather text." defaultChecked={true} />
                        <SettingSwitch id="brief-recommendations" label="Show Recommendations" description="Include flight condition recommendations." defaultChecked={true} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="data">
                   <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-1 py-2">
                      <CardTitle className="text-lg flex items-center"><Database className="h-5 w-5 mr-2"/> Data Source Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="px-1 space-y-5">
                       <SettingSelect label="Primary Data Source" description="Source for METAR, TAF, etc." 
                         options={[{value: 'AWC', label: 'Aviation Weather Center (AWC)'}, {value: 'AVWX', label: 'AVWX (API Key Req)'}]} defaultValue="AWC"/>
                       <SettingSelect label="Data Refresh Interval" description="How often to check for new data." 
                         options={[{value: '5', label: '5 Minutes'}, {value: '10', label: '10 Minutes'}, {value: '15', label: '15 Minutes'}]} defaultValue="10"/>
                       <div className="space-y-1.5 pt-2">
                         <Label className="text-sm">Last data sync</Label>
                         <p className="text-sm text-muted-foreground">Today, 15:30 UTC (Simulated)</p>
                       </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface SettingSwitchProps {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function SettingSwitch({ id, label, description, defaultChecked }: SettingSwitchProps) {
  return (
    <div className="flex items-start justify-between space-x-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

interface SettingSelectProps {
  label: string;
  description: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  icon?: React.ElementType;
}

function SettingSelect({ label, description, options, defaultValue, icon: Icon }: SettingSelectProps) {
  return (
     <div className="space-y-1.5">
      <Label className="text-sm flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-1.5 text-muted-foreground"/>} {label}
      </Label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
} 