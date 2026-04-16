import { useState, useRef, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

interface SaveLoadoutSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, notes: string | undefined) => 'saved' | 'duplicate_name';
  onOverwrite: (existingId: string, name: string, notes: string | undefined) => void;
  getDuplicateId: (name: string) => { id: string; name: string } | undefined;
}

const SaveLoadoutSheet = ({ open, onClose, onSave, onOverwrite, getDuplicateId }: SaveLoadoutSheetProps) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [duplicateDialog, setDuplicateDialog] = useState<{ id: string; name: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setNotes('');
      setError('');
      const timer = setTimeout(() => {
        nameRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('NAME IS REQUIRED');
      return;
    }
    setError('');

    const dup = getDuplicateId(trimmed);
    if (dup) {
      setDuplicateDialog(dup);
      return;
    }

    const result = onSave(trimmed, notes.trim() || undefined);
    if (result === 'saved') {
      onClose();
    }
  };

  const handleOverwrite = () => {
    if (!duplicateDialog) return;
    onOverwrite(duplicateDialog.id, name.trim(), notes.trim() || undefined);
    setDuplicateDialog(null);
    onClose();
  };

  const handleRename = () => {
    setDuplicateDialog(null);
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  if (!open) return null;

  return (
    <>
      {/* Fixed centered modal overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          style={{
            backgroundColor: '#161616',
            border: '1px solid #2A2A2A',
            width: '100%',
            maxWidth: 400,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className="shrink-0"
            style={{ padding: '16px 16px 8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span className="font-mono uppercase tracking-wider" style={{ color: '#C87941', fontSize: 'var(--fs-body)' }}>
              SAVE LOADOUT
            </span>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ padding: '0 16px 8px 16px' }}>
            <div className="space-y-3">
              <div>
                <input
                  ref={nameRef}
                  type="text"
                  inputMode="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value.slice(0, 40)); setError(''); }}
                  placeholder="LOADOUT NAME"
                  maxLength={40}
                  className="w-full font-mono uppercase tracking-wider text-foreground placeholder:text-muted-foreground px-3 py-2.5 rounded-sm border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                  style={{ backgroundColor: '#0D0D0D', fontSize: 'var(--fs-body)' }}
                />
                {error && (
                  <div className="font-mono text-destructive mt-1" style={{ fontSize: 'var(--fs-badge)' }}>
                    {error}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 120))}
                placeholder="NOTES (OPTIONAL)"
                maxLength={120}
                className="w-full font-mono tracking-wider text-foreground placeholder:text-muted-foreground px-3 py-2.5 rounded-sm border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                style={{ backgroundColor: '#0D0D0D', fontSize: 'var(--fs-body)' }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="shrink-0" style={{ padding: '8px 16px 16px 16px' }}>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 font-mono uppercase tracking-wider text-muted-foreground border border-border rounded-sm py-2.5 hover:text-foreground transition-colors"
                style={{ fontSize: 'var(--fs-body)' }}
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                className="flex-1 font-mono uppercase tracking-wider text-primary-foreground bg-primary rounded-sm py-2.5 hover:opacity-90 transition-opacity min-h-[44px]"
                style={{ fontSize: 'var(--fs-body)' }}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Name Dialog */}
      <AlertDialog open={!!duplicateDialog} onOpenChange={(o) => { if (!o) setDuplicateDialog(null); }}>
        <AlertDialogContent
          className="border border-border rounded-sm max-w-[360px]"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase tracking-wider text-primary" style={{ fontSize: 'var(--fs-card-title)' }}>
              LOADOUT NAME EXISTS
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-muted-foreground" style={{ fontSize: 'var(--fs-badge)' }}>
              A loadout named "{duplicateDialog?.name}" already exists. Rename your loadout or overwrite the existing one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <button
              onClick={handleRename}
              className="flex-1 font-mono uppercase tracking-wider text-muted-foreground border border-border rounded-sm py-2.5 min-h-[44px] hover:text-foreground transition-colors"
              style={{ fontSize: 'var(--fs-body)' }}
            >
              RENAME
            </button>
            <button
              onClick={handleOverwrite}
              className="flex-1 font-mono uppercase tracking-wider text-primary-foreground bg-primary rounded-sm py-2.5 min-h-[44px] hover:opacity-90 transition-opacity"
              style={{ fontSize: 'var(--fs-body)' }}
            >
              OVERWRITE
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SaveLoadoutSheet;
