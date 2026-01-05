export interface Note {
  id: string;
  title: string;
  description: string;
  department: string;
  semester: string;
  subject: string;
  folderId: string;
  fileUrl: string;
}

export interface Folder {
  id: string;
  name: string;
  department: string;
  semester: string;
  subject: string;
  description: string;
}

export const departments = ["AIML", "Computer", "Mechanical", "Civil"] as const;
export const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"] as const;

export const subjectsByDeptSem: Record<string, Record<string, string[]>> = {
  AIML: {
    "Sem 1": ["Mathematics I", "Physics", "Basic Electronics", "Programming Fundamentals"],
    "Sem 2": ["Mathematics II", "Digital Logic", "Data Structures", "Computer Networks"],
    "Sem 3": ["Machine Learning Basics", "Python Programming", "Statistics", "Database Management"],
    "Sem 4": ["Deep Learning", "NLP Fundamentals", "Computer Vision", "AI Ethics"],
    "Sem 5": ["Advanced ML", "Reinforcement Learning", "Big Data Analytics", "Cloud Computing"],
    "Sem 6": ["Capstone Project", "Industry Internship", "Research Methods", "AI Applications"],
  },
  Computer: {
    "Sem 1": ["Mathematics I", "Physics", "Basic Electronics", "C Programming"],
    "Sem 2": ["Mathematics II", "Digital Logic", "Data Structures", "OOP with Java"],
    "Sem 3": ["DBMS", "Operating Systems", "Computer Networks", "Web Development"],
    "Sem 4": ["Software Engineering", "System Programming", "Microprocessors", "Python"],
    "Sem 5": ["Cloud Computing", "Cybersecurity", "Mobile Development", "AI/ML Basics"],
    "Sem 6": ["Major Project", "Industry Training", "Emerging Technologies", "Professional Ethics"],
  },
  Mechanical: {
    "Sem 1": ["Engineering Mathematics I", "Engineering Physics", "Engineering Drawing", "Workshop Practice"],
    "Sem 2": ["Engineering Mathematics II", "Engineering Chemistry", "Manufacturing Processes", "Strength of Materials"],
    "Sem 3": ["Thermodynamics", "Fluid Mechanics", "Machine Drawing", "Material Science"],
    "Sem 4": ["Heat Transfer", "Theory of Machines", "Manufacturing Technology", "Metrology"],
    "Sem 5": ["IC Engines", "CAD/CAM", "Industrial Management", "Automobile Engineering"],
    "Sem 6": ["Project Work", "Industrial Training", "Power Plant Engineering", "Refrigeration & AC"],
  },
  Civil: {
    "Sem 1": ["Engineering Mathematics I", "Engineering Physics", "Engineering Drawing", "Surveying I"],
    "Sem 2": ["Engineering Mathematics II", "Engineering Chemistry", "Building Materials", "Surveying II"],
    "Sem 3": ["Structural Mechanics", "Fluid Mechanics", "Building Construction", "Concrete Technology"],
    "Sem 4": ["Structural Analysis", "Geotechnical Engineering", "Transportation Engineering", "Environmental Engineering"],
    "Sem 5": ["Design of Structures", "Estimation & Costing", "Construction Management", "Hydraulics"],
    "Sem 6": ["Major Project", "Industrial Training", "Advanced Surveying", "Professional Practice"],
  },
};

// Folders represent units/chapters for organizing notes
export const foldersData: Folder[] = [
  {
    id: "f1",
    name: "Unit 1 - ML Introduction",
    department: "AIML",
    semester: "Sem 3",
    subject: "Machine Learning Basics",
    description: "Introduction to ML concepts and fundamentals",
  },
  {
    id: "f2",
    name: "Unit 2 - Supervised Learning",
    department: "AIML",
    semester: "Sem 3",
    subject: "Machine Learning Basics",
    description: "Classification and Regression algorithms",
  },
  {
    id: "f3",
    name: "Unit 1 - Python Basics",
    department: "AIML",
    semester: "Sem 3",
    subject: "Python Programming",
    description: "Python fundamentals and syntax",
  },
  {
    id: "f4",
    name: "Unit 1 - DSA Fundamentals",
    department: "Computer",
    semester: "Sem 2",
    subject: "Data Structures",
    description: "Arrays, Linked Lists, Stacks, Queues",
  },
  {
    id: "f5",
    name: "Unit 1 - Thermo Laws",
    department: "Mechanical",
    semester: "Sem 3",
    subject: "Thermodynamics",
    description: "First and Second Laws of Thermodynamics",
  },
  {
    id: "f6",
    name: "Unit 1 - Force Analysis",
    department: "Civil",
    semester: "Sem 3",
    subject: "Structural Mechanics",
    description: "Analysis of forces in structures",
  },
];

export const notesData: Note[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Comprehensive guide covering ML fundamentals, algorithms, and practical applications.",
    department: "AIML",
    semester: "Sem 3",
    subject: "Machine Learning Basics",
    folderId: "f1",
    fileUrl: "#",
  },
  {
    id: "2",
    title: "Types of Machine Learning",
    description: "Supervised, Unsupervised, and Reinforcement Learning explained.",
    department: "AIML",
    semester: "Sem 3",
    subject: "Machine Learning Basics",
    folderId: "f1",
    fileUrl: "#",
  },
  {
    id: "3",
    title: "Linear Regression",
    description: "Complete guide to linear regression with examples.",
    department: "AIML",
    semester: "Sem 3",
    subject: "Machine Learning Basics",
    folderId: "f2",
    fileUrl: "#",
  },
  {
    id: "4",
    title: "Python Programming Complete Guide",
    description: "From basics to advanced Python concepts with hands-on examples.",
    department: "AIML",
    semester: "Sem 3",
    subject: "Python Programming",
    folderId: "f3",
    fileUrl: "#",
  },
  {
    id: "5",
    title: "Data Structures & Algorithms",
    description: "Essential DSA concepts for competitive programming and interviews.",
    department: "Computer",
    semester: "Sem 2",
    subject: "Data Structures",
    folderId: "f4",
    fileUrl: "#",
  },
  {
    id: "6",
    title: "Thermodynamics Fundamentals",
    description: "Laws of thermodynamics and their engineering applications.",
    department: "Mechanical",
    semester: "Sem 3",
    subject: "Thermodynamics",
    folderId: "f5",
    fileUrl: "#",
  },
  {
    id: "7",
    title: "Structural Mechanics",
    description: "Analysis of forces and moments in structural elements.",
    department: "Civil",
    semester: "Sem 3",
    subject: "Structural Mechanics",
    folderId: "f6",
    fileUrl: "#",
  },
];
