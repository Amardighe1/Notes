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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/30 to-background py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <Link 
            to="/notes-selection" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Selection
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
              <p className="text-muted-foreground">
                {filteredNotes.length} {filteredNotes.length === 1 ? "resource" : "resources"} available
                {subject && ` for ${subject}`}
              </p>
            </div>
            <Button asChild variant="outline" className="w-fit">
              <Link to="/notes-selection">
                Refine Search
              </Link>
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <Card 
                key={note.id} 
                className="group border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-fade-up overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Subject Badge */}
                <div className={`h-2 bg-gradient-to-r ${getSubjectColor(note.subject)}`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getSubjectColor(note.subject)} flex items-center justify-center flex-shrink-0`}>
                      <BookMarked className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                        {note.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {note.subject}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {note.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span className="px-2 py-1 bg-muted rounded-md">{note.department}</span>
                    <span className="px-2 py-1 bg-muted rounded-md">{note.semester}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Online
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Notes Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any notes matching your criteria. Try adjusting your filters or check back later.
              </p>
              <Button asChild>
                <Link to="/notes-selection">Try Different Filters</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
