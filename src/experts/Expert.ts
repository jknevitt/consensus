/**
 * Represents an individual expert with specialized knowledge
 */
export interface Expert {
  id: string;
  name: string;
  title: string;
  credentials: string[];
  field: string;
  specializations: string[];
  yearsOfExperience: number;
  achievements: string[];
  biography: string;
  perspective: string;
  traits: string[];
}

/**
 * Filter criteria for querying experts
 */
export interface ExpertFilter {
  fields?: string[];
  specializations?: string[];
  minExperience?: number;
  keywords?: string[];
  limit?: number;
}

/**
 * Categories of expertise
 */
export const EXPERT_FIELDS = [
  // Medicine & Healthcare
  'Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Psychiatry',
  'Surgery', 'Public Health', 'Epidemiology', 'Pharmacology', 'Immunology',
  'Genetics', 'Emergency Medicine', 'Radiology', 'Pathology', 'Anesthesiology',

  // Law & Policy
  'Constitutional Law', 'Criminal Law', 'International Law', 'Corporate Law',
  'Environmental Law', 'Human Rights Law', 'Patent Law', 'Tax Law',
  'Public Policy', 'Diplomacy', 'Judicial Studies', 'Legal Philosophy',

  // Engineering
  'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
  'Software Engineering', 'Aerospace Engineering', 'Chemical Engineering',
  'Biomedical Engineering', 'Nuclear Engineering', 'Environmental Engineering',
  'Systems Engineering', 'Robotics', 'Materials Science',

  // Natural Sciences
  'Physics', 'Chemistry', 'Biology', 'Astronomy', 'Geology',
  'Oceanography', 'Meteorology', 'Ecology', 'Botany', 'Zoology',
  'Microbiology', 'Biochemistry', 'Molecular Biology', 'Neuroscience',

  // Technology
  'Artificial Intelligence', 'Machine Learning', 'Cybersecurity',
  'Blockchain', 'Quantum Computing', 'Cloud Computing', 'Data Science',
  'Human-Computer Interaction', 'Computer Networks', 'Database Systems',
  'Computer Graphics', 'Natural Language Processing', 'Computer Vision',

  // Business & Economics
  'Economics', 'Finance', 'Accounting', 'Marketing', 'Management',
  'Entrepreneurship', 'Supply Chain', 'Operations Research', 'Business Strategy',
  'Investment Banking', 'Venture Capital', 'International Trade', 'Macroeconomics',

  // Arts & Humanities
  'Philosophy', 'Ethics', 'History', 'Archaeology', 'Literature',
  'Art History', 'Music Theory', 'Performing Arts', 'Film Studies',
  'Creative Writing', 'Comparative Literature', 'Religious Studies',
  'Classics', 'Medieval Studies', 'Modern Languages',

  // Social Sciences
  'Psychology', 'Sociology', 'Anthropology', 'Political Science',
  'International Relations', 'Criminology', 'Social Work', 'Demography',
  'Urban Planning', 'Development Studies', 'Gender Studies', 'Cultural Studies',

  // Education
  'Pedagogy', 'Curriculum Development', 'Educational Psychology',
  'Special Education', 'Educational Technology', 'Higher Education',
  'Early Childhood Education', 'Language Education', 'STEM Education',

  // Agriculture & Environment
  'Agronomy', 'Agricultural Economics', 'Soil Science', 'Animal Science',
  'Horticulture', 'Forestry', 'Conservation Biology', 'Climate Science',
  'Sustainability', 'Wildlife Management', 'Food Science', 'Agricultural Engineering',

  // Media & Communication
  'Journalism', 'Public Relations', 'Broadcasting', 'Digital Media',
  'Mass Communication', 'Media Studies', 'Advertising', 'Communication Theory',

  // Architecture & Design
  'Architecture', 'Urban Design', 'Landscape Architecture', 'Interior Design',
  'Industrial Design', 'Graphic Design', 'User Experience Design',

  // Sports & Fitness
  'Sports Medicine', 'Exercise Physiology', 'Sports Psychology',
  'Kinesiology', 'Nutrition', 'Athletic Training', 'Sports Management',

  // Military & Security
  'Military Strategy', 'Defense Policy', 'Intelligence Analysis',
  'Counterterrorism', 'National Security', 'Peacekeeping', 'Logistics',

  // Space & Aeronautics
  'Astrophysics', 'Planetary Science', 'Space Exploration',
  'Satellite Technology', 'Astronautics', 'Space Policy',

  // Energy
  'Renewable Energy', 'Nuclear Energy', 'Petroleum Engineering',
  'Energy Policy', 'Power Systems', 'Energy Economics',

  // Transportation
  'Transportation Engineering', 'Urban Mobility', 'Aviation',
  'Maritime Studies', 'Railway Engineering', 'Autonomous Vehicles'
] as const;

export type ExpertField = typeof EXPERT_FIELDS[number];
