import { Eye, Heart, DollarSign, UserPlus, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/creator/DashboardLayout";
import { KpiCard } from "@/components/creator/KpiCard";
import { GrowthChart } from "@/components/creator/GrowthChart";
import { ContentFeed } from "@/components/creator/ContentFeed";
import { AudienceCard } from "@/components/creator/AudienceCard";
import { AiIdeasCard } from "@/components/creator/AiIdeasCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";
import { seedDemoData, checkAndSeedIfNeeded } from "@/hooks/useSeedData";
import { supabase } from "@/integrations/supabase/client";

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : n.toString();
const money = (n: number) => `$${fmt(n)}`;

const Index = () => {
  const { totals, deltas, sparks, growth } = useDashboardData();
  const { user } = useAuth();
  const [hasVideos, setHasVideos] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const isDemoAccount = user?.email === "demo@creatorstudio.com";

  // Check if user has videos and offer to seed demo data
  useEffect(() => {
    const checkVideos = async () => {
      const { count } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true });
      setHasVideos((count ?? 0) > 0);
    };
    checkVideos();
  }, []);

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await seedDemoData();
      setHasVideos(true);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <DashboardLayout>
      {isDemoAccount && !hasVideos && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card border border-accent/40 bg-accent/10 overflow-hidden p-6 md:p-8 mb-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-accent">Demo Account Ready</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Populate your dashboard with sample videos and analytics to explore all features.
              </p>
            </div>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-glow transition hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {seeding ? "Seeding..." : "Load Demo Data"}
            </button>
          </div>
        </motion.section>
      )}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card overflow-hidden p-6 md:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Your channel is{" "}
              <span className="text-gradient">
                {deltas.views >= 0 ? "+" : ""}
                {deltas.views}%
              </span>{" "}
              this week
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Live data straight from your analytics — uploads, views and revenue update in real time.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-border/60 bg-secondary/40 px-4 py-2 text-sm font-medium hover:bg-secondary">
              Export report
            </button>
            <a
              href="/dashboard/upload"
              className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              New upload
            </a>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Views" value={fmt(totals.views)} delta={deltas.views} icon={Eye} data={sparks.views} accent="primary" />
        <KpiCard label="Engagement" value={fmt(totals.engagement)} delta={deltas.engagement} icon={Heart} data={sparks.engagement} accent="accent" />
        <KpiCard label="Revenue" value={money(totals.revenue)} delta={deltas.revenue} icon={DollarSign} data={sparks.revenue} accent="warning" />
        <KpiCard label="Subscribers" value={fmt(totals.subscribers)} delta={deltas.subscribers} icon={UserPlus} data={sparks.subscribers} accent="success" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><GrowthChart data={growth} /></div>
        <AudienceCard />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><ContentFeed /></div>
        <AiIdeasCard />
      </section>
    </DashboardLayout>
  );
};

export default Index;
