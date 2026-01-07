import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { Expert, EXPERT_FIELDS } from '../experts/Expert.js';

/**
 * Expert name database
 */
const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
  'Alexander', 'Rachel', 'Patrick', 'Catherine', 'Frank', 'Carolyn', 'Jack', 'Janet',
  'Dennis', 'Ruth', 'Jerry', 'Maria', 'Tyler', 'Heather', 'Aaron', 'Diane',
  'Jose', 'Virginia', 'Adam', 'Julie', 'Henry', 'Joyce', 'Nathan', 'Victoria',
  'Douglas', 'Olivia', 'Zachary', 'Kelly', 'Peter', 'Christina', 'Kyle', 'Lauren',
  'Walter', 'Joan', 'Ethan', 'Evelyn', 'Jeremy', 'Judith', 'Harold', 'Megan',
  'Keith', 'Cheryl', 'Christian', 'Andrea', 'Roger', 'Hannah', 'Noah', 'Jacqueline',
  'Gerald', 'Martha', 'Carl', 'Gloria', 'Terry', 'Teresa', 'Sean', 'Ann',
  'Austin', 'Sara', 'Arthur', 'Madison', 'Lawrence', 'Frances', 'Jesse', 'Kathryn',
  'Dylan', 'Janice', 'Bryan', 'Jean', 'Joe', 'Abigail', 'Jordan', 'Alice'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers',
  'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell',
  'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales', 'Fisher',
  'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham',
  'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant',
  'Herrera', 'Gibson', 'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray',
  'Ford', 'Castro', 'Marshall', 'Owens', 'Harrison', 'Fernandez', 'McDonald', 'Woods',
  'Washington', 'Kennedy', 'Wells', 'Vargas', 'Henry', 'Chen', 'Freeman', 'Webb',
  'Tucker', 'Guzman', 'Burns', 'Crawford', 'Olson', 'Simpson', 'Porter', 'Hunter'
];

const CREDENTIALS = [
  'PhD', 'MD', 'MBA', 'JD', 'MSc', 'MA', 'EdD', 'DBA', 'MPH', 'MFA',
  'LLM', 'DSc', 'DPhil', 'PsyD', 'PharmD', 'DVM', 'DNP', 'DPT', 'OD', 'DDS'
];

const TITLES = [
  'Professor', 'Dr.', 'Chief', 'Director', 'Senior', 'Principal', 'Lead',
  'Distinguished Professor', 'Emeritus Professor', 'Associate Professor', 'Assistant Professor'
];

const PERSONALITY_TRAITS = [
  'analytical', 'pragmatic', 'innovative', 'conservative', 'progressive',
  'detail-oriented', 'visionary', 'collaborative', 'independent', 'methodical',
  'creative', 'systematic', 'empirical', 'theoretical', 'practical',
  'cautious', 'bold', 'balanced', 'principled', 'flexible',
  'data-driven', 'intuitive', 'strategic', 'tactical', 'holistic',
  'specialized', 'interdisciplinary', 'traditional', 'reform-minded', 'evidence-based'
];

/**
 * Generate a random expert profile
 */
function generateExpert(id: number, field: string): Expert {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = `${firstName} ${lastName}`;

  const numCredentials = 1 + Math.floor(Math.random() * 3);
  const credentials = Array.from({ length: numCredentials }, () =>
    CREDENTIALS[Math.floor(Math.random() * CREDENTIALS.length)]
  );

  const title = TITLES[Math.floor(Math.random() * TITLES.length)];
  const yearsOfExperience = 10 + Math.floor(Math.random() * 35);

  const specializations = generateSpecializations(field);
  const achievements = generateAchievements(field, yearsOfExperience);
  const biography = generateBiography(name, field, yearsOfExperience);
  const perspective = generatePerspective(field);

  const numTraits = 3 + Math.floor(Math.random() * 4);
  const traits = Array.from({ length: numTraits }, () =>
    PERSONALITY_TRAITS[Math.floor(Math.random() * PERSONALITY_TRAITS.length)]
  );

  return {
    id: `expert-${String(id).padStart(4, '0')}`,
    name,
    title: `${title}`,
    credentials: Array.from(new Set(credentials)),
    field,
    specializations: Array.from(new Set(specializations)),
    yearsOfExperience,
    achievements,
    biography,
    perspective,
    traits: Array.from(new Set(traits))
  };
}

