import fs from 'fs';

const FILE_PATH = './jobs.txt';

const readJobsFromFile = () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return data ? JSON.parse(data) : [];
};

const writeJobsToFile = (jobs) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(jobs, null, 2));
};

export { readJobsFromFile, writeJobsToFile };