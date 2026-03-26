interface BlockingDialogProps {
  isOpen: boolean;
  weaponName: string;
  mechName: string;
  locationKey: string;
  reason: 'OVERWEIGHT' | 'CRIT_OVERFLOW';
  onClose: () => void;
}

const BlockingDialog = ({ isOpen, weaponName, mechName, locationKey, reason, onClose }: BlockingDialogProps) => {
  if (!isOpen) return null;

  const bodyText =
    reason === 'OVERWEIGHT'
      ? `Adding ${weaponName} would exceed ${mechName}'s weight limit.`
      : `No space in ${locationKey.toUpperCase()} for ${weaponName} — not enough critical slots.`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#161616',
          border: '1px solid #2A2A2A',
          maxWidth: '320px',
          width: '90%',
          padding: '20px',
          borderRadius: '2px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="font-mono uppercase tracking-wider"
          style={{ color: '#C87941', fontSize: 'var(--fs-badge)' }}
        >
          CANNOT EQUIP
        </div>
        <div
          style={{ color: '#8A8A8A', fontSize: 'var(--fs-badge)', margin: '12px 0' }}
        >
          {bodyText}
        </div>
        <button
          onClick={onClose}
          className="font-mono uppercase w-full"
          style={{
            backgroundColor: '#2A2A2A',
            color: '#E0E0E0',
            padding: '10px',
            minHeight: '44px',
            border: 'none',
            borderRadius: '2px',
            fontSize: 'var(--fs-badge)',
            cursor: 'pointer',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 110,
          }}
        >
          GOT IT
        </button>
      </div>
    </div>
  );
};

export default BlockingDialog;
