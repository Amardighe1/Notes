import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { semesters, subjectsByDeptSem } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Plus, 
  Pencil, 
  Trash2,
  Upload,
  GraduationCap,
  Brain,
  Monitor,
  Cog,
  Building2,
  Download,
  Eye,
  ArrowLeft,
  ChevronRight,
  FolderOpen,
  Folder as FolderIcon,
  ArrowLeftCircle,
  Rocket,
  Lightbulb,
  Search,
  Shield,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const departmentSections = [
  { id: "aiml", label: "AIML Notes", department: "AIML", icon: Brain, color: "from-violet-500 to-purple-600" },
  { id: "computer", label: "Computer Notes", department: "Computer", icon: Monitor, color: "from-blue-500 to-cyan-500" },
  { id: "mechanical", label: "Mechanical Notes", department: "Mechanical", icon: Cog, color: "from-orange-500 to-red-500" },
  { id: "civil", label: "Civil Notes", department: "Civil", icon: Building2, color: "from-green-500 to-emerald-600" },
];

interface DBFolder {
  id: string;
  name: string;
  department: string;
  semester: string;
  subject: string;
  description: string | null;
  notes_count: number | null;
  is_active: boolean | null;
  is_custom_subject: boolean | null;
  custom_subject_id: string | null;
}

interface DBNote {
  id: string;
  title: string;
  description: string | null;
  folder_id: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  download_count: number | null;
  view_count: number | null;
  is_active: boolean | null;
}

interface DBProject {
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
  is_active: boolean | null;
  is_featured: boolean | null;
  created_at: string | null;
}

