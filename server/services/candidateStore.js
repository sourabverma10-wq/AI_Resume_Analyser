import { randomUUID } from 'node:crypto';

const candidates = [];

export function createCandidate(candidate) {
  const savedCandidate = {
    _id: randomUUID(),
    ...candidate,
    createdAt: new Date().toISOString()
  };
  candidates.unshift(savedCandidate);
  return savedCandidate;
}

export function listCandidates() {
  return candidates.map(({ resumeText, jobDescription, ...candidate }) => candidate);
}

export function findCandidate(id) {
  return candidates.find(candidate => candidate._id === id);
}