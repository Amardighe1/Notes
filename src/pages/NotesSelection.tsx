import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments, semesters, subjectsByDeptSem } from "@/data/mockData";
import { Search, BookOpen, Sparkles } from "lucide-react";

export default function NotesSelection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedSem, setSelectedSem] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  // Auto-fill department from URL params
  useEffect(() => {
    const deptParam = searchParams.get("department");
    if (deptParam && departments.includes(deptParam as typeof departments[number])) {
      setSelectedDept(deptParam);
    }
  }, [searchParams]);

  // Get available subjects based on selection
  const availableSubjects = selectedDept && selectedSem
    ? subjectsByDeptSem[selectedDept]?.[selectedSem] || []
    : [];

  // Reset subject when dept or sem changes
  useEffect(() => {
    setSelectedSubject("");
  }, [selectedDept, selectedSem]);

  const handleFindNotes = () => {
    const params = new URLSearchParams();
    if (selectedDept) params.set("department", selectedDept);
    if (selectedSem) params.set("semester", selectedSem);
    if (selectedSubject) params.set("subject", selectedSubject);
    navigate(`/notes-list?${params.toString()}`);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-16 lg:py-20 bg-gradient-to-b from-primary/[0.02] to-background">
      <div className="container max-w-xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">Find Your Notes</h1>
          <p className="text-muted-foreground">
            Select your department, semester, and subject to access study materials.
          </p>
        </div>

        {/* Filter Card */}
        <Card className="border-border bg-background shadow-xl shadow-primary/5 animate-fade-up" style={{ animationDelay: "50ms" }}>
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-xl text-foreground">Filter Notes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose your preferences to find relevant materials
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="py-2.5 focus:bg-primary/5">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Semester</label>
              <Select value={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem} className="py-2.5 focus:bg-primary/5">
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject (Optional)</label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={availableSubjects.length === 0}
              >
                <SelectTrigger className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder={
                    availableSubjects.length === 0 
                      ? "Select dept & semester first" 
                      : "Select subject (or leave blank)"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="py-2.5 focus:bg-primary/5">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleFindNotes}
              disabled={!selectedDept || !selectedSem}
              className="w-full h-11 mt-2 shadow-lg shadow-primary/20"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Notes
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Popular Searches</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["AIML - Sem 3", "Computer - Sem 2", "Mechanical - Sem 4"].map((quick) => (
              <Button
                key={quick}
                variant="outline"
                size="sm"
                className="rounded-full text-sm h-8 px-4 bg-background border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => {
                  const [dept, sem] = quick.split(" - ");
                  setSelectedDept(dept);
                  setSelectedSem(sem);
                }}
              >
                {quick}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
