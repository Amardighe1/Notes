import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is DiploMate?",
        a: "DiploMate is a comprehensive educational platform designed specifically for diploma engineering students. We provide study notes, microprojects, and capstone project resources for AIML, Computer, Mechanical, and Civil engineering departments.",
      },
      {
        q: "Is DiploMate free to use?",
        a: "Yes! DiploMate offers free access to most of our study materials. Some premium resources and advanced project guides may require a subscription in the future.",
      },
      {
        q: "Which departments are supported?",
        a: "We currently support four departments: AI & Machine Learning (AIML), Computer Engineering, Mechanical Engineering, and Civil Engineering. Each department has materials for all six semesters.",
      },
    ],
  },
  {
    category: "Notes & Materials",
    questions: [
      {
        q: "How do I find notes for my subject?",
        a: "Navigate to the 'Notes' section from the navigation bar or click 'Browse Notes' on the homepage. Select your department, semester, and subject to find relevant study materials.",
      },
      {
        q: "Can I download notes for offline use?",
        a: "Yes, all notes are available for download in PDF format. Simply click the 'Download PDF' button on any note card to save it to your device.",
      },
      {
        q: "How often are notes updated?",
        a: "We regularly update our content to align with the latest syllabus. Major updates happen at the start of each academic year, with minor additions throughout the year.",
      },
    ],
  },
  {
    category: "Projects",
    questions: [
      {
        q: "What types of projects are available?",
        a: "We offer three types of projects: Microprojects (small-scale, semester projects), Mini Projects (medium complexity), and Capstone Projects (final year comprehensive projects).",
      },
      {
        q: "Can I request a custom project?",
        a: "Yes! If you can't find a project that suits your needs, you can request a custom project through our Support page. Our team will work with you to create tailored project documentation.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "Do I need an account to access materials?",
        a: "Currently, you can browse and download most materials without an account. However, creating an account allows you to save favorites, track your progress, and access premium content.",
      },
      {
        q: "How can I contact support?",
        a: "You can reach our support team through the Support page via email, live chat (during business hours), or phone. We typically respond within 2-4 hours during business hours.",
      },
    ],
  },
];

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="py-12 lg:py-16">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>FAQs</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-sm">
            Find answers to common questions about DiploMate.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 animate-fade-up" style={{ animationDelay: "50ms" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-5">
          {filteredFaqs.map((category, categoryIndex) => (
            <div 
              key={category.category} 
              className="animate-fade-up"
              style={{ animationDelay: `${(categoryIndex + 1) * 50}ms` }}
            >
              <h2 className="text-sm font-semibold mb-2 text-primary">{category.category}</h2>
              <Card className="border-border/50">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${category.category}-${index}`}
                        className="border-border/50"
                      >
                        <AccordionTrigger className="px-4 py-3 text-left text-sm hover:no-underline hover:bg-muted/50">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <Card className="border-dashed border-2 border-border animate-fade-up">
            <CardContent className="py-10 text-center">
              <HelpCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-1">No Results Found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search query.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: "250ms" }}>
          <p className="text-sm text-muted-foreground">
            Didn't find what you're looking for?{" "}
            <a href="/support" className="text-primary font-medium hover:underline">
              Contact support →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
