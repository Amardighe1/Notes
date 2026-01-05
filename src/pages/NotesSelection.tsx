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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/30 to-background py-16">
      <div className="container max-w-2xl">
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-6">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Find Your Notes</h1>
          <p className="text-muted-foreground">
            Select your department, semester, and subject to access study materials.
          </p>
        </div>

        <Card className="border-border/50 shadow-elevated animate-fade-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="text-xl">Filter Notes</CardTitle>
            <CardDescription>
              Choose your preferences to find relevant study materials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Department Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="py-3">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semester Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <Select value={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem} className="py-3">
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject (Optional)</label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={availableSubjects.length === 0}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={
                    availableSubjects.length === 0 
                      ? "Select department and semester first" 
                      : "Select subject (or leave blank for all)"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="py-3">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleFindNotes}
              disabled={!selectedDept || !selectedSem}
              className="w-full h-12 rounded-lg text-base"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Notes
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-10 text-center animate-fade-up" style={{ animationDelay: "200ms" }}>
          <p className="text-sm text-muted-foreground mb-4">Popular Searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["AIML - Sem 3", "Computer - Sem 2", "Mechanical - Sem 4"].map((quick) => (
              <Button
                key={quick}
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-primary/20 hover:bg-primary/5"
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
