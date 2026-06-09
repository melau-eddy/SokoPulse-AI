import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { c as cn, P as PageHeader, a as Button } from "./router-DpanUk2p.js";
import { S as SectionCard } from "./widgets-DJY_Wxub.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CfOzPeuT.js";
import { I as Input } from "./input-CYZTuibf.js";
import { L as Label } from "./label-KbXiYb16.js";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { S as Slider } from "./slider-4X-ttFFW.js";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-avatar";
import "@radix-ui/react-progress";
import "@radix-ui/react-tabs";
import "@radix-ui/react-label";
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
const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
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
));
Separator.displayName = SeparatorPrimitive.Root.displayName;
function SettingsPage() {
  const [confidence, setConfidence] = useState([85]);
  const [autopilot, setAutopilot] = useState(false);
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
        /* @__PURE__ */ jsx(Field, { label: "Full name", defaultValue: "David Chen" }),
        /* @__PURE__ */ jsx(Field, { label: "Email", type: "email", defaultValue: "david@sokopulse.ai" }),
        /* @__PURE__ */ jsx(Field, { label: "Role", defaultValue: "Regional Director" }),
        /* @__PURE__ */ jsx(Save, {})
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "org", children: /* @__PURE__ */ jsxs(SectionCard, { title: "Organization", description: "Company details and locale.", children: [
        /* @__PURE__ */ jsx(Field, { label: "Organization name", defaultValue: "SokoPulse Demo Co." }),
        /* @__PURE__ */ jsx(Field, { label: "Industry", defaultValue: "Industrial Distribution" }),
        /* @__PURE__ */ jsx(Field, { label: "Default currency", defaultValue: "USD" }),
        /* @__PURE__ */ jsx(Field, { label: "Timezone", defaultValue: "UTC+03:00 — Nairobi" }),
        /* @__PURE__ */ jsx(Save, {})
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
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsx(Toggle, { label: "Autopilot mode", desc: "Automatically execute critical replenishments when confidence ≥ threshold.", checked: autopilot, onChange: setAutopilot }),
        /* @__PURE__ */ jsx(Toggle, { label: "Auto-apply pricing adjustments", desc: "≤ 5% changes are applied automatically.", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "Auto-create POs for critical stock-outs", desc: "Requires verified supplier match." }),
        /* @__PURE__ */ jsx(Save, {})
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "notify", children: /* @__PURE__ */ jsxs(SectionCard, { title: "Notification Preferences", children: [
        /* @__PURE__ */ jsx(Toggle, { label: "Email — critical alerts", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "Email — daily digest", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "In-app — pricing recommendations", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "SMS — supplier delays" }),
        /* @__PURE__ */ jsx(Toggle, { label: "Slack — demand spikes", defaultChecked: true }),
        /* @__PURE__ */ jsx(Save, {})
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "competitor", children: /* @__PURE__ */ jsxs(SectionCard, { title: "Competitor Tracking", description: "Configure scraping cadence and target sources.", children: [
        /* @__PURE__ */ jsx(Field, { label: "Scrape frequency", defaultValue: "Every 4 hours" }),
        /* @__PURE__ */ jsx(Field, { label: "Tracked competitor URLs", defaultValue: "globallogix.com, nexussupply.io, apextrading.co" }),
        /* @__PURE__ */ jsx(Field, { label: "Minimum price-change threshold", defaultValue: "3%" }),
        /* @__PURE__ */ jsx(Save, {})
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "api", children: /* @__PURE__ */ jsxs(SectionCard, { title: "API & Integrations", description: "Connect SokoPulse to your ERP, CRM, and warehouse systems.", children: [
        /* @__PURE__ */ jsx(Field, { label: "API key", defaultValue: "sk_live_***********************", readOnly: true }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 pt-2", children: ["SAP", "NetSuite", "Shopify", "Zoho", "QuickBooks", "Slack"].map((i) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border p-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: i }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", children: "Connect" })
        ] }, i)) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "security", children: /* @__PURE__ */ jsxs(SectionCard, { title: "Security", children: [
        /* @__PURE__ */ jsx(Toggle, { label: "Two-factor authentication", defaultChecked: true }),
        /* @__PURE__ */ jsx(Toggle, { label: "Single sign-on (SSO)" }),
        /* @__PURE__ */ jsx(Toggle, { label: "Session activity alerts", defaultChecked: true }),
        /* @__PURE__ */ jsx(Field, { label: "Session timeout (minutes)", defaultValue: "30" }),
        /* @__PURE__ */ jsx(Save, {})
      ] }) })
    ] })
  ] });
}
function Field({
  label,
  defaultValue,
  type = "text",
  readOnly
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
    /* @__PURE__ */ jsx(Label, { children: label }),
    /* @__PURE__ */ jsx(Input, { defaultValue, type, readOnly })
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
function Save() {
  return /* @__PURE__ */ jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => toast.success("Settings saved"), children: "Save changes" }) });
}
export {
  SettingsPage as component
};
