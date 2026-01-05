export interface Note {
  id: string;
  title: string;
  description: string;
  department: string;
  semester: string;
  subject: string;
  fileUrl: string;
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

export const notesData: Note[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Comprehensive guide covering ML fundamentals, algorithms, and practical applications.",
    department: "AIML",
    semester: "Sem 3",
    subject: "Machine Learning Basics",
    fileUrl: "#",
  },
  {
    id: "2",
    title: "Python Programming Complete Guide",
    description: "From basics to advanced Python concepts with hands-on examples.",
    department: "AIML",
    semester: "Sem 3",
    subject: "Python Programming",
    fileUrl: "#",
  },
  {
    id: "3",
    title: "Statistics for Data Science",
    description: "Statistical methods and their applications in data analysis.",
    department: "AIML",
    semester: "Sem 3",
    subject: "Statistics",
    fileUrl: "#",
  },
  {
    id: "4",
    title: "Database Management Systems",
    description: "Complete DBMS concepts with SQL and NoSQL databases.",
    department: "AIML",
    semester: "Sem 3",
    subject: "Database Management",
    fileUrl: "#",
  },
  {
    id: "5",
    title: "Data Structures & Algorithms",
    description: "Essential DSA concepts for competitive programming and interviews.",
    department: "Computer",
    semester: "Sem 2",
    subject: "Data Structures",
    fileUrl: "#",
  },
  {
    id: "6",
    title: "Java OOP Concepts",
    description: "Object-oriented programming principles with Java examples.",
    department: "Computer",
    semester: "Sem 2",
    subject: "OOP with Java",
    fileUrl: "#",
  },
  {
    id: "7",
    title: "Thermodynamics Fundamentals",
    description: "Laws of thermodynamics and their engineering applications.",
    department: "Mechanical",
    semester: "Sem 3",
    subject: "Thermodynamics",
    fileUrl: "#",
  },
  {
    id: "8",
    title: "Structural Mechanics",
    description: "Analysis of forces and moments in structural elements.",
    department: "Civil",
    semester: "Sem 3",
    subject: "Structural Mechanics",
    fileUrl: "#",
  },
];
