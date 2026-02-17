import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Shield, User, ArrowRight, ArrowLeft, Eye, EyeOff, KeyRound, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Hashed admin ID — the plaintext is never in the client bundle
const ADMIN_ID_HASH = "f9a10cef19eb4355c1b545f4434c230d";

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

const departments = [
  { value: "AIML", label: "AI & Machine Learning" },
  { value: "Computer", label: "Computer Engineering" },
  { value: "Mechanical", label: "Mechanical Engineering" },
  { value: "Civil", label: "Civil Engineering" },
];

const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

type LoginTab = "admin" | "student";
type StudentMode = "signin" | "signup";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [activeTab, setActiveTab] = useState<LoginTab>("student");
  const [studentMode, setStudentMode] = useState<StudentMode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin state
  const [adminStep, setAdminStep] = useState<1 | 2>(1);
  const [adminId, setAdminId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminIdError, setAdminIdError] = useState("");

  // Student state
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentDepartment, setStudentDepartment] = useState("");
  const [studentSemester, setStudentSemester] = useState("");

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
    navigate("/admin");
  };

  const handleStudentSignIn = async () => {
    if (!studentEmail || !studentPassword) {
      toast({ title: "Missing fields", description: "Please enter email and password.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signIn(studentEmail, studentPassword);
    setLoading(false);

    if (error) {
      toast({ title: "Login Failed", description: error, variant: "destructive" });
      return;
    }

    toast({ title: "Welcome back!", description: "You are now signed in." });
    navigate("/");
  };

  const handleStudentSignUp = async () => {
    if (!studentName || !studentEmail || !studentPassword) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (studentPassword.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error, confirmEmail } = await signUp(studentEmail, studentPassword, studentName, studentDepartment, studentSemester);
    setLoading(false);

    if (error) {
      toast({ title: "Sign Up Failed", description: error, variant: "destructive" });
      return;
    }

    if (confirmEmail) {
      toast({
        title: "Check your email!",
        description: "A confirmation link has been sent to your email. Please verify before signing in.",
      });
      setStudentMode("signin");
      return;
    }

    toast({ title: "Account created!", description: "You can now access study materials." });
    navigate("/");
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
          <p className="text-sm text-muted-foreground">Sign in to access your study materials</p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-muted/50 p-1 gap-1">
          <button
            onClick={() => { setActiveTab("student"); setAdminStep(1); setAdminIdError(""); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
              activeTab === "student"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="h-4 w-4" />
            Student
          </button>
          <button
            onClick={() => { setActiveTab("admin"); setStudentMode("signin"); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
              activeTab === "admin"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Shield className="h-4 w-4" />
            Admin
          </button>
        </div>

        {/* Admin Login */}
        {activeTab === "admin" && (
          <Card className="border-border/50 shadow-elevated">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Admin Login</CardTitle>
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
        )}

        {/* Student Login */}
        {activeTab === "student" && (
          <Card className="border-border/50 shadow-elevated">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">
                {studentMode === "signin" ? "Student Sign In" : "Create Account"}
              </CardTitle>
              <CardDescription>
                {studentMode === "signin"
                  ? "Enter your credentials to access study materials"
                  : "Sign up to start accessing study materials"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentMode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name</Label>
                  <Input
                    id="student-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="student-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="you@example.com"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="student-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        studentMode === "signin" ? handleStudentSignIn() : handleStudentSignUp();
                      }
                    }}
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

              {studentMode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={studentDepartment} onValueChange={setStudentDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={studentSemester} onValueChange={setStudentSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button
                onClick={studentMode === "signin" ? handleStudentSignIn : handleStudentSignUp}
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? (studentMode === "signin" ? "Signing in..." : "Creating account...")
                  : (studentMode === "signin" ? "Sign In" : "Create Account")}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {studentMode === "signin" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setStudentMode("signup")}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setStudentMode("signin")}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
