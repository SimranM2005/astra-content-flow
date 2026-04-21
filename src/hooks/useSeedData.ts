import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function seedDemoData() {
  try {
    const response = await supabase.functions.invoke("seed-demo-data", {
      method: "POST",
    });

    if (response.error) {
      throw response.error;
    }

    toast({
      title: "Demo data seeded successfully!",
      description: "Your dashboard is now populated with sample videos and analytics.",
    });

    return response.data;
  } catch (err: unknown) {
    console.error("Seed data error:", err);
    toast({
      title: "Seeding failed",
      description: err?.message ?? "Could not seed demo data",
      variant: "destructive",
    });
    throw err;
  }
}

export async function checkAndSeedIfNeeded() {
  try {
    const { count } = await supabase
      .from("videos")
      .select("*", { count: "exact", head: true });

    // If user has no videos, seed demo data
    if ((count ?? 0) === 0) {
      await seedDemoData();
    }
  } catch (err) {
    console.error("Auto-seed check failed", err);
  }
}
