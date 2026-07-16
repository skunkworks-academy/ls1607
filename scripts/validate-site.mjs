import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'package.json',
  'docusaurus.config.js',
  'src/pages/index.jsx',
  'src/pages/index.module.css',
  'src/components/ProgressTracker/index.jsx',
  'src/components/ProgressTracker/styles.module.css',
  'src/css/custom.css',
  'docs/Luca_Sprunt_Individual_Development_Roadmap.docx',
];

const checks = [
  ['src/pages/index.jsx', 'Welcome,', 'personalised welcome headline'],
  ['src/pages/index.jsx', 'Download my IDR', 'primary IDR download action'],
  ['src/pages/index.jsx', 'Start the first 10 days', 'learner onboarding action'],
  ['src/pages/index.jsx', 'role="progressbar"', 'accessible capability graphs'],
  ['src/components/ProgressTracker/index.jsx', 'Starter weekly timetable', 'weekly timetable'],
  ['src/components/ProgressTracker/index.jsx', 'Review and sign-off workflow', 'review governance'],
  ['src/components/ProgressTracker/index.jsx', 'Export progress', 'local progress export'],
  ['src/components/ProgressTracker/index.jsx', 'window.localStorage', 'browser-local persistence'],
  ['docusaurus.config.js', 'LearningResource', 'structured learning-resource data'],
  ['docusaurus.config.js', 'sitemap.xml', 'sitemap configuration'],
  ['src/css/custom.css', 'prefers-reduced-motion', 'reduced-motion support'],
];

const errors = [];
for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) errors.push(`Missing required file: ${file}`);
}

for (const [file, token, description] of checks) {
  const fullPath = join(root, file);
  if (!existsSync(fullPath)) continue;
  const content = readFileSync(fullPath, 'utf8');
  if (!content.includes(token)) errors.push(`Missing ${description} in ${file}`);
}

const publicSources = [
  'docusaurus.config.js',
  'src/pages/index.jsx',
  'src/components/ProgressTracker/index.jsx',
  'src/css/custom.css',
].map((file) => readFileSync(join(root, file), 'utf8')).join('\n');

for (const protectedValue of ['lucasprunt@gmail.com', '493240070']) {
  if (publicSources.toLowerCase().includes(protectedValue.toLowerCase())) {
    errors.push('Protected learner contact information detected in public source files');
  }
}

if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(publicSources)) {
  errors.push('Render-blocking external Google Fonts reference detected');
}

if (errors.length) {
  console.error('IDR portal validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`IDR portal validation passed (${requiredFiles.length} files, ${checks.length} feature gates).`);
