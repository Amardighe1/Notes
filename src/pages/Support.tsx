import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Phone, Clock, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get a response within 24 hours",
    value: "support@diplomate.edu",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Available Mon-Fri, 9AM-6PM",
    value: "Start Chat",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "For urgent inquiries",
    value: "+91 9876543210",
  },
];

export default function Support() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
            <MessageCircle className="h-4 w-4" />
            <span>SUPPORT</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">How Can We Help?</h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Our support team is here to assist you with any questions or issues.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {contactMethods.map((method, index) => (
            <Card 
              key={index}
              className="text-center border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="pt-6 pb-5 px-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-3">
                  <method.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{method.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{method.description}</p>
                <p className="text-sm font-medium text-primary">{method.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card className="border-border/50 shadow-elevated animate-fade-up" style={{ animationDelay: "150ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Send us a Message</CardTitle>
            <CardDescription className="text-sm">
              Fill out the form and we'll get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm">Full Name</Label>
                  <Input id="name" placeholder="Your name" className="h-10" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="h-10" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-sm">Subject</Label>
                <Input id="subject" placeholder="How can we help you?" className="h-10" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-sm">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Describe your issue or question..." 
                  rows={4}
                  required 
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Average response: 2-4 hours</span>
                </div>
                <Button type="submit" className="w-full sm:w-auto px-6">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
