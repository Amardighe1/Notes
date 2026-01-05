import { FileText, Shield, CreditCard, AlertCircle, Scale, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    icon: FileText,
    title: "1. Terms of Use",
    content: [
      "By accessing and using DiploMate, you accept and agree to be bound by these terms and conditions.",
      "DiploMate provides educational resources including study notes, project materials, and learning resources for diploma engineering students.",
      "You must be at least 16 years old to use this service. If you are under 18, you must have parental consent.",
      "You agree not to redistribute, sell, or commercially exploit any content from DiploMate without explicit written permission.",
    ],
  },
  {
    icon: CreditCard,
    title: "2. Payment Terms",
    content: [
      "Free tier users can access basic study materials at no cost.",
      "Premium subscriptions are billed monthly or annually. Prices are displayed in INR and include applicable taxes.",
      "Payments are processed securely through our payment partners. We accept UPI, credit/debit cards, and net banking.",
      "Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date.",
      "Refunds are available within 7 days of purchase if you haven't downloaded more than 5 premium resources.",
    ],
  },
  {
    icon: Shield,
    title: "3. Privacy & Data",
    content: [
      "We collect only necessary information: email, name, and payment details for premium users.",
      "Your data is encrypted and stored securely. We never sell your personal information to third parties.",
      "We use analytics to improve our services. You can opt out of non-essential tracking in your account settings.",
      "You can request data deletion by contacting support@diplomate.edu.",
    ],
  },
  {
    icon: AlertCircle,
    title: "4. Content & Liability",
    content: [
      "All study materials are provided for educational purposes only and may not reflect the latest syllabus changes.",
      "DiploMate is not responsible for any academic outcomes resulting from the use of our materials.",
      "We make every effort to ensure accuracy but cannot guarantee error-free content.",
      "Users are responsible for verifying information with official sources before examinations.",
    ],
  },
  {
    icon: Scale,
    title: "5. Intellectual Property",
    content: [
      "All content on DiploMate is protected by copyright and intellectual property laws.",
      "You may download and use materials for personal, non-commercial educational purposes only.",
      "Sharing account credentials or redistributing content is strictly prohibited.",
      "Violations may result in account termination without refund.",
    ],
  },
  {
    icon: Clock,
    title: "6. Updates & Changes",
    content: [
      "We reserve the right to modify these terms at any time. Users will be notified of significant changes via email.",
      "Continued use of DiploMate after changes constitutes acceptance of the new terms.",
      "Last updated: January 2025",
    ],
  },
];

export default function Terms() {
  return (
    <div className="py-12 lg:py-16">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Scale className="h-4 w-4" />
            <span>LEGAL</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Please read these terms carefully before using DiploMate services.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card 
              key={section.title}
              className="border-border/50 hover:border-primary/20 transition-colors animate-fade-up overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5 lg:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <section.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: "300ms" }}>
          <p className="text-sm text-muted-foreground">
            Questions about these terms?{" "}
            <a href="/support" className="text-primary font-medium hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
