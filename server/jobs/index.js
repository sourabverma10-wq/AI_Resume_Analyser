import softwareEngineer from './software-engineer.js';
import frontendDeveloper from './frontend-developer.js';

const unwrapJob = jobModule => jobModule?.default || jobModule;
export const jobs = [unwrapJob(softwareEngineer), unwrapJob(frontendDeveloper)];

export function findJob(id) {
  return jobs.find(job => job.id === id);
}
