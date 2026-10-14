export type DlcMode = 'ALL' | 'ONLY' | 'HIDE';

/** ALL shows everything, ONLY shows DLC items, HIDE shows base-game items. */
export function matchesDlcMode(dlcSource: string, mode: DlcMode): boolean {
  if (mode === 'ONLY') return dlcSource !== 'Base';
  if (mode === 'HIDE') return dlcSource === 'Base';
  return true;
}

export function nextDlcMode(mode: DlcMode): DlcMode {
  return mode === 'ALL' ? 'ONLY' : mode === 'ONLY' ? 'HIDE' : 'ALL';
}

export const DLC_MODE_LABEL: Record<DlcMode, string> = {
  ALL: 'DLC',
  ONLY: 'DLC ONLY',
  HIDE: 'NO DLC',
};
