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
import { apiClient } from "../lib/api-client";
import { RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — SokoPulse AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [confidence, setConfidence] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sokopulse_confidence");
      return saved ? [parseInt(saved)] : [85];
    }
    return [85];
  });
  const [autopilot, setAutopilot] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_autopilot") === "true";
    }
    return false;
  });
  const [isSavingOrg, setIsSavingOrg] = useState(false);
  const [isSavingCompetitors, setIsSavingCompetitors] = useState(false);

  // Profile
  const [fullName, setFullName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_user") || "David Chen";
    }
    return "David Chen";
  });
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_email") || "david@sokopulse.ai";
    }
    return "david@sokopulse.ai";
  });
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_role") || "Regional Director";
    }
    return "Regional Director";
  });

  // Org
  const [orgName, setOrgName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_org") || "SokoPulse Demo Co.";
    }
    return "SokoPulse Demo Co.";
  });
  const [industry, setIndustry] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("sokopulse_industry") || "Industrial Distribution"
      );
    }
    return "Industrial Distribution";
  });
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_currency") || "USD";
    }
    return "USD";
  });
  const [timezone, setTimezone] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("sokopulse_timezone") || "UTC+03:00 — Nairobi"
      );
    }
    return "UTC+03:00 — Nairobi";
  });

  // Competitor
  const [scrapeFreq, setScrapeFreq] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_scrape_freq") || "Every 4 hours";
    }
    return "Every 4 hours";
  });
  const [competitorUrls, setCompetitorUrls] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("sokopulse_competitor_urls") ||
        "globallogix.com, nexussupply.io, apextrading.co"
      );
    }
    return "globallogix.com, nexussupply.io, apextrading.co";
  });
  const [priceChangeThreshold, setPriceChangeThreshold] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_price_change_threshold") || "3%";
    }
    return "3%";
  });

  // Security
  const [sessionTimeout, setSessionTimeout] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_session_timeout") || "30";
    }
    return "30";
  });

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Settings"
        description="Manage your account, organization, AI thresholds, and integrations."
      />

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
          <SectionCard
            title="User Profile"
            description="Personal account information."
          >
            <div className="grid gap-1.5">
              <Label htmlFor="profile-fullname">Full name</Label>
              <Input
                id="profile-fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5 mt-4">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5 mt-4">
              <Label htmlFor="profile-role">Role</Label>
              <Input
                id="profile-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => {
                  localStorage.setItem("sokopulse_user", fullName);
                  localStorage.setItem("sokopulse_email", email);
                  localStorage.setItem("sokopulse_role", role);
                  window.dispatchEvent(new Event("profile-updated"));
                  toast.success("Profile saved successfully!");
                }}
              >
                Save Profile
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="org">
          <SectionCard
            title="Organization"
            description="Company details and locale."
          >
            <div className="grid gap-1.5">
              <Label htmlFor="org-name">Organization name</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5 mt-4">
              <Label htmlFor="org-industry">Industry</Label>
              <Input
                id="org-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5 mt-4">
              <Label htmlFor="org-currency">Default currency</Label>
              <Select
                value={currency}
                onValueChange={(val) => setCurrency(val)}
              >
                <SelectTrigger id="org-currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                  <SelectItem value="KES">KES (KSh) - Kenyan Shilling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5 mt-4">
              <Label htmlFor="org-timezone">Timezone</Label>
              <Input
                id="org-timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                disabled={isSavingOrg}
                onClick={() => {
                  setIsSavingOrg(true);
                  localStorage.setItem("sokopulse_org", orgName);
                  localStorage.setItem("sokopulse_industry", industry);
                  localStorage.setItem("sokopulse_currency", currency);
                  localStorage.setItem("sokopulse_timezone", timezone);
                  window.dispatchEvent(new Event("currency-updated"));
                  
                  // Clean up competitor display names from settings URLs
                  const competitorNames = competitorUrls
                    ? competitorUrls
                        .split(",")
                        .map((url) => {
                          let name = url.trim();
                          name = name.replace(/^(https?:\/\/)?(www\.)?/, "");
                          const dotIndex = name.indexOf(".");
                          if (dotIndex > -1) name = name.substring(0, dotIndex);
                          name = name.replace(/-/g, " ");
                          return name
                            .split(" ")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ");
                        })
                        .filter(Boolean)
                    : undefined;

                  apiClient
                    .updateIndustry(industry, currency, competitorNames)
                    .then((res) => {
                      setIsSavingOrg(false);
                      if (res) {
                        toast.success(
                          `Organization saved & database dynamically re-seeded for "${industry}"!`
                        );
                      } else {
                        toast.success("Organization details saved in standalone mode!");
                      }
                    })
                    .catch((err) => {
                      setIsSavingOrg(false);
                      toast.error("Failed to dynamically re-seed database.");
                    });
                }}
              >
                {isSavingOrg && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {isSavingOrg ? "Updating Database..." : "Save Organization"}
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="ai">
          <SectionCard
            title="AI Automation Thresholds"
            description="Control when SokoPulse auto-executes vs. recommends."
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Auto-approve recommendations above confidence</Label>
                <span className="font-mono text-sm">{confidence[0]}%</span>
              </div>
              <Slider
                value={confidence}
                onValueChange={setConfidence}
                min={50}
                max={100}
                step={1}
              />
            </div>
            <Separator className="my-4" />
            <Toggle
              label="Autopilot mode"
              desc="Automatically execute critical replenishments when confidence ≥ threshold."
              checked={autopilot}
              onChange={setAutopilot}
            />
            <Toggle
              label="Auto-apply pricing adjustments"
              desc="≤ 5% changes are applied automatically."
              defaultChecked
            />
            <Toggle
              label="Auto-create POs for critical stock-outs"
              desc="Requires verified supplier match."
            />
            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => {
                  localStorage.setItem(
                    "sokopulse_confidence",
                    confidence[0].toString(),
                  );
                  localStorage.setItem(
                    "sokopulse_autopilot",
                    autopilot ? "true" : "false",
                  );
                  toast.success("AI Automation thresholds saved successfully!");
                }}
              >
                Save AI Changes
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notify">
          <SectionCard title="Notification Preferences">
            <Toggle label="Email — critical alerts" defaultChecked />
            <Toggle label="Email — daily digest" defaultChecked />
            <Toggle label="In-app — pricing recommendations" defaultChecked />
            <Toggle label="SMS — supplier delays" />
            <Toggle label="Slack — demand spikes" defaultChecked />
            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => toast.success("Notification preferences saved")}
              >
                Save Notifications
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="competitor">
          <SectionCard
            title="Competitor Tracking"
            description="Configure scraping cadence and target sources."
          >
            <div className="grid gap-1.5">
              <Label htmlFor="comp-freq">Scrape frequency</Label>
              <Input
                id="comp-freq"
                value={scrapeFreq}
                onChange={(e) => setScrapeFreq(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5 mt-4">
              <Label htmlFor="comp-urls">Tracked competitor URLs</Label>
              <Input
                id="comp-urls"
                value={competitorUrls}
                onChange={(e) => setCompetitorUrls(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5 mt-4">
              <Label htmlFor="comp-threshold">
                Minimum price-change threshold
              </Label>
              <Input
                id="comp-threshold"
                value={priceChangeThreshold}
                onChange={(e) => setPriceChangeThreshold(e.target.value)}
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                disabled={isSavingCompetitors}
                onClick={() => {
                  setIsSavingCompetitors(true);
                  localStorage.setItem("sokopulse_scrape_freq", scrapeFreq);
                  localStorage.setItem(
                    "sokopulse_competitor_urls",
                    competitorUrls,
                  );
                  localStorage.setItem(
                    "sokopulse_price_change_threshold",
                    priceChangeThreshold,
                  );

                  // Parse competitor display names from URLs
                  const competitorNames = competitorUrls
                    ? competitorUrls
                        .split(",")
                        .map((url) => {
                          let name = url.trim();
                          name = name.replace(/^(https?:\/\/)?(www\.)?/, "");
                          const dotIndex = name.indexOf(".");
                          if (dotIndex > -1) name = name.substring(0, dotIndex);
                          name = name.replace(/-/g, " ");
                          return name
                            .split(" ")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ");
                        })
                        .filter(Boolean)
                    : undefined;

                  apiClient
                    .triggerCompetitorScrape(industry, competitorNames)
                    .then((res) => {
                      setIsSavingCompetitors(false);
                      toast.success(
                        "Competitor settings saved & crawler triggered for new entities!"
                      );
                    })
                    .catch((err) => {
                      setIsSavingCompetitors(false);
                      toast.success("Competitor settings saved in standalone mode!");
                    });
                }}
              >
                {isSavingCompetitors && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {isSavingCompetitors ? "Syncing Crawler..." : "Save Competitor Settings"}
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="api">
          <SectionCard
            title="API & Integrations"
            description="Connect SokoPulse to your ERP, CRM, and warehouse systems."
          >
            <div className="grid gap-1.5">
              <Label htmlFor="api-key">API key</Label>
              <Input
                id="api-key"
                defaultValue="sk_live_***********************"
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
              {[
                "SAP",
                "NetSuite",
                "Shopify",
                "Zoho",
                "QuickBooks",
                "Slack",
              ].map((i) => (
                <div
                  key={i}
                  className="rounded-md border border-border p-3 flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{i}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.success(`Integration request sent for ${i}`)
                    }
                  >
                    Connect
                  </Button>
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
            <div className="grid gap-1.5 mt-2">
              <Label htmlFor="security-timeout">
                Session timeout (minutes)
              </Label>
              <Input
                id="security-timeout"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => {
                  localStorage.setItem(
                    "sokopulse_session_timeout",
                    sessionTimeout,
                  );
                  toast.success("Security settings saved!");
                }}
              >
                Save Security
              </Button>
            </div>
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
      <Button onClick={() => toast.success("Settings saved")}>
        Save changes
      </Button>
    </div>
  );
}
