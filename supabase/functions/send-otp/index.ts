import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Gmail SMTP credentials
const GMAIL_USER = "amardighe16@gmail.com";
const GMAIL_APP_PASSWORD = "eshevdmmtktdzclv";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Store OTP in database (expires in 5 minutes)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Delete any existing OTPs for this email
    await supabase.from("email_otps").delete().eq("email", cleanEmail);

    // Insert new OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const { error: insertError } = await supabase
      .from("email_otps")
      .insert({ email: cleanEmail, otp, expires_at: expiresAt });

    if (insertError) {
      throw new Error(`Failed to store OTP: ${insertError.message}`);
    }

    // Send email via Gmail SMTP using nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"DiploMate" <${GMAIL_USER}>`,
      to: cleanEmail,
      subject: "DiploMate - Email Verification Code",
      text: `Your verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you did not request this code, please ignore this email.`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #1e293b; font-size: 24px; margin: 0;">🎓 DiploMate</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Email Verification</p>
          </div>
          <div style="text-align: center; padding: 24px; background: #f1f5f9; border-radius: 8px; margin-bottom: 24px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 12px 0;">Your verification code is:</p>
            <h2 style="color: #3b82f6; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h2>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            This code expires in 5 minutes.<br/>
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-otp error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send OTP" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
