#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditCatalog } from './audit-skill-catalog.mjs';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-catalog-test-'));
try {
  const put = (name, content) => {
    const target = path.join(dir, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  const common = '---\nname: verification\n---\n# Verification\n## Process\nStep 1: inspect input.\n' +
    '## Output\nOutput evidence.\n## Security\nNever reveal private input.\n' +
    '## Tests\nVerification required.\n';
  put('.agents/skills/verification/SKILL.md', common);
  put('.agents/plugins/another/skills/verification/SKILL.md', common);
  put('.agents/agents/squad3-brief-cad-3drender-agent-1.md',
    '# Beyond-Awwwards Squad 3: Brief Asset Agent #1\n' +
    '## Role: Fully-fledged operational expert #1 specialized in Squad 3.\n');
  put('.agents/agents/exhibition-interior-architect-specialist.md',
    '# Exhibition expert\n## Role: concrete customer brief wizard.\n## Step 1\nCheck fair manual.\n');
  const result = auditCatalog(dir);
  assert.equal(result.metrics.skillFiles, 2);
  assert.equal(result.metrics.distinctSkillBodies, 1);
  assert.equal(result.metrics.redundantSkillCopies, 1);
  assert.equal(result.duplicateSkillGroups[0].length, 2);
  assert.equal(result.metrics.agentFiles, 2);
  assert.equal(result.metrics.generatedAgentStubs, 1);
  assert.ok(result.generatedStubs[0].endsWith('squad3-brief-cad-3drender-agent-1.md'));
  assert.equal(result.metrics.shortRoleOnlyAgents, 1);
  assert.equal(result.metrics.skillsBelowReviewThreshold, 2);
  process.stdout.write('PASS skill catalog: content deduplication, evidence screening, generated stub detection.\n');
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
