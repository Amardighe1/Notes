import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const departments = [
  { name: "AIML", label: "AI & Machine Learning" },
  { name: "Computer", label: "Computer Engineering" },
  { name: "Mechanical", label: "Mechanical Engineering" },
  { name: "Civil", label: "Civil Engineering" },
];

const navLinks = [
  { name: "Support", path: "/support" },
  { name: "FAQs", path: "/faqs" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDepartmentClick = (dept: string) => {
    navigate(`/notes-selection?department=${dept}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-foreground">DiploMate</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            >
              {link.name}
            </Link>
          ))}

          {/* Notes Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                Notes
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 bg-popover border border-border shadow-elevated">
              {departments.map((dept) => (
                <DropdownMenuItem
                  key={dept.name}
                  onClick={() => handleDepartmentClick(dept.name)}
                  className="cursor-pointer py-3 focus:bg-muted"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-xs text-muted-foreground">{dept.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Login Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="default" className="rounded-full px-6">
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border transition-all duration-200 ease-in-out",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="container py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes by Department</p>
            {departments.map((dept) => (
              <button
                key={dept.name}
                onClick={() => {
                  handleDepartmentClick(dept.name);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
              >
                {dept.name}
              </button>
            ))}
          </div>

          <div className="px-4 pt-4 border-t border-border">
            <Button variant="default" className="w-full rounded-full">
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
