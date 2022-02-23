export function getPollStatusColor(pollStatus: string | undefined): string {
  const status = pollStatus?.toLowerCase();
  return status === 'passed' || status === 'executed'
    ? 'var(--color-blue01)'
    : status === 'rejected' || status === 'expired' || status === 'failed'
    ? 'var(--color-red01)'
    : 'var(--color-white100)';
}
