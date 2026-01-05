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
    <div className="min-h-[calc(100vh-4rem)] py-16">
      <div className="container max-w-5xl">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <MessageCircle className="h-4 w-4" />
            <span>SUPPORT</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our support team is here to assist you with any questions or issues you may have.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card 
              key={index}
              className="text-center border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                <p className="text-sm font-medium text-primary">{method.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/50 shadow-elevated animate-fade-up" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help you?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Describe your issue or question in detail..." 
                  rows={5}
                  required 
                />
              </div>
              <Button type="submit" className="w-full md:w-auto px-8">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "400ms" }}>
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Average response time: 2-4 hours during business hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
