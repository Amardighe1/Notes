import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://sbmgiolfbnhbdnsnazjy.supabase.co";

const departments = [
  { value: "AIML", label: "AI & Machine Learning" },
  { value: "Computer", label: "Computer Engineering" },
  { value: "Mechanical", label: "Mechanical Engineering" },
  { value: "Civil", label: "Civil Engineering" },
];

const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

type StudentMode = "signin" | "signup";
type SignupStep = "form" | "otp";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [studentMode, setStudentMode] = useState<StudentMode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Student form fields
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentDepartment, setStudentDepartment] = useState("");
  const [studentSemester, setStudentSemester] = useState("");

  // OTP verification state
  const [signupStep, setSignupStep] = useState<SignupStep>("form");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (signupStep === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [signupStep]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // only last digit
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      const otp = otpDigits.join("");
      if (otp.length === 6) handleVerifyOtp();
    }
  };

  // Handle paste of full OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);
    // Focus last filled input or the next empty one
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  // Send OTP to email
  const sendOtp = async () => {
    setOtpSending(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabase["supabaseKey"] || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibWdpb2xmYm5oYmRuc25hemp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MzQxMTQsImV4cCI6MjA4MzUxMDExNH0.WUXfpG9XeN8arjjh5vBxtFZth39-cuZHaH3Wh_1VYpc"}`,
        },
        body: JSON.stringify({ email: studentEmail.toLowerCase().trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      toast({ title: "OTP Sent!", description: `Verification code sent to ${studentEmail}` });
      setResendTimer(60); // 60 second cooldown
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setOtpSending(false);
    }
  };

  // Step 1: Validate form and send OTP
  const handleSignupSubmit = async () => {
    if (!studentName || !studentEmail || !studentPassword) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (studentPassword.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    // Send OTP and move to verification step
    await sendOtp();
    setSignupStep("otp");
  };

  // Step 2: Verify OTP then create account
  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter all 6 digits.", variant: "destructive" });
      return;
    }

    setOtpVerifying(true);
    try {
      // Verify OTP via Supabase RPC
      const { data: isValid, error: rpcError } = await supabase.rpc("verify_email_otp", {
        p_email: studentEmail.toLowerCase().trim(),
        p_otp: otp,
      });

      if (rpcError) throw new Error(rpcError.message);
      if (!isValid) {
        toast({ title: "Invalid OTP", description: "The code is incorrect or expired. Please try again.", variant: "destructive" });
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setOtpVerifying(false);
        return;
      }

      // OTP verified — create the account
      setLoading(true);
      const { error } = await signUp(studentEmail, studentPassword, studentName, studentDepartment, studentSemester);
      setLoading(false);

      if (error) {
        toast({ title: "Sign Up Failed", description: error, variant: "destructive" });
        setOtpVerifying(false);
        return;
      }

      toast({ title: "Account created!", description: "Email verified. You can now access study materials." });
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setOtpVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtpDigits(["", "", "", "", "", ""]);
    await sendOtp();
  };

  // Go back from OTP step to form
  const handleBackToForm = () => {
    setSignupStep("form");
    setOtpDigits(["", "", "", "", "", ""]);
  };

  // Sign in handler
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

        {/* ===== OTP Verification Step ===== */}
        {studentMode === "signup" && signupStep === "otp" ? (
          <Card className="border-border/50 shadow-elevated">
            <CardHeader className="space-y-1 pb-4">
              <button
                onClick={handleBackToForm}
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-1 w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <CardTitle className="text-xl">Verify Your Email</CardTitle>
              <CardDescription>
                We sent a 6-digit code to <span className="font-medium text-foreground">{studentEmail}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <Input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-semibold"
                    disabled={otpVerifying}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOtp}
                disabled={otpVerifying || loading || otpDigits.join("").length !== 6}
                className="w-full"
              >
                {otpVerifying || loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {otpVerifying ? "Verifying..." : "Creating Account..."}
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </Button>

              {/* Resend */}
              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                {resendTimer > 0 ? (
                  <span className="text-muted-foreground">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={otpSending}
                    className="text-primary font-medium hover:underline disabled:opacity-50"
                  >
                    {otpSending ? "Sending..." : "Resend"}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* ===== Sign In / Sign Up Form ===== */
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
                        studentMode === "signin" ? handleStudentSignIn() : handleSignupSubmit();
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
                onClick={studentMode === "signin" ? handleStudentSignIn : handleSignupSubmit}
                disabled={loading || otpSending}
                className="w-full"
              >
                {loading ? (
                  studentMode === "signin" ? "Signing in..." : "Creating account..."
                ) : otpSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending verification code...
                  </>
                ) : (
                  studentMode === "signin" ? "Sign In" : "Continue"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {studentMode === "signin" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => { setStudentMode("signup"); setSignupStep("form"); }}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => { setStudentMode("signin"); setSignupStep("form"); }}
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
