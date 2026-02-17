import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  FolderOpen,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  BookMarked,
  ShoppingBag,
} from "lucide-react";

interface PurchaseWithFolder {
  id: string;
  folder_id: string;
  status: string;
  amount: number;
  created_at: string | null;
  rejection_reason: string | null;
  folder_name: string;
  folder_subject: string;
  folder_department: string;
  folder_semester: string;
}

interface DBNote {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
}

export default function MyPurchases() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<PurchaseWithFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [notesByFolder, setNotesByFolder] = useState<Record<string, DBNote[]>>({});
  const [loadingNotes, setLoadingNotes] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchPurchases = async () => {
      setLoading(true);
      // Fetch purchases with folder details via join
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          id, folder_id, status, amount, created_at, rejection_reason,
          folders!inner(name, subject, department, semester)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: PurchaseWithFolder[] = data.map((p: any) => ({
          id: p.id,
          folder_id: p.folder_id,
          status: p.status,
          amount: p.amount,
          created_at: p.created_at,
          rejection_reason: p.rejection_reason,
          folder_name: p.folders.name,
          folder_subject: p.folders.subject,
          folder_department: p.folders.department,
          folder_semester: p.folders.semester,
        }));
        setPurchases(mapped);
      }
      setLoading(false);
    };
    fetchPurchases();
  }, [user, navigate]);

  const handleViewNotes = async (folderId: string) => {
    if (expandedFolder === folderId) {
      setExpandedFolder(null);
      return;
    }
    setExpandedFolder(folderId);

    // Don't refetch if already loaded
    if (notesByFolder[folderId]) return;

    setLoadingNotes(folderId);
    const { data } = await supabase
      .from("notes")
      .select("id, title, description, file_url, file_name, file_size")
      .eq("folder_id", folderId)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (data) {
      setNotesByFolder((prev) => ({ ...prev, [folderId]: data }));
    }
    setLoadingNotes(null);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const approvedPurchases = purchases.filter((p) => p.status === "approved");
  const pendingPurchases = purchases.filter((p) => p.status === "pending");
  const rejectedPurchases = purchases.filter((p) => p.status === "rejected");

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 lg:py-16 bg-gradient-to-b from-primary/[0.02] to-background">
      <div className="container max-w-4xl">
        <div className="mb-8 animate-fade-up">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            My Purchases
          </h1>
          <p className="text-muted-foreground">View and access your purchased notes</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : purchases.length === 0 ? (
          <Card className="border-dashed border-2 border-border bg-muted/20">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Purchases Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Browse our notes collection and purchase what you need.
              </p>
              <Button asChild className="shadow-md shadow-primary/10">
                <Link to="/notes-selection">Browse Notes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Approved */}
            {approvedPurchases.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Approved ({approvedPurchases.length})
                </h2>
                <div className="space-y-4">
                  {approvedPurchases.map((purchase) => {
                    const isExpanded = expandedFolder === purchase.folder_id;
                    const notes = notesByFolder[purchase.folder_id] || [];
                    const isLoadingThisFolder = loadingNotes === purchase.folder_id;

                    return (
                      <Card key={purchase.id} className="border-emerald-100 dark:border-emerald-900/50 overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{purchase.folder_name}</CardTitle>
                                <CardDescription className="text-xs">
                                  {purchase.folder_subject} • {purchase.folder_department} - {purchase.folder_semester}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(purchase.status)}
                              <span className="text-xs text-muted-foreground">{formatDate(purchase.created_at)}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 pb-4">
                          <Button
                            size="sm"
                            variant={isExpanded ? "secondary" : "default"}
                            onClick={() => handleViewNotes(purchase.folder_id)}
                            className="mb-3"
                          >
                            <BookMarked className="mr-1.5 h-3.5 w-3.5" />
                            {isExpanded ? "Hide Notes" : "View Notes"}
                          </Button>

                          {isExpanded && (
                            <div className="mt-2 border-t pt-3">
                              {isLoadingThisFolder ? (
                                <div className="flex items-center gap-2 py-4 justify-center">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-sm text-muted-foreground">Loading notes...</span>
                                </div>
                              ) : notes.length > 0 ? (
                                <div className="space-y-2">
                                  {notes.map((note) => (
                                    <div
                                      key={note.id}
                                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <BookMarked className="h-4 w-4 text-primary flex-shrink-0" />
                                        <div className="min-w-0">
                                          <p className="text-sm font-medium truncate">{note.title}</p>
                                          {note.file_name && (
                                            <p className="text-xs text-muted-foreground truncate">
                                              {note.file_name} {note.file_size ? `(${formatFileSize(note.file_size)})` : ""}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      {note.file_url && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="flex-shrink-0 h-8"
                                          onClick={() => navigate(`/view-notes?folderId=${purchase.folder_id}&noteId=${note.id}&folderName=${encodeURIComponent(purchase.folder_name)}`)}
                                        >
                                          <ExternalLink className="mr-1 h-3 w-3" />
                                          View
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground italic text-center py-4">
                                  No notes uploaded to this folder yet.
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Pending */}
            {pendingPurchases.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Pending Verification ({pendingPurchases.length})
                </h2>
                <div className="space-y-3">
                  {pendingPurchases.map((purchase) => (
                    <Card key={purchase.id} className="border-amber-100 dark:border-amber-900/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                              <FolderOpen className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{purchase.folder_name}</CardTitle>
                              <CardDescription className="text-xs">
                                {purchase.folder_subject} • {purchase.folder_department} - {purchase.folder_semester}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(purchase.status)}
                            <span className="text-xs text-muted-foreground">{formatDate(purchase.created_at)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4">
                        <p className="text-sm text-muted-foreground">
                          Your payment is being verified. You'll get access once approved.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Rejected */}
            {rejectedPurchases.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Rejected ({rejectedPurchases.length})
                </h2>
                <div className="space-y-3">
                  {rejectedPurchases.map((purchase) => (
                    <Card key={purchase.id} className="border-red-100 dark:border-red-900/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                              <FolderOpen className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{purchase.folder_name}</CardTitle>
                              <CardDescription className="text-xs">
                                {purchase.folder_subject} • {purchase.folder_department} - {purchase.folder_semester}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(purchase.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4">
                        {purchase.rejection_reason && (
                          <p className="text-sm text-red-600 mb-2">Reason: {purchase.rejection_reason}</p>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/payment?folderId=${purchase.folder_id}&folderName=${encodeURIComponent(purchase.folder_name)}&subject=${encodeURIComponent(purchase.folder_subject)}&department=${encodeURIComponent(purchase.folder_department)}&semester=${encodeURIComponent(purchase.folder_semester)}`)
                          }
                        >
                          Try Again
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
