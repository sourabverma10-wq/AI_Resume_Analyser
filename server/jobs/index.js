import softwareEngineer from './software-engineer.js';
import frontendDeveloper from './frontend-developer.js';
import aiMlEngineer from './ai-ml-engineer.js';
import promptEngineer from './prompt-engineer.js';
import uiUxDesigner from './ui-ux-designer.js';
import cyberSecurityExpert from './cyber-security-expert.js';
import fullStackWebDeveloper from './full-stack-web-developer.js';

const unwrapJob = jobModule => jobModule?.default || jobModule;
export const jobs = [
  unwrapJob(softwareEngineer),
  unwrapJob(frontendDeveloper),
  unwrapJob(aiMlEngineer),
  unwrapJob(promptEngineer),
  unwrapJob(uiUxDesigner),
  unwrapJob(cyberSecurityExpert),
  unwrapJob(fullStackWebDeveloper)
];

export function findJob(id) {
  return jobs.find(job => job.id === id);
}
