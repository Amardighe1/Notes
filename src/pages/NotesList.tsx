import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notesData } from "@/data/mockData";
import { Download, ExternalLink, ArrowLeft, FileText, BookMarked } from "lucide-react";

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
    ? `Notes for ${department} - ${semester}`
    : "All Notes";

  const subjectIcons: Record<string, typeof FileText> = {
    default: FileText,
  };

  const getSubjectColor = (subjectName: string) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-green-500 to-emerald-500",
      "from-indigo-500 to-violet-500",
    ];
    const index = subjectName.length % colors.length;
    return colors[index];
  };

  return (
    <div className="py-10 lg:py-14 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        {/* Header */}
        <div className="mb-6 animate-fade-up">
          <Link 
            to="/notes-selection" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Selection
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-1">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground">
                {filteredNotes.length} {filteredNotes.length === 1 ? "resource" : "resources"} available
                {subject && ` for ${subject}`}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link to="/notes-selection">Refine Search</Link>
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note, index) => (
              <Card 
                key={note.id} 
                className="group border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-fade-up overflow-hidden"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className={`h-1.5 bg-gradient-to-r ${getSubjectColor(note.subject)}`} />
                
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getSubjectColor(note.subject)} flex items-center justify-center flex-shrink-0`}>
                      <BookMarked className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm leading-tight mb-0.5 group-hover:text-primary transition-colors line-clamp-2">
                        {note.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {note.subject}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {note.description}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs">{note.department}</span>
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs">{note.semester}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="flex-1 h-8 text-xs">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No Notes Found</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                We couldn't find notes matching your criteria. Try different filters.
              </p>
              <Button asChild size="sm">
                <Link to="/notes-selection">Try Different Filters</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
