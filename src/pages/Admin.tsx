import { useState } from "react";
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
import { notesData, departments, semesters, subjectsByDeptSem, type Note } from "@/data/mockData";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Plus, 
  Pencil, 
  Trash2,
  Upload,
  BookOpen,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FileText, label: "Manage Notes", id: "notes" },
  { icon: Users, label: "Manage Users", id: "users" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const stats = [
  { label: "Total Notes", value: "156", icon: FileText, change: "+12%" },
  { label: "Active Users", value: "2,847", icon: Users, change: "+8%" },
  { label: "Downloads", value: "12.5K", icon: TrendingUp, change: "+23%" },
  { label: "Departments", value: "4", icon: GraduationCap, change: "0%" },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("notes");
  const [notes, setNotes] = useState<Note[]>(notesData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

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
      department: "",
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

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">DiploMate</span>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your educational content and users</p>
          </div>

          {activeSection === "dashboard" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600">{stat.change} from last month</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeSection === "notes" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manage Notes</CardTitle>
                  <CardDescription>Add, edit, or remove study materials</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
                      <DialogDescription>
                        Fill in the details for the study material
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Introduction to Machine Learning"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief description of the content..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Select
                            value={formData.department}
                            onValueChange={(value) => setFormData({ ...formData, department: value, subject: "" })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Semester</Label>
                          <Select
                            value={formData.semester}
                            onValueChange={(value) => setFormData({ ...formData, semester: value, subject: "" })}
                          >
                            <SelectTrigger>
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
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                          disabled={availableSubjects.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department & semester first" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {availableSubjects.map((sub) => (
                              <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>File Upload</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={editingNote ? handleEditNote : handleAddNote}>
                        {editingNote ? "Save Changes" : "Add Note"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Title</TableHead>
                        <TableHead className="font-semibold">Department</TableHead>
                        <TableHead className="font-semibold">Semester</TableHead>
                        <TableHead className="font-semibold">Subject</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notes.map((note) => (
                        <TableRow key={note.id}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {note.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {note.title}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                              {note.department}
                            </span>
                          </TableCell>
                          <TableCell>{note.semester}</TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                            {note.subject}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(note)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "users" && (
            <Card>
              <CardContent className="py-16 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground">
                  User management features coming soon.
                </p>
              </CardContent>
            </Card>
          )}

          {activeSection === "settings" && (
            <Card>
              <CardContent className="py-16 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Settings</h3>
                <p className="text-muted-foreground">
                  System settings coming soon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
