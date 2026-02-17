import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FolderOpen, Loader2, ShoppingCart, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DBFolder {
  id: string;
  name: string;
  department: string;
  semester: string;
  subject: string;
  description: string | null;
  notes_count: number | null;
}

const PRICE = 199;

export default function NotesList() {
  const [searchParams] = useSearchParams();
  const [folders, setFolders] = useState<DBFolder[]>([]);
  const [purchaseMap, setPurchaseMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const department = searchParams.get("department") || "";
  const semester = searchParams.get("semester") || "";

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        let folderQuery = supabase
          .from("folders")
          .select("id, name, department, semester, subject, description, notes_count")
          .eq("is_active", true)
          .abortSignal(controller.signal);
        if (department) folderQuery = folderQuery.eq("department", department);
        if (semester) folderQuery = folderQuery.eq("semester", semester);

        const { data: folderData, error: folderError } = await folderQuery.order("created_at", { ascending: false });

        if (folderError) {
          if (folderError.message?.includes("aborted")) return;
          console.error("Error fetching folders:", folderError);
          setFolders([]);
          setLoading(false);
          return;
        }

        setFolders(folderData || []);

        // Fetch user's purchase statuses
        if (user && folderData && folderData.length > 0) {
          const folderIds = folderData.map((f) => f.id);
          const { data: purchases } = await supabase
            .from("purchases")
            .select("folder_id, status")
            .eq("user_id", user.id)
            .in("folder_id", folderIds)
            .abortSignal(controller.signal);

          if (purchases) {
            const map: Record<string, string> = {};
            for (const p of purchases) {
              map[p.folder_id] = p.status;
            }
            setPurchaseMap(map);
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Unexpected error:", err);
        setFolders([]);
      }
      setLoading(false);
    };
    fetchData();
    return () => controller.abort();
  }, [department, semester, user]);

  const pageTitle = department && semester
    ? `${department} - ${semester}`
    : department
    ? `${department} Notes`
    : "All Notes";

  const handleBuyNow = (folder: DBFolder) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/payment?folderId=${folder.id}&folderName=${encodeURIComponent(folder.name)}&subject=${encodeURIComponent(folder.subject)}&department=${encodeURIComponent(folder.department)}&semester=${encodeURIComponent(folder.semester)}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Purchased
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Verification
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected — Buy Again
          </Badge>
        );
      default:
        return null;
    }
  };

  const colors = [
    { bg: "bg-blue-50 dark:bg-blue-950/30", icon: "bg-blue-100 dark:bg-blue-900/50", text: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-900/50" },
    { bg: "bg-violet-50 dark:bg-violet-950/30", icon: "bg-violet-100 dark:bg-violet-900/50", text: "text-violet-600 dark:text-violet-400", border: "border-violet-100 dark:border-violet-900/50" },
    { bg: "bg-orange-50 dark:bg-orange-950/30", icon: "bg-orange-100 dark:bg-orange-900/50", text: "text-orange-600 dark:text-orange-400", border: "border-orange-100 dark:border-orange-900/50" },
    { bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: "bg-emerald-100 dark:bg-emerald-900/50", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-900/50" },
    { bg: "bg-pink-50 dark:bg-pink-950/30", icon: "bg-pink-100 dark:bg-pink-900/50", text: "text-pink-600 dark:text-pink-400", border: "border-pink-100 dark:border-pink-900/50" },
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 lg:py-16 bg-gradient-to-b from-primary/[0.02] to-background">
      <div className="container">
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
                {loading ? "Loading..." : `${folders.length} ${folders.length === 1 ? "folder" : "folders"} available`}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-fit border-border hover:border-primary/30 hover:text-primary">
              <Link to="/notes-selection">Refine Search</Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : folders.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {folders.map((folder, index) => {
              const colorScheme = colors[index % colors.length];
              const status = purchaseMap[folder.id];
              const canBuy = !status || status === "rejected";

              return (
                <Card
                  key={folder.id}
                  className={`group border ${colorScheme.border} ${colorScheme.bg} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden animate-fade-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl ${colorScheme.icon} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <FolderOpen className={`h-6 w-6 ${colorScheme.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight mb-1 text-foreground group-hover:text-primary transition-colors">
                          {folder.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {folder.subject} • {folder.notes_count || 0} {(folder.notes_count || 0) === 1 ? "note" : "notes"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pb-5">
                    {folder.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {folder.description}
                      </p>
                    )}

                    {status && (
                      <div className="mb-3">
                        {getStatusBadge(status)}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg font-bold text-foreground">₹{PRICE}</span>
                      {canBuy ? (
                        <Button
                          size="sm"
                          className="h-9 px-4 shadow-md shadow-primary/10"
                          onClick={() => handleBuyNow(folder)}
                        >
                          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                          Buy Now
                        </Button>
                      ) : status === "approved" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-4 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => navigate(`/view-notes?folderId=${folder.id}&folderName=${encodeURIComponent(folder.name)}`)}
                        >
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          View Notes
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Awaiting review...</span>
                      )}
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
