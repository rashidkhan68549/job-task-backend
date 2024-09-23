import { EventEmitter } from 'events';
import axios from 'axios';
import { readJobsFromFile, writeJobsToFile } from './utils.js';

const eventEmitter = new EventEmitter();
const ACCESS_KEY = 'A0EbsgBDAUOcqYnCseUm_UqjGd-Q5ztMjvogj04kC8U'

eventEmitter.on('fetchImage', ({ jobId }) => {
	const step = 5;
	const min = 1;
	const max = Math.floor(300000 / step);
	const randomTime = Math.floor(Math.random() * (max - min + 1)) * step + step;
	setTimeout(async () => {
		const jobs = readJobsFromFile();
		const newJob = jobs.find((j) => j.id === jobId);			

		try {
			const response = await axios.get('https://api.unsplash.com/photos/random', {
				headers: { 'Authorization': `Client-ID ${ACCESS_KEY}` },
				params: { query: 'food' }
			});
			const updatedJob = { ...newJob, imageUrl: response.data.urls.regular, status: 'done' };
			jobs.splice(jobs.findIndex((j) => j.id === jobId), 1, updatedJob);
			writeJobsToFile(jobs);
		} catch (error) {
			// set that job status to failed
			const failedJob = { ...newJob, status: 'failed' };
			jobs.splice(jobs.findIndex((j) => j.id === jobId), 1, failedJob);
			writeJobsToFile(jobs);
			console.log(error);
		}
	}, randomTime);
});

export default eventEmitter;
