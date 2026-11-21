import { seedHistory } from '../data/sample-data.js';

const KEY = 'luma-r1-prototype-v1';
const VERSION = 1;
const initial = () => ({
  version: VERSION, entered: false, theme: 'system', screen: 'login',
  goal: null, draftIntent: 'homework', session: null, events: [],
  fixtureEpoch: Date.now(), sequence: 0, dismissedIntro: false,
  previewSession: null, previewEvents: [], previewSequence: 0
});

function safeLoad() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial();
    const value = JSON.parse(raw);
    if (!value || value.version !== VERSION || !Array.isArray(value.events)) return initial();
    return { ...initial(), ...value };
  } catch { return initial(); }
}
export const state = safeLoad();
export function save() {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { /* Private browsing: current-tab interaction still works. */ }
}
export function change(fn) { fn(state); save(); return state; }
export function resetDemo() {
  const fresh = initial();
  for (const key of Object.keys(state)) delete state[key];
  Object.assign(state, fresh);
  save();
}
export function allEvidence(s = state) {
  const samples = seedHistory.map(e => ({
    ...e, at: new Date(s.fixtureEpoch - e.daysAgo * 86400000).toISOString(),
    materialId: e.id === 'seed-1' ? 'because.demo-a' : 'because.demo-b'
  }));
  return [...samples, ...s.events].sort((a,b) => Date.parse(a.at) - Date.parse(b.at));
}
export function timeLabel(at) {
  return new Date(at).toLocaleString('zh-CN', {
    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
  });
}
