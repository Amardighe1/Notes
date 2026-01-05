import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Users, Award, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Notes",
    description: "Access detailed study materials for all semesters, organized by department and subject.",
  },
  {
    icon: Lightbulb,
    title: "Microprojects",
    description: "Ready-to-use microproject ideas and implementations to boost your practical skills.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join thousands of diploma students sharing knowledge and helping each other succeed.",
  },
  {
    icon: Award,
    title: "Capstone Projects",
    description: "Final year project guides and examples to help you create impressive submissions.",
  },
];

const stats = [
  { value: "10,000+", label: "Students" },
  { value: "500+", label: "Notes" },
  { value: "4", label: "Departments" },
  { value: "100+", label: "Projects" },
];

export default function Index() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <span>🎓</span>
              <span>FOR DIPLOMA STUDENTS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Your Diploma{" "}
              <span className="text-gradient">Study Mate</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Access premium notes, microprojects, and capstone projects for AIML, Computer, 
              Mechanical, and Civil engineering students.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-elevated">
                <Link to="/notes-selection">
                  Browse Notes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-primary/20 hover:bg-primary/5">
                <Link to="/projects">
                  Explore Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              DiploMate provides all the resources you need to excel in your diploma studies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-elevated transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Ace Your Diploma?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join thousands of students who are already using DiploMate to excel in their studies.
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full px-8 h-12 text-base">
            <Link to="/notes-selection">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
