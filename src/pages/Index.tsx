import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, Users, Award, ArrowRight, Brain, Monitor, Cog, Building2, Sparkles, CheckCircle2 } from "lucide-react";

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

const departments = [
  {
    id: "AIML",
    name: "AI & Machine Learning",
    shortName: "AIML",
    icon: Brain,
    description: "Explore artificial intelligence, machine learning, deep learning, and data science concepts.",
    color: "bg-violet-50 border-violet-100",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    accent: "text-violet-600",
  },
  {
    id: "Computer",
    name: "Computer Engineering",
    shortName: "Computer",
    icon: Monitor,
    description: "Software development, web technologies, databases, and system programming.",
    color: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    accent: "text-blue-600",
  },
  {
    id: "Mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    icon: Cog,
    description: "Thermodynamics, manufacturing, automobile engineering, and CAD/CAM technologies.",
    color: "bg-orange-50 border-orange-100",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    accent: "text-orange-600",
  },
  {
    id: "Civil",
    name: "Civil Engineering",
    shortName: "Civil",
    icon: Building2,
    description: "Structural analysis, construction management, surveying, and environmental engineering.",
    color: "bg-emerald-50 border-emerald-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accent: "text-emerald-600",
  },
];

const benefits = [
  "Organized by department",
  "Updated for latest syllabus",
  "Expert-curated content",
  "Download anytime",
];

export default function Index() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Light & Clean */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] to-background py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.04),transparent_50%)]" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>FOR DIPLOMA STUDENTS</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-5 text-foreground">
              Your Diploma{" "}
              <span className="text-primary">Study Mate</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Access premium notes, microprojects, and capstone projects for AIML, Computer, 
              Mechanical, and Civil engineering students.
            </p>
            
            {/* Benefits list */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/notes-selection">
                  Browse Notes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-border hover:bg-muted/50">
                <Link to="/projects">
                  Explore Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section - Light Cards */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Departments</p>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">Choose Your Department</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Select your department to access specialized study materials and resources.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {departments.map((dept, index) => (
              <Card 
                key={dept.id}
                className={`group border ${dept.color} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-up overflow-hidden`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-11 h-11 rounded-xl ${dept.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <dept.icon className={`h-5 w-5 ${dept.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-foreground">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <CardDescription className="text-sm mb-4 line-clamp-2 text-muted-foreground">{dept.description}</CardDescription>
                  <Button asChild size="sm" variant="outline" className="w-full h-9 text-sm border-border hover:bg-muted/50 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                    <Link to={`/notes-selection?department=${dept.shortName}`}>
                      Browse Notes
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Features</p>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              DiploMate provides all the resources you need to excel in your diploma studies.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Soft Gradient */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Ace Your Diploma?
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
              Start using DiploMate to excel in your diploma studies.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
              <Link to="/notes-selection">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
