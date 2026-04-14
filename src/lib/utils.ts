export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function truncateFilename(filename: string, maxLength = 30): string {
  if (filename.length <= maxLength) return filename;
  const ext = filename.lastIndexOf('.');
  if (ext === -1) return filename.slice(0, maxLength - 3) + '...';
  const name = filename.slice(0, ext);
  const extension = filename.slice(ext);
  const availableLength = maxLength - extension.length - 3;
  if (availableLength <= 0) return filename.slice(0, maxLength - 3) + '...';
  return name.slice(0, availableLength) + '...' + extension;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
