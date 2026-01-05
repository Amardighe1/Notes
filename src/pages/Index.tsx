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
      {/* Hero Section - Compact */}
      <section className="relative overflow-hidden bg-background py-12 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-5">
              <span>🎓</span>
              <span>FOR DIPLOMA STUDENTS</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
              Your Diploma{" "}
              <span className="text-gradient">Study Mate</span>
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
              Access premium notes, microprojects, and capstone projects for AIML, Computer, 
              Mechanical, and Civil engineering students.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-6 h-11 text-sm shadow-elevated">
                <Link to="/notes-selection">
                  Browse Notes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6 h-11 text-sm border-primary/20 hover:bg-primary/5">
                <Link to="/notes-selection">
                  Explore Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section - Tighter Grid */}
      <section className="py-10 lg:py-14 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-3">
              <Building2 className="h-4 w-4" />
              <span>DEPARTMENTS</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Choose Your Department</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Select your department to access specialized study materials and resources.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept, index) => (
              <Card 
                key={dept.id}
                className="group border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-fade-up overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`h-1.5 bg-gradient-to-r ${dept.color}`} />
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${dept.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <dept.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-base">{dept.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <CardDescription className="text-xs mb-3 line-clamp-2">{dept.description}</CardDescription>
                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {dept.stats.notes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {dept.stats.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {dept.stats.projects}
                    </span>
                  </div>
                  <Button asChild size="sm" className="w-full h-8 text-xs">
                    <Link to={`/notes-selection?department=${dept.shortName}`}>
                      Browse Notes
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Compact Grid */}
      <section className="py-10 lg:py-14">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              DiploMate provides all the resources you need to excel in your diploma studies.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Compact */}
      <section className="py-10 lg:py-12 bg-gradient-primary">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-2">
            Ready to Ace Your Diploma?
          </h2>
          <p className="text-primary-foreground/80 text-sm max-w-md mx-auto mb-5">
            Join thousands of students already using DiploMate to excel.
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full px-6 h-11 text-sm">
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
