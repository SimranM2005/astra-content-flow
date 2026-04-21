import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/creator/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Save, Loader2, Mail, Lock } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.user_metadata?.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username },
      });
      if (error) throw error;
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not update profile";
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please confirm your password",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Password updated!", description: "Your password has been changed." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not update password";
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not sign out";
      toast({
        title: "Sign out failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="glass-card p-6 md:p-8">
          <h1 className="font-display text-3xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="glass-card border-border/50 p-6">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">Update your public profile information</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="pl-9 bg-secondary/40 border-border/60"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Email address cannot be changed</p>
            </div>

            <div>
              <label className="text-sm font-medium">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="mt-1 bg-secondary/40 border-border/60"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </form>
        </Card>

        {/* Password Settings */}
        <Card className="glass-card border-border/50 p-6">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold">Security</h2>
            <p className="mt-1 text-sm text-muted-foreground">Change your password</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 bg-secondary/40 border-border/60"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 bg-secondary/40 border-border/60"
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !newPassword}
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
              Update Password
            </Button>
          </form>
        </Card>

        {/* Sign Out */}
        <Card className="glass-card border-destructive/20 bg-destructive/10 border p-6">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-destructive">Danger Zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign out of your account</p>
          </div>

          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
