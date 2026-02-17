import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { departments, semesters } from "@/data/mockData";
import { Lightbulb, Rocket, ArrowRight, ExternalLink, Github, Search } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  department: string;
  semester: string;
  project_type: string;
  author: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  is_featured: boolean | null;
}

export default function Projects() {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedSem, setSelectedSem] = useState<string>("all");
  const [activeTab, setActiveTab] = useState(searchParams.get("type") || "microproject");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from("projects").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (data) setProjects(data as Project[]);
    setLoading(false);
  };

  const filteredProjects = projects.filter(p => {
    if (p.project_type !== activeTab) return false;
    if (selectedDept !== "all" && p.department !== selectedDept) return false;
    if (selectedSem !== "all" && p.semester !== selectedSem) return false;
    return true;
  });

  const microCount = projects.filter(p => p.project_type === "microproject").length;
  const capstoneCount = projects.filter(p => p.project_type === "capstone").length;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-16">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Rocket className="h-4 w-4" />
            <span>PROJECT HUB</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Explore Projects</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover projects tailored for diploma students across all departments.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="microproject" className="gap-1.5">
                <Lightbulb className="h-4 w-4" />
                Microprojects
                <Badge variant="secondary" className="ml-1 text-xs">{microCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="capstone" className="gap-1.5">
                <Rocket className="h-4 w-4" />
                Capstone
                <Badge variant="secondary" className="ml-1 text-xs">{capstoneCount}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-9 w-[140px] bg-background">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Depts</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger className="h-9 w-[130px] bg-background">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Sems</SelectItem>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="microproject">
            <ProjectGrid projects={filteredProjects} loading={loading} type="microproject" />
          </TabsContent>
          <TabsContent value="capstone">
            <ProjectGrid projects={filteredProjects} loading={loading} type="capstone" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProjectGrid({ projects, loading, type }: { projects: Project[]; loading: boolean; type: string }) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="border-border/50 animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-3/4 mb-3" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border">
        <CardContent className="py-16 text-center">
          <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-1">No Projects Found</h3>
          <p className="text-sm text-muted-foreground">
            {type === "microproject" ? "No microprojects match your filters." : "No capstone projects match your filters."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="group border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 overflow-hidden">
          <div className={`h-1.5 bg-gradient-to-r ${type === "microproject" ? "from-amber-500 to-orange-500" : "from-purple-500 to-pink-500"}`} />
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{project.title}</CardTitle>
              {project.is_featured && <Badge className="text-[10px]">Featured</Badge>}
            </div>
            <CardDescription className="text-sm line-clamp-2">{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">{project.department}</Badge>
              <Badge variant="outline" className="text-xs">{project.semester}</Badge>
            </div>
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tech_stack.map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 bg-muted rounded-full text-[11px] text-muted-foreground">{tech}</span>
                ))}
              </div>
            )}
            {project.author && (
              <p className="text-xs text-muted-foreground mb-3">By {project.author}</p>
            )}
            <div className="flex items-center gap-2 pt-3 border-t border-border/50">
              {project.github_url && (
                <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                  <a href={project.github_url} target="_blank" rel="noreferrer">
                    <Github className="mr-1 h-3.5 w-3.5" />
                    Code
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                  <a href={project.demo_url} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-1 h-3.5 w-3.5" />
                    Demo
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
