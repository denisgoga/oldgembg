import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { locale } = useParams();
  const localeSegment = locale ?? "en";
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate(`/${localeSegment}/admin`);
        return;
      }

      if (res.status === 401) {
        toast({
          title: "Error",
          description: "Incorrect password",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-primary/20 rounded-lg mb-4">
              <Lock size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
            <p className="text-muted-foreground">
              Enter your password to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
