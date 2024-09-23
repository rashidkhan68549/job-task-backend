import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import emitter from './fetchImageWorker.js';
import { readJobsFromFile, writeJobsToFile } from './utils.js';

const app = express();
const PORT = 8000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.post('/jobs', (req, res) => {
  const { title, description, company } = req.body;
  
  if (!title || !description || !company) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const jobs = readJobsFromFile();
  const jobId = jobs.length + 1;
  const newJob = { id: jobId, title, description, company, status: 'pending', imageUrl: '',  };
  jobs.push(newJob);
  writeJobsToFile(jobs);
  emitter.emit('fetchImage', { jobId });
  res.status(201).json({ jobId });
});

app.get('/jobs', (_, res) => {
  const jobs = readJobsFromFile().map((job) => {
    const jobStatus = job.status;
    if (jobStatus === 'pending') return { id: job.id, status: jobStatus };
    return job;
  });
  res.json(jobs);
});

app.get('/jobs/:id', (req, res) => {
  const jobs = readJobsFromFile();
  const job = jobs.find((j) => j.id === parseInt(req.params.id));
  if (!job) return res.status(404).json();
  if(job.status === 'done') return res.status(200).json(job);
  return res.status(202).json({ status: job.status });
});

app.get('/', (_, res) => {
  res.send('Welcome to the Job API');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Write instructions to run project, just need to run npm install it will install the packges, then run npm start it will start Server and below write the time for each module we have here in this project
// write everthing in README.md file format i will copy it threre
// write it module wise dont go deep



