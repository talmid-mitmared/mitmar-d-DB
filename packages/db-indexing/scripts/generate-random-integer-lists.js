import seedrandom from 'seedrandom';
import { readFile, writeFile } from 'node:fs/promises';

/**
 * @param {number|string} seed
 * @param {number} min inclusive
 * @param {number} max inclusive
 * @param {number} size number of keys
 */
function generateRandomIntList(seed, min, max, size) {
  const span = max - min + 1;
  if (size > span) {
    throw new Error(
      `Cannot generate ${size} unique ints in range [${min}, ${max}] (span=${span}).`,
    );
  }

  const generateRandom = ensureUniqueRandomGeneration(seed, min, max);
  return Array.from({ length: size }, (_, i) => generateRandom(i));
}

/**
 * @param {number|string} seed
 * @param {number} min inclusive
 * @param {number} max inclusive
 */
function ensureUniqueRandomGeneration(seed, min, max) {
  const rng = seedrandom(String(seed));
  const span = max - min + 1;
  const swappedMap = new Map();

  /**
   * @param {number} cursor
   */
  return (cursor) => {
    const randomSlot = cursor + Math.floor(rng() * (span - cursor));

    const cursorValue = swappedMap.get(cursor) ?? cursor;
    const slotValue = swappedMap.get(randomSlot) ?? randomSlot;

    swappedMap.set(cursor, slotValue);
    swappedMap.set(randomSlot, cursorValue);

    return (swappedMap.get(cursor) ?? cursor) + min;
  };
}

const MOCKED_DATA_FILE = new URL('../mocked-data/dummy-operation-data.json', import.meta.url);

/**
 * @typedef {{ seed: number|string, range: { min: number, max: number }, N: number }} Entry
 */

/**
 * @param {string} fileName
 * @param {unknown} entry
 * @returns {Entry}
 */
function validateEntry(fileName, entry) {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`Invalid JSON object in ${fileName}`);
  }

  const typed = /** @type {Entry} */ (entry);
  const { seed, range, N } = typed;

  if (
    seed === undefined ||
    !range ||
    range.min === undefined ||
    range.max === undefined ||
    N === undefined
  ) {
    throw new Error(`Missing required fields in ${fileName}`);
  }

  return { seed, range, N };
}

export async function writeRandomIntLists() {
  const raw = await readFile(MOCKED_DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw);

  const combined = Object.fromEntries(
    Object.entries(parsed).map(([level, entry]) => {
      const { seed, range, N } = validateEntry(level, entry);
      const keys = generateRandomIntList(seed, range.min, range.max, N);
      return [level, keys];
    }),
  );

  await writeFile(MOCKED_DATA_FILE, JSON.stringify(combined, null, 2));
  return combined;
}

writeRandomIntLists().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
