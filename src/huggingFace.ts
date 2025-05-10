import { pipeline } from '@xenova/transformers';

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

const inputs = [
  "This is an example sentence.",
  "Each sentence is converted to an embedding."
];

const result = await extractor(inputs, { pooling: 'mean', normalize: true });

console.log(result);