interface DBProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  department: string | null;
  semester: string | null;
  is_verified: boolean | null;
  created_at: string | null;
  last_login_at: string | null;
}

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [folders, setFolders] = useState<DBFolder[]>([]);
  const [notes, setNotes] = useState<DBNote[]>([]);
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [users, setUsers] = useState<DBProfile[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dialogs
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<DBFolder | null>(null);
  const [editingNote, setEditingNote] = useState<DBNote | null>(null);
  const [editingProject, setEditingProject] = useState<DBProject | null>(null);
  
  // Current view state
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<DBFolder | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Settings state
  const [settingsData, setSettingsData] = useState({
    siteName: "DiploMate",
    siteDescription: "Your Diploma Study Mate",
    maintenanceMode: false,
    allowRegistration: true,
    maxUploadSize: "10",
  });

  // Custom subject
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState("");

  // Form data
  const [folderFormData, setFolderFormData] = useState({
    name: "",
    department: "",
    semester: "",
    subject: "",
    description: "",
  });

  const [noteFormData, setNoteFormData] = useState({
    title: "",
    description: "",
  });

  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
    department: "",
    semester: "",
    project_type: "microproject" as string,
    author: "",
    tech_stack: "",
    github_url: "",
    demo_url: "",
  });

  const availableSubjects = folderFormData.department && folderFormData.semester
    ? subjectsByDeptSem[folderFormData.department]?.[folderFormData.semester] || []
    : [];

  // Fetch data on mount
  useEffect(() => {
    fetchFolders();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchFolders = async () => {
    const { data } = await supabase.from("folders").select("*").order("created_at", { ascending: false });
    if (data) setFolders(data);
  };

  const fetchNotesForFolder = async (folderId: string) => {
    const { data } = await supabase.from("notes").select("*").eq("folder_id", folderId).order("created_at", { ascending: false });
    if (data) setNotes(data);
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data as DBProject[]);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
  };

  // Handlers
  const resetFolderForm = () => {
    setFolderFormData({ name: "", department: currentDepartment, semester: "", subject: "", description: "" });
    setEditingFolder(null);
    setIsCustomSubject(false);
    setCustomSubjectName("");
  };

  const resetNoteForm = () => {
    setNoteFormData({ title: "", description: "" });
    setEditingNote(null);
  };

  const resetProjectForm = () => {
    setProjectFormData({ title: "", description: "", department: "", semester: "", project_type: "microproject", author: "", tech_stack: "", github_url: "", demo_url: "" });
    setEditingProject(null);
  };

  const handleAddFolder = async () => {
    const subject = isCustomSubject ? customSubjectName : folderFormData.subject;
    
    // If custom subject, save to custom_subjects table first
    if (isCustomSubject && customSubjectName) {
      await supabase.from("custom_subjects").insert({
        name: customSubjectName,
        department: folderFormData.department,
        semester: folderFormData.semester,
      });
    }

    const { error } = await supabase.from("folders").insert({
      name: folderFormData.name,
      department: folderFormData.department,
      semester: folderFormData.semester,
      subject: subject,
      description: folderFormData.description,
      is_custom_subject: isCustomSubject,
    });
    if (error) {
      toast({ title: "Error creating folder", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Folder created successfully" });
      fetchFolders();
    }
    setIsFolderDialogOpen(false);
    resetFolderForm();
  };

  const handleEditFolder = async () => {
    if (!editingFolder) return;
    const subject = isCustomSubject ? customSubjectName : folderFormData.subject;
    const { error } = await supabase.from("folders").update({
      name: folderFormData.name,
      department: folderFormData.department,
      semester: folderFormData.semester,
      subject: subject,
      description: folderFormData.description,
    }).eq("id", editingFolder.id);
    if (error) {
      toast({ title: "Error updating folder", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Folder updated successfully" });
      fetchFolders();
    }
    setIsFolderDialogOpen(false);
    resetFolderForm();
  };

  const handleDeleteFolder = async (id: string) => {
    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting folder", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Folder deleted" });
      fetchFolders();
    }
  };

  const handleAddNote = async () => {
    if (!selectedFolder) return;
    const { error } = await supabase.from("notes").insert({
      title: noteFormData.title,
      description: noteFormData.description,
      folder_id: selectedFolder.id,
    });
    if (error) {
      toast({ title: "Error adding note", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Note added successfully" });
      fetchNotesForFolder(selectedFolder.id);
    }
    setIsNoteDialogOpen(false);
    resetNoteForm();
  };

  const handleEditNote = async () => {
    if (!editingNote) return;
    const { error } = await supabase.from("notes").update({
      title: noteFormData.title,
      description: noteFormData.description,
    }).eq("id", editingNote.id);
    if (error) {
      toast({ title: "Error updating note", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Note updated successfully" });
      if (selectedFolder) fetchNotesForFolder(selectedFolder.id);
    }
    setIsNoteDialogOpen(false);
    resetNoteForm();
  };

  const handleDeleteNote = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting note", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Note deleted" });
      if (selectedFolder) fetchNotesForFolder(selectedFolder.id);
    }
  };

  const handleAddProject = async () => {
    const { error } = await supabase.from("projects").insert({
      title: projectFormData.title,
      description: projectFormData.description,
      department: projectFormData.department,
      semester: projectFormData.semester,
      project_type: projectFormData.project_type,
      author: projectFormData.author || null,
      tech_stack: projectFormData.tech_stack ? projectFormData.tech_stack.split(",").map(s => s.trim()) : null,
      github_url: projectFormData.github_url || null,
      demo_url: projectFormData.demo_url || null,
    });
    if (error) {
      toast({ title: "Error creating project", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project created successfully" });
      fetchProjects();
    }
    setIsProjectDialogOpen(false);
    resetProjectForm();
  };

  const handleEditProject = async () => {
    if (!editingProject) return;
    const { error } = await supabase.from("projects").update({
      title: projectFormData.title,
      description: projectFormData.description,
      department: projectFormData.department,
      semester: projectFormData.semester,
      project_type: projectFormData.project_type,
      author: projectFormData.author || null,
      tech_stack: projectFormData.tech_stack ? projectFormData.tech_stack.split(",").map(s => s.trim()) : null,
      github_url: projectFormData.github_url || null,
      demo_url: projectFormData.demo_url || null,
    }).eq("id", editingProject.id);
    if (error) {
      toast({ title: "Error updating project", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project updated successfully" });
      fetchProjects();
    }
    setIsProjectDialogOpen(false);
    resetProjectForm();
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting project", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project deleted" });
      fetchProjects();
    }
  };

  const openEditFolderDialog = (folder: DBFolder) => {
    setEditingFolder(folder);
    setFolderFormData({
      name: folder.name,
      department: folder.department,
      semester: folder.semester,
      subject: folder.subject,
      description: folder.description || "",
    });
    setIsCustomSubject(!!folder.is_custom_subject);
    if (folder.is_custom_subject) setCustomSubjectName(folder.subject);
    setIsFolderDialogOpen(true);
  };

  const openAddFolderDialog = (dept: string) => {
    setCurrentDepartment(dept);
    setFolderFormData({ name: "", department: dept, semester: "", subject: "", description: "" });
    setIsCustomSubject(false);
    setCustomSubjectName("");
    setIsFolderDialogOpen(true);
  };

  const openEditNoteDialog = (note: DBNote) => {
    setEditingNote(note);
    setNoteFormData({ title: note.title, description: note.description || "" });
    setIsNoteDialogOpen(true);
  };

  const openEditProjectDialog = (project: DBProject) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description || "",
      department: project.department,
      semester: project.semester,
      project_type: project.project_type,
      author: project.author || "",
      tech_stack: project.tech_stack?.join(", ") || "",
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
    });
    setIsProjectDialogOpen(true);
  };

  // Stats
  const totalFolders = folders.length;
  const totalProjects = projects.length;
  const totalUsers = users.length;
  const deptStats = departmentSections.map(d => ({
    ...d,
    folderCount: folders.filter(f => f.department === d.department).length,
  }));

  const getFilteredFolders = (dept: string) => folders.filter(f => f.department === dept);
  const activeDeptSection = departmentSections.find(d => d.id === activeSection);

  const filteredUsers = users.filter(u => 
    !userSearchQuery || 
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    (u.full_name && u.full_name.toLowerCase().includes(userSearchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-56 bg-sidebar border-r border-sidebar-border hidden lg:flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground">DiploMate</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">Main</p>
          <button
            onClick={() => { setActiveSection("dashboard"); setSelectedFolder(null); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              activeSection === "dashboard"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>

          <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mt-4">Notes by Dept</p>
          {departmentSections.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSelectedFolder(null); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                activeSection === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.department}
            </button>
          ))}

          <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mt-4">Projects</p>
          <button
            onClick={() => { setActiveSection("projects"); setSelectedFolder(null); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              activeSection === "projects"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Rocket className="h-4 w-4" />
            Manage Projects
          </button>

          <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mt-4">System</p>
          <button
            onClick={() => { setActiveSection("users"); setSelectedFolder(null); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              activeSection === "users"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => { setActiveSection("settings"); setSelectedFolder(null); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              activeSection === "settings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Link 
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Dashboard View */}
          {activeSection === "dashboard" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Overview of your educational content</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalFolders}</p>
                        <p className="text-xs text-muted-foreground">Total Folders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Rocket className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalProjects}</p>
                        <p className="text-xs text-muted-foreground">Total Projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalUsers}</p>
                        <p className="text-xs text-muted-foreground">Total Users</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Download className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">Downloads</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-lg font-semibold mb-3">Manage Notes by Department</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {deptStats.map((dept) => (
                  <Card 
                    key={dept.id}
                    className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setActiveSection(dept.id)}
                  >
                    <div className={`h-1 bg-gradient-to-r ${dept.color}`} />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${dept.color} flex items-center justify-center`}>
                          <dept.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="font-semibold mb-2">{dept.department}</h3>
                      <p className="text-xl font-bold text-primary">{dept.folderCount} <span className="text-xs font-normal text-muted-foreground">folders</span></p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Department View - Folders or Notes */}
          {activeDeptSection && (
            <>
              {!selectedFolder ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activeDeptSection.color} flex items-center justify-center`}>
                        <activeDeptSection.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold">{activeDeptSection.department} - Folders</h1>
                        <p className="text-sm text-muted-foreground">
                          {getFilteredFolders(activeDeptSection.department).length} folders
                        </p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => openAddFolderDialog(activeDeptSection.department)}>
                      <Plus className="mr-1.5 h-4 w-4" />
                      Add Folder
                    </Button>
                  </div>

                  {getFilteredFolders(activeDeptSection.department).length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredFolders(activeDeptSection.department).map((folder) => (
                        <Card 
                          key={folder.id}
                          className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                          onClick={() => { setSelectedFolder(folder); fetchNotesForFolder(folder.id); }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FolderIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => { e.stopPropagation(); openEditFolderDialog(folder); }}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{folder.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{folder.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="px-1.5 py-0.5 bg-muted rounded">{folder.semester}</span>
                              <span className="truncate">{folder.subject}</span>
                              {folder.is_custom_subject && <Badge variant="outline" className="text-[10px] px-1 py-0">Custom</Badge>}
                            </div>
                            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{folder.notes_count || 0} notes</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed border-2 border-border">
                      <CardContent className="py-12 text-center">
                        <FolderOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-1">No Folders Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Create folders to organize your notes.</p>
                        <Button size="sm" onClick={() => openAddFolderDialog(activeDeptSection.department)}>
                          <Plus className="mr-1.5 h-4 w-4" />
                          Create First Folder
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                // Notes View
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSelectedFolder(null)}>
                        <ArrowLeftCircle className="h-5 w-5" />
                      </Button>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold">{selectedFolder.name}</h1>
                        <p className="text-sm text-muted-foreground">{selectedFolder.subject} • {notes.length} notes</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setIsNoteDialogOpen(true)}>
                      <Plus className="mr-1.5 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>

                  <Card className="border-border/50">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-xs font-semibold w-[50%]">Title</TableHead>
                            <TableHead className="text-xs font-semibold">Description</TableHead>
                            <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {notes.length > 0 ? notes.map((note) => (
                            <TableRow key={note.id}>
                              <TableCell className="font-medium text-sm">{note.title}</TableCell>
                              <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{note.description}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditNoteDialog(note)}>
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteNote(note.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No notes in this folder. Click "Add Note" to create one.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          {/* Projects View */}
          {activeSection === "projects" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Manage Projects</h1>
                  <p className="text-sm text-muted-foreground">Add and manage Microprojects and Capstone Projects</p>
                </div>
                <Button size="sm" onClick={() => setIsProjectDialogOpen(true)}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Project
                </Button>
              </div>

              <div className="grid gap-4">
                {["microproject", "capstone"].map(type => {
                  const typeProjects = projects.filter(p => p.project_type === type);
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-3">
                        {type === "microproject" ? <Lightbulb className="h-5 w-5 text-amber-500" /> : <Rocket className="h-5 w-5 text-purple-500" />}
                        <h2 className="text-lg font-semibold capitalize">{type === "microproject" ? "Microprojects" : "Capstone Projects"}</h2>
                        <Badge variant="secondary">{typeProjects.length}</Badge>
                      </div>
                      {typeProjects.length > 0 ? (
                        <Card className="border-border/50 mb-4">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/50">
                                  <TableHead className="text-xs font-semibold">Title</TableHead>
                                  <TableHead className="text-xs font-semibold">Department</TableHead>
                                  <TableHead className="text-xs font-semibold">Semester</TableHead>
                                  <TableHead className="text-xs font-semibold">Author</TableHead>
                                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {typeProjects.map(project => (
                                  <TableRow key={project.id}>
                                    <TableCell className="font-medium text-sm">{project.title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{project.department}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{project.semester}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{project.author || "—"}</TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProjectDialog(project)}>
                                          <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteProject(project.id)}>
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="border-dashed border-2 border-border mb-4">
                          <CardContent className="py-8 text-center">
                            <p className="text-sm text-muted-foreground">No {type === "microproject" ? "microprojects" : "capstone projects"} yet.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Users View */}
          {activeSection === "users" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Users</h1>
                  <p className="text-sm text-muted-foreground">{users.length} registered users</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchUsers}>
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  Refresh
                </Button>
              </div>

              <div className="mb-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users by name or email..." className="pl-9 h-9" value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} />
                </div>
              </div>

              <Card className="border-border/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold">Name</TableHead>
                        <TableHead className="text-xs font-semibold">Email</TableHead>
                        <TableHead className="text-xs font-semibold">Role</TableHead>
                        <TableHead className="text-xs font-semibold">Department</TableHead>
                        <TableHead className="text-xs font-semibold">Semester</TableHead>
                        <TableHead className="text-xs font-semibold">Verified</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium text-sm">{user.full_name || "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">{user.role}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.department || "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.semester || "—"}</TableCell>
                          <TableCell>
                            {user.is_verified ? (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-muted-foreground">Pending</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            {userSearchQuery ? "No users match your search." : "No users found."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Settings View */}
          {activeSection === "settings" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Configure platform settings</p>
              </div>

              <div className="grid gap-6 max-w-2xl">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">General</CardTitle>
                    <CardDescription>Basic site configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">Site Name</Label>
                      <Input value={settingsData.siteName} onChange={(e) => setSettingsData({...settingsData, siteName: e.target.value})} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Site Description</Label>
                      <Input value={settingsData.siteDescription} onChange={(e) => setSettingsData({...settingsData, siteDescription: e.target.value})} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Max Upload Size (MB)</Label>
                      <Input type="number" value={settingsData.maxUploadSize} onChange={(e) => setSettingsData({...settingsData, maxUploadSize: e.target.value})} className="h-9 w-32" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Security & Access</CardTitle>
                    <CardDescription>Control access to the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Maintenance Mode</p>
                        <p className="text-xs text-muted-foreground">Disable public access temporarily</p>
                      </div>
                      <Switch checked={settingsData.maintenanceMode} onCheckedChange={(v) => setSettingsData({...settingsData, maintenanceMode: v})} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Allow Registration</p>
                        <p className="text-xs text-muted-foreground">Allow new users to sign up</p>
                      </div>
                      <Switch checked={settingsData.allowRegistration} onCheckedChange={(v) => setSettingsData({...settingsData, allowRegistration: v})} />
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => toast({ title: "Settings saved successfully" })} className="w-fit">
                  Save Settings
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Add/Edit Folder Dialog */}
      <Dialog open={isFolderDialogOpen} onOpenChange={(open) => { setIsFolderDialogOpen(open); if (!open) resetFolderForm(); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingFolder ? "Edit Folder" : "Create New Folder"}</DialogTitle>
            <DialogDescription>{editingFolder ? "Update folder details" : "Create a folder to organize notes"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="folderName" className="text-sm">Folder Name</Label>
              <Input id="folderName" value={folderFormData.name} onChange={(e) => setFolderFormData({ ...folderFormData, name: e.target.value })} placeholder="e.g., Unit 1 - Introduction to ML" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="folderDesc" className="text-sm">Description</Label>
              <Textarea id="folderDesc" value={folderFormData.description} onChange={(e) => setFolderFormData({ ...folderFormData, description: e.target.value })} placeholder="Brief description..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Department</Label>
                <Select value={folderFormData.department} onValueChange={(value) => setFolderFormData({ ...folderFormData, department: value, subject: "" })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {departmentSections.map((dept) => (
                      <SelectItem key={dept.department} value={dept.department}>{dept.department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Semester</Label>
                <Select value={folderFormData.semester} onValueChange={(value) => setFolderFormData({ ...folderFormData, semester: value, subject: "" })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Subject</Label>
              {!isCustomSubject ? (
                <Select value={folderFormData.subject} onValueChange={(value) => {
                  if (value === "__other__") {
                    setIsCustomSubject(true);
                    setFolderFormData({ ...folderFormData, subject: "" });
                  } else {
                    setFolderFormData({ ...folderFormData, subject: value });
                  }
                }} disabled={availableSubjects.length === 0 && !isCustomSubject}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select dept & semester first" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {availableSubjects.map((sub) => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                    {folderFormData.department && folderFormData.semester && (
                      <SelectItem value="__other__" className="text-primary font-medium">+ Other (Custom Subject)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <Input value={customSubjectName} onChange={(e) => setCustomSubjectName(e.target.value)} placeholder="Type custom subject name..." className="h-9" />
                  <Button variant="outline" size="sm" className="h-9 whitespace-nowrap" onClick={() => { setIsCustomSubject(false); setCustomSubjectName(""); }}>Cancel</Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsFolderDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={editingFolder ? handleEditFolder : handleAddFolder} disabled={!folderFormData.name || !folderFormData.department || !folderFormData.semester || (!folderFormData.subject && !customSubjectName)}>
              {editingFolder ? "Save" : "Create Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={(open) => { setIsNoteDialogOpen(open); if (!open) resetNoteForm(); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
            <DialogDescription>{editingNote ? "Update note details" : `Add a note to "${selectedFolder?.name}"`}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="noteTitle" className="text-sm">Title</Label>
              <Input id="noteTitle" value={noteFormData.title} onChange={(e) => setNoteFormData({ ...noteFormData, title: e.target.value })} placeholder="e.g., Introduction to Machine Learning" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="noteDesc" className="text-sm">Description</Label>
              <Textarea id="noteDesc" value={noteFormData.description} onChange={(e) => setNoteFormData({ ...noteFormData, description: e.target.value })} placeholder="Brief description..." rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">File Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Click to upload PDF, DOC (max 10MB)</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsNoteDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={editingNote ? handleEditNote : handleAddNote}>{editingNote ? "Save" : "Add Note"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={(open) => { setIsProjectDialogOpen(open); if (!open) resetProjectForm(); }}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>{editingProject ? "Update project details" : "Add a new project"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label className="text-sm">Title</Label>
              <Input value={projectFormData.title} onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })} placeholder="Project title" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Description</Label>
              <Textarea value={projectFormData.description} onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })} placeholder="Project description..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Project Type</Label>
                <Select value={projectFormData.project_type} onValueChange={(v) => setProjectFormData({ ...projectFormData, project_type: v })}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="microproject">Microproject</SelectItem>
                    <SelectItem value="capstone">Capstone Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Department</Label>
                <Select value={projectFormData.department} onValueChange={(v) => setProjectFormData({ ...projectFormData, department: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {departmentSections.map((dept) => (
                      <SelectItem key={dept.department} value={dept.department}>{dept.department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Semester</Label>
                <Select value={projectFormData.semester} onValueChange={(v) => setProjectFormData({ ...projectFormData, semester: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Author</Label>
                <Input value={projectFormData.author} onChange={(e) => setProjectFormData({ ...projectFormData, author: e.target.value })} placeholder="Author name" className="h-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Tech Stack (comma-separated)</Label>
              <Input value={projectFormData.tech_stack} onChange={(e) => setProjectFormData({ ...projectFormData, tech_stack: e.target.value })} placeholder="React, Node.js, MongoDB" className="h-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">GitHub URL</Label>
                <Input value={projectFormData.github_url} onChange={(e) => setProjectFormData({ ...projectFormData, github_url: e.target.value })} placeholder="https://github.com/..." className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Demo URL</Label>
                <Input value={projectFormData.demo_url} onChange={(e) => setProjectFormData({ ...projectFormData, demo_url: e.target.value })} placeholder="https://..." className="h-9" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={editingProject ? handleEditProject : handleAddProject} disabled={!projectFormData.title || !projectFormData.department || !projectFormData.semester}>
              {editingProject ? "Save" : "Add Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
