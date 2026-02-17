import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, Loader2, Lock, BookMarked,
  ChevronLeft, ChevronRight, RefreshCw,
} from "lucide-react";

interface NoteFile {
  id: string;
  title: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
}

export default function NoteViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const folderId = searchParams.get("folderId") || "";
  const noteId = searchParams.get("noteId") || "";
  const folderName = searchParams.get("folderName") || "Notes";

  const [notes, setNotes] = useState<NoteFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // ----- Screenshot / Screen Recording Protection -----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.key === "P")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleVisibilityChange = () => {
      const overlay = document.getElementById("screen-protect-overlay");
      if (overlay) {
        overlay.style.display = document.hidden ? "flex" : "none";
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Verify purchase and load notes list
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!folderId) {
      navigate("/my-purchases");
      return;
    }

    const verify = async () => {
      setLoading(true);

      const { data: purchase } = await supabase
        .from("purchases")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("folder_id", folderId)
        .eq("status", "approved")
        .single();

      if (!purchase) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);

      const { data: notesData } = await supabase
        .from("notes")
        .select("id, title, file_url, file_name, file_size")
        .eq("folder_id", folderId)
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (notesData) {
        setNotes(notesData);
        if (noteId) {
          const idx = notesData.findIndex((n) => n.id === noteId);
          if (idx >= 0) setCurrentIndex(idx);
        }
      }
      setLoading(false);
    };

    verify();
  }, [user, folderId, noteId, navigate]);

  // Reset iframe loading state when switching notes
  useEffect(() => {
    setIframeLoading(true);
    setIframeKey((k) => k + 1);
  }, [currentIndex]);

  const currentNote = notes[currentIndex];

  // Build Google Docs Viewer URL
  const getViewerUrl = (fileUrl: string): string => {
    const encodedUrl = encodeURIComponent(fileUrl);
    return `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const handleRetry = () => {
    setIframeLoading(true);
    setIframeKey((k) => k + 1);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // ---------- Render ----------

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-[calc(100vh-200px)] py-12 lg:py-16 bg-gradient-to-b from-primary/[0.02] to-background">
        <div className="container max-w-lg">
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                You don't have access to these notes. Please purchase this folder first.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/notes-selection")}>Browse Notes</Button>
                <Button variant="outline" onClick={() => navigate("/my-purchases")}>My Purchases</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] py-12 lg:py-16 bg-gradient-to-b from-primary/[0.02] to-background">
        <div className="container max-w-lg">
          <Card className="border-dashed border-2 border-border">
            <CardContent className="py-12 text-center">
              <BookMarked className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h2 className="text-xl font-bold mb-2">No Notes Yet</h2>
              <p className="text-muted-foreground mb-4">Notes haven't been uploaded to this folder yet.</p>
              <Button variant="outline" onClick={() => navigate("/my-purchases")}>Back to Purchases</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-200px)] py-4 lg:py-6 bg-gradient-to-b from-primary/[0.02] to-background"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Protection overlay — shown when app loses focus */}
      <div
        id="screen-protect-overlay"
        className="fixed inset-0 z-[9999] bg-background items-center justify-center"
        style={{ display: "none" }}
      >
        <div className="text-center">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground">Content Protected</p>
          <p className="text-muted-foreground text-sm mt-1">Return to the app to view notes</p>
        </div>
      </div>

      <div className="container">
        {/* Header */}
        <div className="mb-3 animate-fade-up">
          <Link
            to="/my-purchases"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2 group"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to My Purchases
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">{decodeURIComponent(folderName)}</h1>
              <p className="text-xs text-muted-foreground">
                {currentNote?.title}
                {currentNote?.file_name && ` • ${currentNote.file_name}`}
                {currentNote?.file_size ? ` (${formatFileSize(currentNote.file_size)})` : ""}
              </p>
            </div>

            {/* Note navigation (multi-note folders) */}
            {notes.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => i - 1)}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground px-1">
                  {currentIndex + 1} / {notes.length}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentIndex === notes.length - 1}
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Notes list sidebar + PDF viewer */}
        <div className="flex gap-4 animate-fade-up" style={{ animationDelay: "50ms" }}>
          {/* Sidebar — note list (visible on lg+) */}
          {notes.length > 1 && (
            <div className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-20 space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-2">
                  Notes ({notes.length})
                </p>
                {notes.map((note, idx) => (
                  <button
                    key={note.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      idx === currentIndex
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookMarked className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{note.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PDF Viewer via Google Docs Viewer */}
          <div className="flex-1 min-w-0">
            {currentNote?.file_url ? (
              <div className="rounded-xl border border-border overflow-hidden bg-background shadow-sm flex flex-col">
                {/* Toolbar with reload button */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
                  <span className="text-xs text-muted-foreground">
                    PDF Viewer — {currentNote.title}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRetry}
                    className="h-7 gap-1.5 text-xs"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reload
                  </Button>
                </div>

                {/* Iframe Container */}
                <div
                  className="relative"
                  style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}
                >
                  {/* Loading overlay */}
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                      <p className="text-sm text-muted-foreground">Loading PDF...</p>
                      <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
                    </div>
                  )}

                  {/* Google Docs Viewer iframe — no allow-popups so open-in-new-tab is blocked */}
                  <iframe
                    key={iframeKey}
                    src={getViewerUrl(currentNote.file_url)}
                    title={currentNote.title}
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    sandbox="allow-scripts allow-same-origin"
                    style={{ background: "#fff" }}
                  />
                </div>
              </div>
            ) : (
              <Card className="border-dashed border-2 border-border">
                <CardContent className="py-16 text-center">
                  <BookMarked className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No file attached to this note.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
