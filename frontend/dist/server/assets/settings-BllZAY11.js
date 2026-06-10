import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { h as cn, P as PageHeader, L as Label, I as Input, b as Button, a as apiClient } from "./router-C7MN38aT.js";
import { S as SectionCard } from "./widgets-B95N-acF.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BA1dbGD7.js";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { S as Slider } from "./slider-D3WLhlli.js";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
import "@radix-ui/react-tabs";
import "@radix-ui/react-slider";
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
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
  const [orgName, setOrgName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_org") || "SokoPulse Demo Co.";
    }
    return "SokoPulse Demo Co.";
  });
  const [industry, setIndustry] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_industry") || "Industrial Distribution";
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
      return localStorage.getItem("sokopulse_timezone") || "UTC+03:00 — Nairobi";
    }
    return "UTC+03:00 — Nairobi";
  });
  const [scrapeFreq, setScrapeFreq] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_scrape_freq") || "Every 4 hours";
    }
    return "Every 4 hours";
  });
  const [competitorUrls, setCompetitorUrls] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_competitor_urls") || "globallogix.com, nexussupply.io, apextrading.co";
    }
    return "globallogix.com, nexussupply.io, apextrading.co";
  });
  const [priceChangeThreshold, setPriceChangeThreshold] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_price_change_threshold") || "3%";
    }
    return "3%";
  });
  const [sessionTimeout, setSessionTimeout] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_session_timeout") || "30";
    }
    return "30";
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Settings", description: "Manage your account, organization, AI thresholds, and integrations." }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "profile", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "mb-6 flex flex-wrap", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "profile", children: "Profile" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "org", children: "Organization" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "ai", children: "AI Automation" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "notify", children: "Notifications" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "competitor", children: "Competitors" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "api", children: "API & Integrations" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "security", children: "Security" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "profile", children: /* @__PURE__ */ jsxs(SectionCard, { title: "User Profile", description: "Personal account information.", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "profile-fullname", children: "Full name" }),
          /* @__PURE__ */ jsx(Input, { id: "profile-fullname", value: fullName, onChange: (e) => setFullName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 mt-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "profile-email", children: "Email" }),
          /* @__PURE__ */ jsx(Input, { id: "profile-email", type: "email", value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 mt-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "profile-role", children: "Role" }),
          /* @__PURE__ */ jsx(Input, { id: "profile-role", value: role, onChange: (e) => setRole(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => {
          localStorage.setItem("sokopulse_user", fullName);
          localStorage.setItem("sokopulse_email", email);
          localStorage.setItem("sokopulse_role", role);
          window.dispatchEvent(new Event("profile-updated"));
          toast.success("Profile saved successfully!");
        }, children: "Save Profile" }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "org", children: /* @__PURE__ */ jsxs(SectionCard, { title: "Organization", description: "Company details and locale.", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "org-name", children: "Organization name" }),
          /* @__PURE__ */ jsx(Input, { id: "org-name", value: orgName, onChange: (e) => setOrgName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 mt-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "org-industry", children: "Industry" }),
          /* @__PURE__ */ jsx(Input, { id: "org-industry", value: industry, onChange: (e) => setIndustry(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 mt-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "org-currency", children: "Default currency" }),
          /* @__PURE__ */ jsx(Input, { id: "org-currency", value: currency, onChange: (e) => setCurrency(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 mt-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "org-timezone", children: "Timezone" }),
          /* @__PURE__ */ jsx(Input, { id: "org-timezone", value: timezone, onChange: (e) => setTimezone(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsxs(Button, { disabled: isSavingOrg, onClick: () => {
          setIsSavingOrg(true);
          localStorage.setItem("sokopulse_org", orgName);
          localStorage.setItem("sokopulse_industry", industry);
          localStorage.setItem("sokopulse_currency", currency);
          localStorage.setItem("sokopulse_timezone", timezone);
          const competitorNames = competitorUrls ? competitorUrls.split(",").map((url) => {
            let name = url.trim();
            name = name.replace(/^(https?:\/\/)?(www\.)?/, "");
            const dotIndex = name.indexOf(".");
            if (dotIndex > -1) name = name.substring(0, dotIndex);
            name = name.replace(/-/g, " ");
            return name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          }).filter(Boolean) : void 0;
          apiClient.updateIndustry(industry, competitorNames).then((res) => {
            setIsSavingOrg(false);
            if (res) {
              toast.success(`Organization saved & database dynamically re-seeded for "${industry}"!`);
            } else {
              toast.success("Organization details saved in standalone mode!");
            }
          }).catch((err) => {
            setIsSavingOrg(false);
            toast.error("Failed to dynamically re-seed database.");
          });
        }, children: [
          isSavingOrg && /* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }),
          isSavingOrg ? "Updating Database..." : "Save Organization"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "ai", children: /* @__PURE__ */ jsxs(SectionCard, { title: "AI Automation Thresholds", description: "Control when SokoPulse auto-executes vs. recommends.", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { children: "Auto-approve recommendations above confidence" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm", children: [
              confidence[0],
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Slider, { value: confidence, onValueChange: setConfidence, min: 50, max: 100, step: 1 })
        ] }),
        /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
        /* @__PURE__ */ jsx(Toggle, { label: "Autopilot mode", desc: "Automatically execute critical replenishments when confidence ≥ threshold.", checked: autopilot, onChange: setAutopilot }),
        /* @__PURE__ */ jsx(Toggle, { label: "Auto-apply pricing adjustments", desc: "≤ 5% changes are applied automatically.", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "Auto-create POs for critical stock-outs", desc: "Requires verified supplier match." }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => {
          localStorage.setItem("sokopulse_confidence", confidence[0].toString());
          localStorage.setItem("sokopulse_autopilot", autopilot ? "true" : "false");
          toast.success("AI Automation thresholds saved successfully!");
        }, children: "Save AI Changes" }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "notify", children: /* @__PURE__ */ jsxs(SectionCard, { title: "Notification Preferences", children: [
        /* @__PURE__ */ jsx(Toggle, { label: "Email — critical alerts", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "Email — daily digest", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "In-app — pricing recommendations", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "SMS — supplier delays" }),
        /* @__PURE__ */ jsx(Toggle, { label: "Slack — demand spikes", defaultChecked: true }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => toast.success("Notification preferences saved"), children: "Save Notifications" }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "competitor", children: /* @__PURE__ */ jsxs(SectionCard, { title: "Competitor Tracking", description: "Configure scraping cadence and target sources.", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "comp-freq", children: "Scrape frequency" }),
          /* @__PURE__ */ jsx(Input, { id: "comp-freq", value: scrapeFreq, onChange: (e) => setScrapeFreq(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 mt-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "comp-urls", children: "Tracked competitor URLs" }),
          /* @__PURE__ */ jsx(Input, { id: "comp-urls", value: competitorUrls, onChange: (e) => setCompetitorUrls(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 mt-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "comp-threshold", children: "Minimum price-change threshold" }),
          /* @__PURE__ */ jsx(Input, { id: "comp-threshold", value: priceChangeThreshold, onChange: (e) => setPriceChangeThreshold(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsxs(Button, { disabled: isSavingCompetitors, onClick: () => {
          setIsSavingCompetitors(true);
          localStorage.setItem("sokopulse_scrape_freq", scrapeFreq);
          localStorage.setItem("sokopulse_competitor_urls", competitorUrls);
          localStorage.setItem("sokopulse_price_change_threshold", priceChangeThreshold);
          const competitorNames = competitorUrls ? competitorUrls.split(",").map((url) => {
            let name = url.trim();
            name = name.replace(/^(https?:\/\/)?(www\.)?/, "");
            const dotIndex = name.indexOf(".");
            if (dotIndex > -1) name = name.substring(0, dotIndex);
            name = name.replace(/-/g, " ");
            return name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          }).filter(Boolean) : void 0;
          apiClient.triggerCompetitorScrape(industry, competitorNames).then((res) => {
            setIsSavingCompetitors(false);
            toast.success("Competitor settings saved & crawler triggered for new entities!");
          }).catch((err) => {
            setIsSavingCompetitors(false);
            toast.success("Competitor settings saved in standalone mode!");
          });
        }, children: [
          isSavingCompetitors && /* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }),
          isSavingCompetitors ? "Syncing Crawler..." : "Save Competitor Settings"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "api", children: /* @__PURE__ */ jsxs(SectionCard, { title: "API & Integrations", description: "Connect SokoPulse to your ERP, CRM, and warehouse systems.", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "api-key", children: "API key" }),
          /* @__PURE__ */ jsx(Input, { id: "api-key", defaultValue: "sk_live_***********************", readOnly: true })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 pt-4", children: ["SAP", "NetSuite", "Shopify", "Zoho", "QuickBooks", "Slack"].map((i) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border p-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: i }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => toast.success(`Integration request sent for ${i}`), children: "Connect" })
        ] }, i)) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "security", children: /* @__PURE__ */ jsxs(SectionCard, { title: "Security", children: [
        /* @__PURE__ */ jsx(Toggle, { label: "Two-factor authentication", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "Single sign-on (SSO)" }),
        /* @__PURE__ */ jsx(Toggle, { label: "Session activity alerts", defaultChecked: true }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 mt-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "security-timeout", children: "Session timeout (minutes)" }),
          /* @__PURE__ */ jsx(Input, { id: "security-timeout", value: sessionTimeout, onChange: (e) => setSessionTimeout(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => {
          localStorage.setItem("sokopulse_session_timeout", sessionTimeout);
          toast.success("Security settings saved!");
        }, children: "Save Security" }) })
      ] }) })
    ] })
  ] });
}
function Toggle({
  label,
  desc,
  defaultChecked,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 py-2", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: label }),
      desc && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: desc })
    ] }),
    onChange ? /* @__PURE__ */ jsx(Switch, { checked, onCheckedChange: onChange }) : /* @__PURE__ */ jsx(Switch, { defaultChecked })
  ] });
}
export {
  SettingsPage as component
};
