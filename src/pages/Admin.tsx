import { useState } from "react";
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
import { notesData, foldersData, semesters, subjectsByDeptSem, type Note, type Folder } from "@/data/mockData";
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
  ArrowLeftCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const departmentSections = [
  { id: "aiml", label: "AIML Notes", department: "AIML", icon: Brain, color: "from-violet-500 to-purple-600" },
  { id: "computer", label: "Computer Notes", department: "Computer", icon: Monitor, color: "from-blue-500 to-cyan-500" },
  { id: "mechanical", label: "Mechanical Notes", department: "Mechanical", icon: Cog, color: "from-orange-500 to-red-500" },
  { id: "civil", label: "Civil Notes", department: "Civil", icon: Building2, color: "from-green-500 to-emerald-600" },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notes, setNotes] = useState<Note[]>(notesData);
  const [folders, setFolders] = useState<Folder[]>(foldersData);
  
  // Dialogs
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Current view state
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

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

  const availableSubjects = folderFormData.department && folderFormData.semester
    ? subjectsByDeptSem[folderFormData.department]?.[folderFormData.semester] || []
    : [];

  // Handlers
  const resetFolderForm = () => {
    setFolderFormData({
      name: "",
      department: currentDepartment,
      semester: "",
      subject: "",
      description: "",
    });
    setEditingFolder(null);
  };

  const resetNoteForm = () => {
    setNoteFormData({ title: "", description: "" });
    setEditingNote(null);
  };

  const handleAddFolder = () => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      ...folderFormData,
    };
    setFolders([...folders, newFolder]);
    setIsFolderDialogOpen(false);
    resetFolderForm();
    toast({ title: "Folder created successfully" });
  };

  const handleEditFolder = () => {
    if (!editingFolder) return;
    setFolders(folders.map((f) => (f.id === editingFolder.id ? { ...editingFolder, ...folderFormData } : f)));
    setIsFolderDialogOpen(false);
    resetFolderForm();
    toast({ title: "Folder updated successfully" });
  };

  const handleDeleteFolder = (id: string) => {
    setFolders(folders.filter((f) => f.id !== id));
    setNotes(notes.filter((n) => n.folderId !== id));
    toast({ title: "Folder and its notes deleted" });
  };

  const handleAddNote = () => {
    if (!selectedFolder) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteFormData.title,
      description: noteFormData.description,
      department: selectedFolder.department,
      semester: selectedFolder.semester,
      subject: selectedFolder.subject,
      folderId: selectedFolder.id,
      fileUrl: "#",
    };
    setNotes([...notes, newNote]);
    setIsNoteDialogOpen(false);
    resetNoteForm();
    toast({ title: "Note added successfully" });
  };

  const handleEditNote = () => {
    if (!editingNote) return;
    setNotes(notes.map((n) => (n.id === editingNote.id ? { ...n, ...noteFormData } : n)));
    setIsNoteDialogOpen(false);
    resetNoteForm();
    toast({ title: "Note updated successfully" });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast({ title: "Note deleted successfully" });
  };

  const openEditFolderDialog = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderFormData({
      name: folder.name,
      department: folder.department,
      semester: folder.semester,
      subject: folder.subject,
      description: folder.description,
    });
    setIsFolderDialogOpen(true);
  };

  const openAddFolderDialog = (dept: string) => {
    setCurrentDepartment(dept);
    setFolderFormData({ ...folderFormData, department: dept });
    setIsFolderDialogOpen(true);
  };

  const openEditNoteDialog = (note: Note) => {
    setEditingNote(note);
    setNoteFormData({ title: note.title, description: note.description });
    setIsNoteDialogOpen(true);
  };

  // Get stats for dashboard
  const getStats = () => {
    const totalNotes = notes.length;
    const totalFolders = folders.length;
    const byDept = departmentSections.map(d => ({
      ...d,
      noteCount: notes.filter(n => n.department === d.department).length,
      folderCount: folders.filter(f => f.department === d.department).length,
    }));
    return { totalNotes, totalFolders, byDept };
  };

  const stats = getStats();

  // Filter folders by department
  const getFilteredFolders = (dept: string) => folders.filter(f => f.department === dept);
  
  // Get notes in a folder
  const getNotesInFolder = (folderId: string) => notes.filter(n => n.folderId === folderId);

  // Get active department section
  const activeDeptSection = departmentSections.find(d => d.id === activeSection);

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

              {/* Stats Row */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.totalFolders}</p>
                        <p className="text-xs text-muted-foreground">Total Folders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.totalNotes}</p>
                        <p className="text-xs text-muted-foreground">Total Notes</p>
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
                        <p className="text-2xl font-bold">12.5K</p>
                        <p className="text-xs text-muted-foreground">Downloads</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">45.2K</p>
                        <p className="text-xs text-muted-foreground">Page Views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Department Cards */}
              <h2 className="text-lg font-semibold mb-3">Manage Notes by Department</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.byDept.map((dept) => (
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
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <p className="text-xl font-bold text-primary">{dept.folderCount}</p>
                          <p className="text-xs text-muted-foreground">folders</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-muted-foreground">{dept.noteCount}</p>
                          <p className="text-xs text-muted-foreground">notes</p>
                        </div>
                      </div>
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
                // Folders View
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
                          onClick={() => setSelectedFolder(folder)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FolderIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => { e.stopPropagation(); openEditFolderDialog(folder); }}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{folder.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{folder.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="px-1.5 py-0.5 bg-muted rounded">{folder.semester}</span>
                              <span className="truncate">{folder.subject}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {getNotesInFolder(folder.id).length} notes
                              </span>
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
                        <p className="text-sm text-muted-foreground mb-4">
                          Create folders to organize your notes by units.
                        </p>
                        <Button size="sm" onClick={() => openAddFolderDialog(activeDeptSection.department)}>
                          <Plus className="mr-1.5 h-4 w-4" />
                          Create First Folder
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                // Notes View (inside a folder)
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9" 
                        onClick={() => setSelectedFolder(null)}
                      >
                        <ArrowLeftCircle className="h-5 w-5" />
                      </Button>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold">{selectedFolder.name}</h1>
                        <p className="text-sm text-muted-foreground">
                          {selectedFolder.subject} • {getNotesInFolder(selectedFolder.id).length} notes
                        </p>
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
                          {getNotesInFolder(selectedFolder.id).length > 0 ? (
                            getNotesInFolder(selectedFolder.id).map((note) => (
                              <TableRow key={note.id}>
                                <TableCell className="font-medium text-sm">{note.title}</TableCell>
                                <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {note.description}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditNoteDialog(note)}>
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      onClick={() => handleDeleteNote(note.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
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

          {/* Users View */}
          {activeSection === "users" && (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-1">User Management</h3>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          )}

          {/* Settings View */}
          {activeSection === "settings" && (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Settings className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-1">Settings</h3>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Add/Edit Folder Dialog */}
      <Dialog open={isFolderDialogOpen} onOpenChange={(open) => { setIsFolderDialogOpen(open); if (!open) resetFolderForm(); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingFolder ? "Edit Folder" : "Create New Folder"}</DialogTitle>
            <DialogDescription>
              {editingFolder ? "Update folder details" : "Create a folder to organize notes by unit"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="folderName" className="text-sm">Folder Name</Label>
              <Input
                id="folderName"
                value={folderFormData.name}
                onChange={(e) => setFolderFormData({ ...folderFormData, name: e.target.value })}
                placeholder="e.g., Unit 1 - Introduction to ML"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="folderDesc" className="text-sm">Description</Label>
              <Textarea
                id="folderDesc"
                value={folderFormData.description}
                onChange={(e) => setFolderFormData({ ...folderFormData, description: e.target.value })}
                placeholder="Brief description of this unit..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Department</Label>
                <Select
                  value={folderFormData.department}
                  onValueChange={(value) => setFolderFormData({ ...folderFormData, department: value, subject: "" })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {departmentSections.map((dept) => (
                      <SelectItem key={dept.department} value={dept.department}>{dept.department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Semester</Label>
                <Select
                  value={folderFormData.semester}
                  onValueChange={(value) => setFolderFormData({ ...folderFormData, semester: value, subject: "" })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
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
              <Select
                value={folderFormData.subject}
                onValueChange={(value) => setFolderFormData({ ...folderFormData, subject: value })}
                disabled={availableSubjects.length === 0}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select dept & semester first" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {availableSubjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsFolderDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={editingFolder ? handleEditFolder : handleAddFolder}>
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
            <DialogDescription>
              {editingNote ? "Update note details" : `Add a note to "${selectedFolder?.name}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="noteTitle" className="text-sm">Title</Label>
              <Input
                id="noteTitle"
                value={noteFormData.title}
                onChange={(e) => setNoteFormData({ ...noteFormData, title: e.target.value })}
                placeholder="e.g., Introduction to Machine Learning"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="noteDesc" className="text-sm">Description</Label>
              <Textarea
                id="noteDesc"
                value={noteFormData.description}
                onChange={(e) => setNoteFormData({ ...noteFormData, description: e.target.value })}
                placeholder="Brief description..."
                rows={2}
              />
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
            <Button size="sm" onClick={editingNote ? handleEditNote : handleAddNote}>
              {editingNote ? "Save" : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
