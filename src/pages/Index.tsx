import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, Users, Award, ArrowRight, Brain, Monitor, Cog, Building2, FileText } from "lucide-react";

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
    stats: { notes: 45, students: 320, projects: 15 },
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "Computer",
    name: "Computer Engineering",
    shortName: "Computer",
    icon: Monitor,
    description: "Software development, web technologies, databases, and system programming.",
    stats: { notes: 60, students: 450, projects: 22 },
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "Mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    icon: Cog,
    description: "Thermodynamics, manufacturing, automobile engineering, and CAD/CAM technologies.",
    stats: { notes: 38, students: 280, projects: 12 },
    color: "from-orange-500 to-red-500",
  },
  {
    id: "Civil",
    name: "Civil Engineering",
    shortName: "Civil",
    icon: Building2,
    description: "Structural analysis, construction management, surveying, and environmental engineering.",
    stats: { notes: 35, students: 250, projects: 10 },
    color: "from-green-500 to-emerald-600",
  },
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
                <Link to="/notes-selection">
                  Explore Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Building2 className="h-4 w-4" />
              <span>DEPARTMENTS</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Choose Your Department</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select your department to access specialized study materials, projects, and resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <Card 
                key={dept.id}
                className="group border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-fade-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`h-2 bg-gradient-to-r ${dept.color}`} />
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <dept.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{dept.name}</CardTitle>
                      <CardDescription>{dept.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span><strong>{dept.stats.notes}</strong> Notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span><strong>{dept.stats.students}</strong> Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span><strong>{dept.stats.projects}</strong> Projects</span>
                    </div>
                  </div>
                  <Button asChild className="w-full group-hover:translate-x-1 transition-transform">
                    <Link to={`/notes-selection?department=${dept.shortName}`}>
                      Browse {dept.shortName} Notes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
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
