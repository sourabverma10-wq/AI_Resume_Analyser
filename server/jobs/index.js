import softwareEngineer from './software-engineer.js';
import frontendDeveloper from './frontend-developer.js';

export const jobs = [softwareEngineer, frontendDeveloper];

export function findJob(id) {
  return jobs.find(job => job.id === id);
}
