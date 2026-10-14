type DlcSource = 'Base' | 'Flashpoint' | 'Urban Warfare' | 'Heavy Metal';

export const DLC_SHORT: Record<Exclude<DlcSource, 'Base'>, string> = {
  Flashpoint: 'FP',
  'Urban Warfare': 'UW',
  'Heavy Metal': 'HM',
};

/** Compact DLC marker: FP / UW / HM. Renders nothing for base-game items. */
const DlcBadge = ({ source, className = '' }: { source: DlcSource; className?: string }) => {
  if (source === 'Base') return null;
  return (
    <span
      title={source}
      className={`inline-block px-1 py-0.5 font-mono uppercase rounded-sm border shrink-0 ${className}`}
      style={{ fontSize: 'var(--fs-badge)', borderColor: '#C87941', color: '#C87941', lineHeight: 1.1 }}
    >
      {DLC_SHORT[source]}
    </span>
  );
};

export default DlcBadge;
