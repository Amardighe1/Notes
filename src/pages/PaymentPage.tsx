import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Loader2, CheckCircle2, FolderOpen, IndianRupee } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const PRICE = 199;

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const folderId = searchParams.get("folderId") || "";
  const folderName = searchParams.get("folderName") || "";
  const subject = searchParams.get("subject") || "";
  const department = searchParams.get("department") || "";
  const semester = searchParams.get("semester") || "";

  const [buyerName, setBuyerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!folderId) {
    navigate("/notes-selection");
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Screenshot must be under 5MB", variant: "destructive" });
        return;
      }
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyerName.trim() || !phoneNumber.trim() || !accountHolderName.trim() || !screenshotFile) {
      toast({ title: "All fields are required", description: "Please fill all fields and upload payment screenshot", variant: "destructive" });
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber.trim())) {
      toast({ title: "Invalid phone number", description: "Please enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Upload screenshot to Supabase Storage
      const fileExt = screenshotFile.name.split(".").pop();
      const filePath = `${user.id}/${folderId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, screenshotFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("payment-screenshots").getPublicUrl(filePath);

      // Check if a rejected purchase exists — delete it first so we can re-insert
      const { data: existing } = await supabase
        .from("purchases")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("folder_id", folderId)
        .single();

      if (existing && existing.status === "rejected") {
        await supabase.from("purchases").delete().eq("id", existing.id);
      }

      // Insert purchase record
      const { error: insertError } = await supabase.from("purchases").insert({
        user_id: user.id,
        folder_id: folderId,
        buyer_name: buyerName.trim(),
        phone_number: phoneNumber.trim(),
        account_holder_name: accountHolderName.trim(),
        payment_screenshot_url: urlData.publicUrl,
        payment_screenshot_path: filePath,
        status: "pending",
        amount: PRICE,
      });

      if (insertError) {
        if (insertError.message?.includes("duplicate") || insertError.message?.includes("unique")) {
          toast({ title: "Already submitted", description: "You have already submitted payment for this folder", variant: "destructive" });
        } else {
          toast({ title: "Submission failed", description: insertError.message, variant: "destructive" });
        }
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      toast({ title: "Payment proof submitted!", description: "We will verify your payment and grant access soon." });
    } catch (err) {
      console.error("Payment submission error:", err);
      toast({ title: "Something went wrong", description: "Please try again", variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] py-12 lg:py-16 bg-gradient-to-b from-primary/[0.02] to-background">
        <div className="container max-w-lg">
          <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Payment Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your payment proof for <strong>{folderName}</strong> has been submitted successfully.
                Our team will verify it shortly. You'll find it under "My Purchases" once approved.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/my-purchases")}>
                  My Purchases
                </Button>
                <Button variant="outline" onClick={() => navigate("/notes-selection")}>
                  Browse More Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 lg:py-16 bg-gradient-to-b from-primary/[0.02] to-background">
      <div className="container max-w-4xl">
        <div className="mb-8 animate-fade-up">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-foreground">Complete Payment</h1>
          <p className="text-muted-foreground">Pay via UPI and submit proof to access your notes</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: QR Code + Order Summary */}
          <div className="space-y-6 animate-fade-up">
            {/* Order summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Folder</span>
                  <span className="font-medium">{folderName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subject</span>
                  <span>{subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span>{department} - {semester}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary flex items-center">
                    <IndianRupee className="h-4 w-4" />{PRICE}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Scan & Pay</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-white p-3 rounded-xl border shadow-sm mb-3">
                  <img
                    src="/payment-qr.jpeg"
                    alt="Payment QR Code"
                    className="w-56 h-56 object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code to pay <strong>₹{PRICE}</strong> via any UPI app
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Payment form */}
          <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyerName">Your Name</Label>
                    <Input
                      id="buyerName"
                      placeholder="Enter your full name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="10-digit phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                    <Input
                      id="accountHolder"
                      placeholder="Name on UPI/Bank account used for payment"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshot">Payment Screenshot</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => document.getElementById("screenshot")?.click()}
                    >
                      {screenshotPreview ? (
                        <div className="space-y-2">
                          <img src={screenshotPreview} alt="Screenshot preview" className="max-h-40 mx-auto rounded-lg" />
                          <p className="text-xs text-muted-foreground">{screenshotFile?.name}</p>
                          <p className="text-xs text-primary">Click to change</p>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload screenshot</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  <Button type="submit" className="w-full h-11 shadow-md shadow-primary/10" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Submit Payment Proof
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
