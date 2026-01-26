import OpenAI from 'openai';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const PROMPT_URL = new URL('./prompt.txt', import.meta.url);
const prompt = await readFile(PROMPT_URL, 'utf8');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = 'gpt-5-nano';

const entrySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    seed: { type: 'integer' },
    range: {
      type: 'object',
      additionalProperties: false,
      properties: {
        min: { type: 'integer' },
        max: { type: 'integer' },
      },
      required: ['min', 'max'],
    },
    N: { type: 'integer' },
    t: { type: 'integer' },
  },
  required: ['seed', 'range', 'N', 't'],
};

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    easy: entrySchema,
    intermediate: entrySchema,
    hard: entrySchema,
  },
  required: ['easy', 'intermediate', 'hard'],
};

const response = await client.responses.create({
  model,
  input: prompt,
  text: {
    format: {
      type: 'json_schema',
      name: 'dummy_db_keys',
      strict: true,
      schema,
    },
  },
});

const outputText = response.output_text;

if (!outputText) {
  throw new Error('No output text returned from OpenAI response.');
}

const outputDir = new URL('../../mocked-data/', import.meta.url);
const fileUrl = new URL(`./dummy-operation-data.json`, outputDir);

await mkdir(outputDir, { recursive: true });

await writeFile(fileUrl, outputText);
