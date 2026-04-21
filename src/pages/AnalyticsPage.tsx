import { useState, useEffect } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { DashboardLayout } from "@/components/creator/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, Eye, Heart, DollarSign } from "lucide-react";

interface AnalyticsRow {
  date: string;
  views?: number;
  engagement?: number;
  revenue?: number;
  watch_time?: number;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      try {
        const since = new Date();
        since.setDate(since.getDate() - 90);

        const { data: analytics, error } = await supabase
          .from("analytics")
          .select("date, views, engagement, revenue, watch_time")
          .eq("user_id", user.id)
          .gte("date", since.toISOString().slice(0, 10))
          .order("date", { ascending: true });

        if (error) throw error;

        setData(analytics ?? []);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const totals = data.reduce(
    (acc, row) => ({
      views: acc.views + (row.views ?? 0),
      engagement: acc.engagement + (row.engagement ?? 0),
      revenue: acc.revenue + (row.revenue ?? 0),
      watch_time: acc.watch_time + (row.watch_time ?? 0),
    }),
    { views: 0, engagement: 0, revenue: 0, watch_time: 0 }
  );

  const formatNumber = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : n.toString();

  const StatCard = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) => (
    <Card className="glass-card border-border/50 p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/20 p-3">
          <Icon className="h-5 w-5 text-primary-glow" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="font-display text-3xl font-semibold">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">90-day performance overview</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12">
            <Loader2 className="h-5 w-5 animate-spin text-primary-glow" />
            <span className="text-sm text-muted-foreground">Loading analytics...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Eye} label="Total Views" value={formatNumber(totals.views)} />
              <StatCard icon={Heart} label="Engagement" value={formatNumber(totals.engagement)} />
              <StatCard icon={DollarSign} label="Revenue" value={`$${(totals.revenue / 100).toLocaleString()}`} />
              <StatCard icon={TrendingUp} label="Watch Time" value={`${(totals.watch_time / 60).toLocaleString()} hrs`} />
            </div>

            <div className="glass-card border-border/50 p-6">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-semibold">Performance Trends</h2>
                <p className="mt-1 text-sm text-muted-foreground">Last 90 days</p>
              </div>

              {data.length > 0 ? (
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis dataKey="date" stroke="rgba(148, 163, 184, 0.5)" />
                      <YAxis stroke="rgba(148, 163, 184, 0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.8)",
                          border: "1px solid rgba(248, 113, 113, 0.2)",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="hsl(var(--primary))"
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="hsl(var(--accent))"
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--warning))"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="grid place-items-center rounded-lg border border-dashed border-border/60 py-12">
                  <p className="text-muted-foreground">No analytics data available yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
