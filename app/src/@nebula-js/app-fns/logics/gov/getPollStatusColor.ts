export function getPollStatusColor(pollStatus: string | undefined): string {
  const status = pollStatus?.toLowerCase();
  return status === 'passed' || status === 'executed'
    ? 'var(--color-blue)'
    : status === 'rejected' || status === 'expired' || status === 'failed'
    ? 'var(--color-red)'
    : 'var(--color-white1)';
}
