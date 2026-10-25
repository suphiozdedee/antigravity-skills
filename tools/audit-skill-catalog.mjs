#!/usr/bin/env node
/**
 * Read-only local catalog inspection. No network, no installs, no deletes.
 * Scores are *screening signals*, not expert certification or permission to run.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(process.argv.find(arg => arg.startsWith('--root='))?.slice(7) || process.cwd());
const strict = process.argv.includes('--fail-on-generated-stubs');
const sha256 = content => crypto.createHash('sha256').update(content).digest('hex');
const toRelative = p => path.relative(root, p).split(path.sep).join('/');

function listFiles(directory, results = []) {
  if (!fs.existsSync(directory)) return results;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    // Never traverse symlinks, foreign locations or hidden Git worktrees.
    if (entry.isSymbolicLink() || entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) listFiles(absolute, results);
    else if (entry.isFile()) results.push(absolute);
  }
  return results;
}

function scoreSkill(content) {
  const plain = content.toLowerCase();
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const headings = (content.match(/^#{1,5}\s+.+$/gm) || []).length;
  const has = expression => expression.test(plain);
  const evidence = {
    substantialDepth: words >= 350,
    structuredSections: headings >= 4,
    concreteWorkflow: has(/step\s+\d+|procedure|implementation|implementation steps|iş akışı|adım|workflow|implementation plan/),
    inputsAndOutputs: has(/input|output|girdi|çıktı|result|deliverable|örnek|example|artifact/),
    boundaries: has(/security|permission|risk|limit|avoid|never|yasak|güvenlik|sınır|yetki/),
    verification: has(/test|verification|acceptance|doğrula|kanıt|kabul|qa|quality gate/),
    failureCases: has(/error|failure|fallback|edge.case|negative|hata|eksik|başarısız/),
    references: has(/https:\/\/|references|kaynak|license|licence|source|standards/)
  };
  // Never award points for labels such as "ultra", "god-tier" or "premium".
  const score = Math.min(100, (words >= 800 ? 28 : words >= 350 ? 18 : words >= 170 ? 10 : 0)
    + (headings >= 6 ? 12 : headings >= 4 ? 8 : 0)
    + Number(evidence.concreteWorkflow) * 12
    + Number(evidence.inputsAndOutputs) * 10
    + Number(evidence.boundaries) * 14
    + Number(evidence.verification) * 12
    + Number(evidence.failureCases) * 8
    + Number(evidence.references) * 4);
  return { score, words, headings, evidence, requiresHumanReview: true };
}

function generatedPlaceholder(rel, text) {
  const basename = path.posix.basename(rel);
  if (/^squad[1-7]-.*-agent-\d+\.md$/.test(basename)
    || /^global-fairground-venue-specialist-\d+-fellow\.md$/.test(basename)) {
    return /^# [^\n]+\n## Role: [^\n]+\n?$/.test(text) && text.length < 300;
  }
  return false;
}

export function auditCatalog(rootDirectory) {
  const agentsRoot = path.join(rootDirectory, '.agents');
  const all = listFiles(agentsRoot);
  const skills = [];
  const agents = [];
  const hashes = new Map();
  for (const abs of all) {
    const rel = path.relative(rootDirectory, abs).split(path.sep).join('/');
    const isSkill = rel.endsWith('/SKILL.md');
    const isAgent = /^\.agents\/agents\/[^/]+\.md$/.test(rel);
    if (!isSkill && !isAgent) continue;
    const raw = fs.readFileSync(abs, 'utf8');
    const digest = sha256(raw);
    const record = { path: rel, sha256: digest, bytes: Buffer.byteLength(raw, 'utf8') };
    if (isSkill) {
      const screened = { ...record, ...scoreSkill(raw) };
      skills.push(screened);
      if (!hashes.has(digest)) hashes.set(digest, []);
      hashes.get(digest).push(rel);
    } else {
      agents.push({ ...record, generatedPlaceholder: generatedPlaceholder(rel, raw),
        isShortRoleStub: record.bytes < 250 && /^# [^\n]+\n## Role: [^\n]+\n?$/.test(raw) });
    }
  }
  const duplicateGroups = [...hashes.values()].filter(group => group.length > 1)
    .sort((a, b) => b.length - a.length);
  return {
    provenance: { directory: path.resolve(rootDirectory), source: 'filesystem', note: 'Read-only and evidence-based' },
    metrics: {
      skillFiles: skills.length,
      distinctSkillBodies: hashes.size,
      redundantSkillCopies: skills.length - hashes.size,
      agentFiles: agents.length,
      generatedAgentStubs: agents.filter(x => x.generatedPlaceholder).length,
      shortRoleOnlyAgents: agents.filter(x => x.isShortRoleStub).length,
      skillsBelowReviewThreshold: skills.filter(x => x.score < 65).length
    },
    duplicateSkillGroups: duplicateGroups,
    lowEvidenceSkills: skills.filter(x => x.score < 65).map(({path, score, words}) => ({path,score,words})),
    generatedStubs: agents.filter(x => x.generatedPlaceholder).map(x => x.path),
    policy: [
      'Never delete plugin-packaged duplicates without resolving their manifest dependency paths.',
      'Never treat a word-count or heuristic score as verified expert ability.',
      'Never automatically activate an agent on account of its title.',
      'Store no secrets, credentials or Keychain content in audit output.'
    ]
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const result = auditCatalog(root);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  if (strict && result.metrics.generatedAgentStubs > 0) process.exitCode = 1;
}
