import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Rocket, Code, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const projectTypes = [
  {
    icon: Lightbulb,
    title: "Microprojects",
    description: "Small-scale projects perfect for learning and quick implementation. Ideal for semester submissions.",
    count: "50+ Projects",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Rocket,
    title: "Capstone Projects",
    description: "Comprehensive final year projects with complete documentation and source code.",
    count: "30+ Projects",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Code,
    title: "Mini Projects",
    description: "Medium complexity projects that demonstrate practical application of concepts.",
    count: "40+ Projects",
    color: "from-green-500 to-emerald-500",
  },
];

export default function Projects() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-16">
      <div className="container">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Rocket className="h-4 w-4" />
            <span>PROJECT HUB</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Explore Projects</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover a wide range of projects tailored for diploma students across all departments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {projectTypes.map((type, index) => (
            <Card 
              key={index} 
              className="group border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-fade-up overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`h-2 bg-gradient-to-r ${type.color}`} />
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <type.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription className="text-sm">{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{type.count}</span>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-3">Need a Custom Project?</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Can't find what you're looking for? Request a custom project tailored to your requirements.
            </p>
            <Button className="rounded-full px-8">
              Request Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
