const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function updateSrc() {
  const i = html.indexOf('function update()');
  assert.ok(i >= 0, 'missing update()');
  return html.slice(i, i + 2000);
}

describe('pause', () => {
  it('freezes background when paused', () => {
    const u = updateSrc();
    const guard = u.indexOf("state === 'paused'");
    const stars = u.indexOf('for (const s of stars)');
    const frame = u.indexOf('frame++');
    assert.ok(guard >= 0, 'no paused guard');
    assert.ok(guard < stars, 'guard must precede star scroll');
    assert.ok(guard < frame, 'guard must precede frame++');
  });
});

describe('drone hitbox', () => {
  it('matches sprite', () => {
    const line = html.split('\n').find((l) => l.includes("o.k === 'drone'") && l.includes('ox1'));
    assert.ok(line, 'missing drone hitbox line');
    assert.ok(line.includes('oy1 = o.y - 14'), 'oy1 must be o.y - 14');
    assert.ok(line.includes('oy2 = o.y + 2'), 'oy2 must be o.y + 2');
  });
});

describe('music', () => {
  it('does not auto-start on jump/click', () => {
    assert.ok(!html.includes('if (!MUS.on)'), 'auto-start still present');
  });

  it('keeps manual toggle', () => {
    assert.ok(html.includes("KeyM"), 'missing KeyM toggle');
    assert.ok(html.includes('musicBtn'), 'missing music button');
  });

  it('toggle survives missing AudioContext', () => {
    const i = html.indexOf('function musToggle()');
    assert.ok(i >= 0, 'missing musToggle()');
    const fn = html.slice(i, i + 600);
    const guard = fn.indexOf('if (!AC');
    const use = fn.indexOf('AC.currentTime');
    assert.ok(guard >= 0 && guard < use, 'musToggle must guard null AC');
  });

  it('start screen documents M', () => {
    assert.ok(!html.includes('παίζει μόνη της'), 'stale auto-music hint');
    assert.ok(html.includes('M μουσική') || html.includes('M: μουσική'), 'missing M hint');
  });
});

describe('perf', () => {
  it('uses no shadowBlur in hot path', () => {
    const n = (html.match(/shadowBlur/g) || []).length;
    assert.equal(n, 0);
  });

  it('caches sun gradient', () => {
    assert.ok(html.includes('if (!SUN)'), 'sun gradient rebuilt per frame');
  });

  it('prerenders static scenery', () => {
    const draws = (html.match(/drawImage/g) || []).length;
    assert.ok(draws >= 2, 'no prerendered blits');
  });
});

describe('tooling', () => {
  it('has package scripts and server', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    assert.ok(pkg.scripts && pkg.scripts.start, 'missing start script');
    assert.ok(pkg.scripts && pkg.scripts.test, 'missing test script');
    assert.ok(fs.existsSync(path.join(root, 'server.js')), 'missing server.js');
  });
});
