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
import { Search, BookOpen } from "lucide-react";

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
    <div className="py-12 lg:py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-primary mb-4">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Find Your Notes</h1>
          <p className="text-sm text-muted-foreground">
            Select your department, semester, and subject to access study materials.
          </p>
        </div>

        {/* Filter Card */}
        <Card className="border-border/50 shadow-elevated animate-fade-up" style={{ animationDelay: "50ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filter Notes</CardTitle>
            <CardDescription className="text-sm">
              Choose your preferences to find relevant materials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="py-2.5">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Semester</label>
              <Select value={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem} className="py-2.5">
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Subject (Optional)</label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={availableSubjects.length === 0}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={
                    availableSubjects.length === 0 
                      ? "Select dept & semester first" 
                      : "Select subject (or leave blank)"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="py-2.5">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleFindNotes}
              disabled={!selectedDept || !selectedSem}
              className="w-full h-10 mt-2"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Notes
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-6 text-center animate-fade-up" style={{ animationDelay: "100ms" }}>
          <p className="text-xs text-muted-foreground mb-3">Popular Searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["AIML - Sem 3", "Computer - Sem 2", "Mechanical - Sem 4"].map((quick) => (
              <Button
                key={quick}
                variant="outline"
                size="sm"
                className="rounded-full text-xs h-7 px-3 border-primary/20 hover:bg-primary/5"
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