/**
 * Generate specializations based on field
 */
function generateSpecializations(field: string): string[] {
  const specializations: Record<string, string[]> = {
    'Cardiology': ['interventional cardiology', 'electrophysiology', 'heart failure', 'preventive cardiology'],
    'Neurology': ['stroke', 'epilepsy', 'movement disorders', 'neuromuscular diseases'],
    'Oncology': ['medical oncology', 'radiation oncology', 'surgical oncology', 'immunotherapy'],
    'Artificial Intelligence': ['deep learning', 'natural language processing', 'computer vision', 'reinforcement learning'],
    'Physics': ['quantum mechanics', 'particle physics', 'astrophysics', 'condensed matter'],
    'Economics': ['macroeconomics', 'microeconomics', 'econometrics', 'behavioral economics'],
    'Psychology': ['clinical psychology', 'cognitive psychology', 'developmental psychology', 'social psychology'],
    'Constitutional Law': ['civil rights', 'separation of powers', 'federalism', 'judicial review'],
    'Climate Science': ['climate modeling', 'paleoclimatology', 'carbon cycle', 'climate policy']
  };

  if (specializations[field]) {
    const count = 2 + Math.floor(Math.random() * 2);
    return specializations[field].slice(0, count);
  }

  // Generate generic specializations
  return [
    `advanced ${field.toLowerCase()}`,
    `applied ${field.toLowerCase()}`,
    `theoretical ${field.toLowerCase()}`
  ].slice(0, 2 + Math.floor(Math.random() * 2));
}

/**
 * Generate achievements
 */
function generateAchievements(field: string, yearsOfExperience: number): string[] {
  const achievements = [
    `Published ${Math.floor(yearsOfExperience * 2)} peer-reviewed papers in ${field}`,
    `Led groundbreaking research in ${field.toLowerCase()}`,
    `Recipient of prestigious awards in ${field}`,
    `Developed innovative methodologies in ${field.toLowerCase()}`,
    `Mentored ${Math.floor(yearsOfExperience / 2)} doctoral students`,
    `Keynote speaker at international ${field} conferences`,
    `Served on editorial boards of leading ${field} journals`,
    `Principal investigator on major research grants`
  ];

  const count = 3 + Math.floor(Math.random() * 3);
  return achievements.sort(() => Math.random() - 0.5).slice(0, count);
}

/**
 * Generate biography
 */
function generateBiography(name: string, field: string, years: number): string {
  return `${name} is a distinguished expert in ${field} with ${years} years of experience. ` +
    `Known for groundbreaking contributions to the field, ${name.split(' ')[0]} has shaped ` +
    `modern understanding of ${field.toLowerCase()} through extensive research, teaching, and practice.`;
}

/**
 * Generate perspective
 */
function generatePerspective(field: string): string {
  const perspectives = [
    `evidence-based approach to ${field.toLowerCase()}`,
    `integrative perspective on ${field.toLowerCase()}`,
    `critical analysis of ${field.toLowerCase()}`,
    `practical application of ${field.toLowerCase()} principles`,
    `innovative solutions in ${field.toLowerCase()}`
  ];

  return perspectives[Math.floor(Math.random() * perspectives.length)];
}

/**
 * Main generation function
 */
async function generateAllExperts() {
  console.log('Generating 1000+ expert profiles...');

  const dataDir = './data/experts';
  await mkdir(dataDir, { recursive: true });

  // Distribute experts across fields
  const expertsPerField = Math.ceil(1100 / EXPERT_FIELDS.length);
  let expertId = 1;
  let totalExperts = 0;

  // Generate experts for each field
  for (const field of EXPERT_FIELDS) {
    const experts: Expert[] = [];
    const count = Math.max(1, expertsPerField + Math.floor(Math.random() * 3) - 1);

    for (let i = 0; i < count && totalExperts < 1100; i++) {
      experts.push(generateExpert(expertId++, field));
      totalExperts++;
    }

    // Save to file (grouped by field)
    const filename = `${field.toLowerCase().replace(/\s+/g, '-')}.json`;
    const filepath = join(dataDir, filename);

    await writeFile(filepath, JSON.stringify(experts, null, 2));
    console.log(`Generated ${experts.length} experts for ${field}`);
  }

  console.log(`\nTotal experts generated: ${totalExperts}`);
  console.log(`Saved to ${dataDir}/`);
}

// Run the generator
generateAllExperts().catch(console.error);
