import { DLC_MODE_LABEL, nextDlcMode, type DlcMode } from '@/lib/dlcFilter';

/** Three-way DLC filter chip: off, DLC ONLY, NO DLC. Tap to cycle. */
const DlcModeChip = ({ mode, onChange, large = false }: { mode: DlcMode; onChange: (m: DlcMode) => void; large?: boolean }) => {
  const active = mode !== 'ALL';
  return (
    <button
      type="button"
      onClick={() => onChange(nextDlcMode(mode))}
      aria-label={`DLC filter: ${DLC_MODE_LABEL[mode]}`}
      className={`shrink-0 px-3 py-1 font-mono ${large ? 'text-label active:scale-[0.97]' : ''} uppercase tracking-wider rounded-sm border transition-colors ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-muted-foreground border-border hover:border-primary/50'
      }`}
      style={large ? undefined : { fontSize: 'var(--fs-badge)' }}
    >
      {DLC_MODE_LABEL[mode]}
    </button>
  );
};

export default DlcModeChip;
