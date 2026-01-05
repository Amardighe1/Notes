import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Monitor, Cog, Building2, ArrowRight, BookOpen, Users, FileText } from "lucide-react";

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

export default function Departments() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-16">
      <div className="container">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Building2 className="h-4 w-4" />
            <span>DEPARTMENTS</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Choose Your Department</h1>
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
    </div>
  );
}
