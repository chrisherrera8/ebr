export const QUERY_KEYS = {
  documents: ['documents'] as const,
} as const;

export const ACCEPTED_FILE_TYPES = ['application/pdf'];
export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const TOAST_DURATION_MS = 4000;

export const SUGGESTED_QUESTIONS = [
  'What are the main topics covered in the uploaded documents?',
  'Can you summarize the key findings from the documents?',
  'What are the most important conclusions mentioned?',
] as const;
