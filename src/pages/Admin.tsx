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
  DialogTrigger,
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
import { notesData, semesters, subjectsByDeptSem, type Note } from "@/data/mockData";
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
  TrendingUp,
  Download,
  Eye,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const departmentSections = [
  { id: "aiml", label: "AIML Notes", department: "AIML", icon: Brain, color: "from-violet-500 to-purple-600" },
  { id: "computer", label: "Computer Notes", department: "Computer", icon: Monitor, color: "from-blue-500 to-cyan-500" },
  { id: "mechanical", label: "Mechanical Notes", department: "Mechanical", icon: Cog, color: "from-orange-500 to-red-500" },
  { id: "civil", label: "Civil Notes", department: "Civil", icon: Building2, color: "from-green-500 to-emerald-600" },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  ...departmentSections.map(d => ({ icon: d.icon, label: d.label, id: d.id })),
  { icon: Users, label: "Manage Users", id: "users" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notes, setNotes] = useState<Note[]>(notesData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [currentDepartment, setCurrentDepartment] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    semester: "",
    subject: "",
  });

  const availableSubjects = formData.department && formData.semester
    ? subjectsByDeptSem[formData.department]?.[formData.semester] || []
    : [];

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      department: currentDepartment,
      semester: "",
      subject: "",
    });
    setEditingNote(null);
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      ...formData,
      fileUrl: "#",
    };
    setNotes([...notes, newNote]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({ title: "Note added successfully" });
  };

  const handleEditNote = () => {
    if (!editingNote) return;
    setNotes(notes.map((n) => (n.id === editingNote.id ? { ...editingNote, ...formData } : n)));
    setIsAddDialogOpen(false);
    resetForm();
    toast({ title: "Note updated successfully" });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast({ title: "Note deleted successfully" });
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description,
      department: note.department,
      semester: note.semester,
      subject: note.subject,
    });
    setIsAddDialogOpen(true);
  };

  const openAddDialog = (dept: string) => {
    setCurrentDepartment(dept);
    setFormData({ ...formData, department: dept });
    setIsAddDialogOpen(true);
  };

  // Get stats for dashboard
  const getStats = () => {
    const totalNotes = notes.length;
    const byDept = departmentSections.map(d => ({
      ...d,
      count: notes.filter(n => n.department === d.department).length
    }));
    return { totalNotes, byDept };
  };

  const stats = getStats();

  // Filter notes by department
  const getFilteredNotes = (dept: string) => notes.filter(n => n.department === dept);

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
            onClick={() => setActiveSection("dashboard")}
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
              onClick={() => setActiveSection(item.id)}
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
            onClick={() => setActiveSection("users")}
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
            onClick={() => setActiveSection("settings")}
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
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">2,847</p>
                        <p className="text-xs text-muted-foreground">Active Users</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Download className="h-5 w-5 text-white" />
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
                        <Eye className="h-5 w-5 text-white" />
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
                          <dept.icon className="h-5 w-5 text-white" />
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="font-semibold mb-1">{dept.department}</h3>
                      <p className="text-2xl font-bold text-primary">{dept.count}</p>
                      <p className="text-xs text-muted-foreground">notes available</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <h2 className="text-lg font-semibold mb-3 mt-6">Recent Notes</h2>
              <Card className="border-border/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold">Title</TableHead>
                        <TableHead className="text-xs font-semibold">Department</TableHead>
                        <TableHead className="text-xs font-semibold">Semester</TableHead>
                        <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notes.slice(0, 5).map((note) => (
                        <TableRow key={note.id}>
                          <TableCell className="font-medium text-sm">{note.title}</TableCell>
                          <TableCell>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                              {note.department}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{note.semester}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(note)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Department Notes View */}
          {activeDeptSection && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activeDeptSection.color} flex items-center justify-center`}>
                    <activeDeptSection.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">{activeDeptSection.department} Notes</h1>
                    <p className="text-sm text-muted-foreground">
                      {getFilteredNotes(activeDeptSection.department).length} notes available
                    </p>
                  </div>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => openAddDialog(activeDeptSection.department)}>
                      <Plus className="mr-1.5 h-4 w-4" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                      <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
                      <DialogDescription>
                        {editingNote ? "Update the note details" : `Add a new note for ${formData.department}`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-sm">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Introduction to Machine Learning"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-sm">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief description..."
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-sm">Department</Label>
                          <Select
                            value={formData.department}
                            onValueChange={(value) => setFormData({ ...formData, department: value, subject: "" })}
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
                            value={formData.semester}
                            onValueChange={(value) => setFormData({ ...formData, semester: value, subject: "" })}
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
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
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
                      <div className="space-y-1.5">
                        <Label className="text-sm">File Upload</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <Upload className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Click to upload PDF, DOC (max 10MB)</p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={editingNote ? handleEditNote : handleAddNote}>
                        {editingNote ? "Save" : "Add Note"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border-border/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold w-[40%]">Title</TableHead>
                        <TableHead className="text-xs font-semibold">Semester</TableHead>
                        <TableHead className="text-xs font-semibold">Subject</TableHead>
                        <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredNotes(activeDeptSection.department).length > 0 ? (
                        getFilteredNotes(activeDeptSection.department).map((note) => (
                          <TableRow key={note.id}>
                            <TableCell className="font-medium text-sm">{note.title}</TableCell>
                            <TableCell className="text-sm">{note.semester}</TableCell>
                            <TableCell className="text-sm text-muted-foreground truncate max-w-[150px]">
                              {note.subject}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(note)}>
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
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No notes available. Click "Add Note" to create one.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
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
    </div>
  );
}
