import { useState } from "react";
import { GraduationCap, Shield, ArrowRight, ArrowLeft, Eye, EyeOff, KeyRound, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Hashed admin ID — the plaintext is never in the client bundle
const ADMIN_ID_HASH = "f9a10cef19eb4355c1b545f4434c230d";

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminStep, setAdminStep] = useState<1 | 2>(1);
  const [adminId, setAdminId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminIdError, setAdminIdError] = useState("");

  const handleAdminIdSubmit = async () => {
    const inputHash = await sha256Hex(adminId.trim());
    if (inputHash === ADMIN_ID_HASH) {
      setAdminIdError("");
      setAdminStep(2);
    } else {
      setAdminIdError("Invalid Admin ID. Access denied.");
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    const { error } = await signIn(adminEmail, adminPassword);
    setLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Welcome, Admin!", description: "Redirecting to dashboard..." });
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-lg">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">DiploMate</h1>
          <p className="text-sm text-muted-foreground">Admin access only</p>
        </div>

        <Card className="border-border/50 shadow-elevated">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Login
            </CardTitle>
            <CardDescription>
              {adminStep === 1
                ? "Enter your Admin ID to proceed"
                : "Enter your admin credentials"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminStep === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="admin-id">Admin ID</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-id"
                      type="text"
                      placeholder="Enter your Admin ID"
                      value={adminId}
                      onChange={(e) => { setAdminId(e.target.value); setAdminIdError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleAdminIdSubmit()}
                      className="pl-10"
                    />
                  </div>
                  {adminIdError && (
                    <p className="text-sm text-destructive">{adminIdError}</p>
                  )}
                </div>
                <Button onClick={handleAdminIdSubmit} className="w-full gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAdminStep(1)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleAdminLogin} disabled={loading} className="w-full">
                  {loading ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
