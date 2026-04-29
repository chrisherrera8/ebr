import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDocuments } from '@/api/documents';

vi.mock('@/api/client', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/api/client';

const mockApiFetch = vi.mocked(apiFetch);

describe('fetchDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the array of documents directly from the API', async () => {
    const documents = [
      { id: 1, name: 'doc1.pdf' },
      { id: 2, name: 'doc2.txt' },
    ];
    mockApiFetch.mockResolvedValue(documents);

    const result = await fetchDocuments();

    expect(mockApiFetch).toHaveBeenCalledWith('/documents');
    expect(result).toEqual(documents);
  });

  it('returns an empty array when the API returns no documents', async () => {
    mockApiFetch.mockResolvedValue([]);

    const result = await fetchDocuments();

    expect(result).toEqual([]);
  });
});
