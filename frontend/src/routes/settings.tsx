import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard } from "@/components/widgets";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — SokoPulse AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [confidence, setConfidence] = useState([85]);
  const [autopilot, setAutopilot] = useState(false);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <PageHeader title="Settings" description="Manage your account, organization, AI thresholds, and integrations." />

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="ai">AI Automation</TabsTrigger>
          <TabsTrigger value="notify">Notifications</TabsTrigger>
          <TabsTrigger value="competitor">Competitors</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <SectionCard title="User Profile" description="Personal account information.">
            <Field label="Full name" defaultValue="David Chen" />
            <Field label="Email" type="email" defaultValue="david@sokopulse.ai" />
            <Field label="Role" defaultValue="Regional Director" />
            <Save />
          </SectionCard>
        </TabsContent>

        <TabsContent value="org">
          <SectionCard title="Organization" description="Company details and locale.">
            <Field label="Organization name" defaultValue="SokoPulse Demo Co." />
            <Field label="Industry" defaultValue="Industrial Distribution" />
            <Field label="Default currency" defaultValue="USD" />
            <Field label="Timezone" defaultValue="UTC+03:00 — Nairobi" />
            <Save />
          </SectionCard>
        </TabsContent>

        <TabsContent value="ai">
          <SectionCard title="AI Automation Thresholds" description="Control when SokoPulse auto-executes vs. recommends.">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Auto-approve recommendations above confidence</Label>
                <span className="font-mono text-sm">{confidence[0]}%</span>
              </div>
              <Slider value={confidence} onValueChange={setConfidence} min={50} max={100} step={1} />
            </div>
            <Separator />
            <Toggle
              label="Autopilot mode"
              desc="Automatically execute critical replenishments when confidence ≥ threshold."
              checked={autopilot}
              onChange={setAutopilot}
            />
            <Toggle label="Auto-apply pricing adjustments" desc="≤ 5% changes are applied automatically." defaultChecked />
            <Toggle label="Auto-create POs for critical stock-outs" desc="Requires verified supplier match." />
            <Save />
          </SectionCard>
        </TabsContent>

        <TabsContent value="notify">
          <SectionCard title="Notification Preferences">
            <Toggle label="Email — critical alerts" defaultChecked />
            <Toggle label="Email — daily digest" defaultChecked />
            <Toggle label="In-app — pricing recommendations" defaultChecked />
            <Toggle label="SMS — supplier delays" />
            <Toggle label="Slack — demand spikes" defaultChecked />
            <Save />
          </SectionCard>
        </TabsContent>

        <TabsContent value="competitor">
          <SectionCard title="Competitor Tracking" description="Configure scraping cadence and target sources.">
            <Field label="Scrape frequency" defaultValue="Every 4 hours" />
            <Field label="Tracked competitor URLs" defaultValue="globallogix.com, nexussupply.io, apextrading.co" />
            <Field label="Minimum price-change threshold" defaultValue="3%" />
            <Save />
          </SectionCard>
        </TabsContent>

        <TabsContent value="api">
          <SectionCard title="API & Integrations" description="Connect SokoPulse to your ERP, CRM, and warehouse systems.">
            <Field label="API key" defaultValue="sk_live_***********************" readOnly />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {["SAP", "NetSuite", "Shopify", "Zoho", "QuickBooks", "Slack"].map((i) => (
                <div key={i} className="rounded-md border border-border p-3 flex items-center justify-between">
                  <span className="text-sm font-medium">{i}</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security">
          <SectionCard title="Security">
            <Toggle label="Two-factor authentication" defaultChecked />
            <Toggle label="Single sign-on (SSO)" />
            <Toggle label="Session activity alerts" defaultChecked />
            <Field label="Session timeout (minutes)" defaultValue="30" />
            <Save />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
  readOnly,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} type={type} readOnly={readOnly} />
    </div>
  );
}

function Toggle({
  label,
  desc,
  defaultChecked,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {onChange ? (
        <Switch checked={checked} onCheckedChange={onChange} />
      ) : (
        <Switch defaultChecked={defaultChecked} />
      )}
    </div>
  );
}

function Save() {
  return (
    <div className="pt-2 flex justify-end">
      <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
    </div>
  );
}
