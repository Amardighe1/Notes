import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notesData } from "@/data/mockData";
import { Download, ExternalLink, ArrowLeft, FileText, BookMarked, FolderOpen } from "lucide-react";

export default function NotesList() {
  const [searchParams] = useSearchParams();
  
  const department = searchParams.get("department") || "";
  const semester = searchParams.get("semester") || "";
  const subject = searchParams.get("subject") || "";

  // Filter notes based on search params
  const filteredNotes = notesData.filter((note) => {
    const matchesDept = !department || note.department === department;
    const matchesSem = !semester || note.semester === semester;
    const matchesSubject = !subject || note.subject === subject;
    return matchesDept && matchesSem && matchesSubject;
  });

  const pageTitle = department && semester
    ? `${department} - ${semester}`
    : "All Notes";

  const getSubjectColor = (subjectName: string) => {
    const colors = [
      { bg: "bg-blue-50", icon: "bg-blue-100", text: "text-blue-600", border: "border-blue-100" },
      { bg: "bg-violet-50", icon: "bg-violet-100", text: "text-violet-600", border: "border-violet-100" },
      { bg: "bg-orange-50", icon: "bg-orange-100", text: "text-orange-600", border: "border-orange-100" },
      { bg: "bg-emerald-50", icon: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-100" },
      { bg: "bg-pink-50", icon: "bg-pink-100", text: "text-pink-600", border: "border-pink-100" },
    ];
    const index = subjectName.length % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 lg:py-16 bg-gradient-to-b from-primary/[0.02] to-background">
      <div className="container">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <Link 
            to="/notes-selection" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Selection
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-foreground">{pageTitle}</h1>
              <p className="text-muted-foreground">
                {filteredNotes.length} {filteredNotes.length === 1 ? "resource" : "resources"} available
                {subject && ` for ${subject}`}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-fit border-border hover:border-primary/30 hover:text-primary">
              <Link to="/notes-selection">Refine Search</Link>
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredNotes.map((note, index) => {
              const colorScheme = getSubjectColor(note.subject);
              return (
                <Card 
                  key={note.id} 
                  className={`group border ${colorScheme.border} ${colorScheme.bg} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-up overflow-hidden`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl ${colorScheme.icon} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <BookMarked className={`h-5 w-5 ${colorScheme.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm leading-tight mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {note.title}
                        </CardTitle>
                        <CardDescription className={`text-xs ${colorScheme.text} font-medium`}>
                          {note.subject}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {note.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <span className="px-2 py-1 bg-background/80 rounded-md border border-border/50">{note.department}</span>
                      <span className="px-2 py-1 bg-background/80 rounded-md border border-border/50">{note.semester}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1 h-9 text-sm shadow-md shadow-primary/10">
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-9 text-sm border-border/50 bg-background/50 hover:bg-background hover:border-primary/30 hover:text-primary">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-border bg-muted/20">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Notes Found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                We couldn't find notes matching your criteria. Try different filters.
              </p>
              <Button asChild className="shadow-md shadow-primary/10">
                <Link to="/notes-selection">Try Different Filters</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
