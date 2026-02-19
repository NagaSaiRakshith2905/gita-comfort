/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

const versePath = '/private/tmp/gita_verse.json';
const translationPath = '/private/tmp/gita_translation.json';

if (!fs.existsSync(versePath) || !fs.existsSync(translationPath)) {
  throw new Error('Required source files are missing in /private/tmp.');
}

const verseData = JSON.parse(fs.readFileSync(versePath, 'utf8'));
const translationData = JSON.parse(fs.readFileSync(translationPath, 'utf8'));

const TRANSLATION_AUTHOR = 'Swami Sivananda';

const clean = (text) => {
  if (!text) return '';
  return text
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const stopwords = new Set([
  'the', 'and', 'of', 'to', 'in', 'is', 'for', 'with', 'that', 'as', 'on', 'by', 'be', 'are',
  'this', 'it', 'or', 'an', 'at', 'from', 'his', 'he', 'she', 'they', 'their', 'you', 'your',
  'i', 'we', 'our', 'a', 'but', 'not', 'who', 'what', 'when', 'where', 'why', 'how', 'all',
  'my', 'me', 'him', 'her', 'them', 'was', 'were', 'been', 'being', 'into', 'than', 'then',
  'so', 'such', 'these', 'those', 'do', 'does', 'did', 'done', 'have', 'has', 'had', 'shall',
  'will', 'would', 'should', 'can', 'could', 'may', 'might', 'must', 'o', 'oh'
]);

const extractKeywords = (text) => {
  const freq = new Map();
  text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !stopwords.has(w))
    .forEach((word) => {
      freq.set(word, (freq.get(word) || 0) + 1);
    });

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([word]) => word);
};

const inferEmotion = (text) => {
  const t = text.toLowerCase();
  if (/(battle|war|fight|slay|killed|weapon|army|armies)/.test(t)) return 'Conflict';
  if (/(devotion|worship|adore|lord|god|krishna|divine|supreme)/.test(t)) return 'Devotion';
  if (/(fear|doubt|grief|sorrow|despair|confused|delusion)/.test(t)) return 'Distress';
  if (/(peace|calm|tranquil|equanimity|serene)/.test(t)) return 'Peace';
  if (/(wisdom|knowledge|understand|truth|discern)/.test(t)) return 'Reflection';
  if (/(duty|action|work|karma|perform)/.test(t)) return 'Resolve';
  return 'Contemplative';
};

const normalizeVerse = (shloka) => {
  return clean(shloka)
    .replace(/^\s*(Dhritarashtra|Arjuna|The Blessed Lord|Sanjaya) said,\s*/i, '')
    .replace(/^\s*"|"\s*$/g, '')
    .trim();
};

const makeSimpleExplanation = (shloka, emotion) => {
  const core = normalizeVerse(shloka);
  if (!core) return 'This verse conveys a key spiritual teaching.';

  const starters = {
    Conflict: 'This verse presents a moment of conflict and moral tension: ',
    Devotion: 'This verse emphasizes devotion to the Divine: ',
    Distress: 'This verse expresses inner struggle and emotional uncertainty: ',
    Peace: 'This verse points toward inner calm and balance: ',
    Reflection: 'This verse explains a philosophical insight: ',
    Resolve: 'This verse encourages disciplined action and duty: ',
    Contemplative: 'This verse offers spiritual reflection: '
  };

  return `${starters[emotion] || starters.Contemplative}${core}`;
};

const makeBriefExplanation = (shloka) => {
  const t = shloka.toLowerCase();
  if (/(battle|army|war|fight|slay|weapon)/.test(t)) {
    return 'War context highlights the ethical challenge behind action.';
  }
  if (/(karma|duty|action|work|perform)/.test(t)) {
    return 'Act according to dharma without attachment to outcomes.';
  }
  if (/(lord|krishna|supreme|divine|devotion|worship)/.test(t)) {
    return 'Devotion and surrender to the Supreme are central here.';
  }
  if (/(self|soul|atman|field|knower|knowledge|wisdom|truth)/.test(t)) {
    return 'The verse develops self-knowledge and spiritual discernment.';
  }
  if (/(equanimity|peace|calm|tranquil)/.test(t)) {
    return 'It teaches steadiness and equanimity in all situations.';
  }
  if (/(desire|anger|greed|delusion|fear|grief|sorrow)/.test(t)) {
    return 'It warns against inner disturbances that cloud judgment.';
  }
  return 'It reinforces spiritual clarity, discipline, and right living.';
};

const translationByVerseId = new Map(
  translationData
    .filter((x) => x.lang === 'english' && x.authorName === TRANSLATION_AUTHOR)
    .map((x) => [x.verse_id, clean(x.description)])
);

const output = [];

for (const v of verseData) {
  if (v.chapter_number === 13 && v.verse_number === 1) continue;

  const shloka = translationByVerseId.get(v.id) || '';

  let shlokaNumber = v.verse_number;
  if (v.chapter_number === 13 && v.verse_number > 1) {
    shlokaNumber = v.verse_number - 1;
  }

  const emotion = inferEmotion(shloka);
  const simpleExplanation = makeSimpleExplanation(shloka, emotion);
  const briefExplanation = makeBriefExplanation(shloka);

  output.push({
    chapter: v.chapter_number,
    shlokaNumber,
    shloka,
    simpleExplanation,
    briefExplanation,
    emotion,
    keywords: extractKeywords(`${shloka} ${simpleExplanation} ${briefExplanation}`)
  });
}

if (output.length !== 700) {
  throw new Error(`Expected 700 records, got ${output.length}`);
}

const outPath = path.join(
  '/Users/nrakshit/Documents/projects/personal/krishn',
  'data-set',
  'bhagavad_gita_700_english_v2.json'
);

fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Wrote ${output.length} records to ${outPath}`);
