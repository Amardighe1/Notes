import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react";
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
const departments = [
  { value: "AIML", label: "AI & Machine Learning" },
  { value: "Computer", label: "Computer Engineering" },
  { value: "Mechanical", label: "Mechanical Engineering" },
  { value: "Civil", label: "Civil Engineering" },
];

const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

type StudentMode = "signin" | "signup";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [studentMode, setStudentMode] = useState<StudentMode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentDepartment, setStudentDepartment] = useState("");
  const [studentSemester, setStudentSemester] = useState("");

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

        {/* Student Login */}
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
      </div>
    </div>
  );
}
