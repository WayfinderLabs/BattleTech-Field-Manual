import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { useSavedLoadouts } from '@/hooks/useSavedLoadouts';
import { MECHS } from '@/data/mechs';
import type { SavedLoadout } from '@/types/savedLoadout';

const SavedLoadoutsScreen = () => {
  const navigate = useNavigate();
  const { savedLoadouts, deleteLoadout } = useSavedLoadouts();
  const [deleteTarget, setDeleteTarget] = useState<SavedLoadout | null>(null);
  const [loadTarget, setLoadTarget] = useState<SavedLoadout | null>(null);

  const getMech = (mechId: string) => MECHS.find(m => m.id.toString() === mechId);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteLoadout(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleLoad = () => {
    if (!loadTarget) return;
    navigate('/loadout', { state: { restoreLoadout: loadTarget } });
    setLoadTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-mono uppercase tracking-wider text-primary font-bold" style={{ fontSize: 'var(--fs-heading)' }}>
          SAVED LOADOUTS
        </h1>
      </div>

      {/* Empty state */}
      {savedLoadouts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <div className="font-mono uppercase tracking-wider text-muted-foreground" style={{ fontSize: 'var(--fs-body)' }}>
            NO SAVED LOADOUTS
          </div>
          <div className="font-mono text-muted-foreground text-center" style={{ fontSize: 'var(--fs-badge)' }}>
            Build and save a loadout from the LOADOUT BUILDER tab.
          </div>
        </div>
      )}

      {/* Loadout cards */}
      <div className="space-y-2">
        {savedLoadouts.map((loadout) => {
          const mech = getMech(loadout.mechId);
          return (
            <div
              key={loadout.id}
              className="border border-border rounded-sm p-3 flex items-start gap-3 cursor-pointer hover:border-primary/30 transition-colors"
              style={{ backgroundColor: '#161616' }}
              onClick={() => setLoadTarget(loadout)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-mono uppercase tracking-wider text-primary font-semibold" style={{ fontSize: 'var(--fs-card-title)' }}>
                  {loadout.name}
                </div>
                <div className="font-mono text-muted-foreground" style={{ fontSize: 'var(--fs-badge)' }}>
                  {mech ? `${mech.name} · ${mech.variant}` : 'Unknown Mech'}
                </div>
                {loadout.notes && (
                  <div className="font-mono text-muted-foreground italic truncate mt-0.5" style={{ fontSize: 'var(--fs-badge)' }}>
                    {loadout.notes}
                  </div>
                )}
                <div className="font-mono text-muted-foreground mt-1" style={{ fontSize: '10px' }}>
                  {format(new Date(loadout.savedAt), 'dd MMM yyyy · HH:mm').toUpperCase()}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteTarget(loadout); }}
                className="text-destructive hover:opacity-80 transition-opacity p-1 shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent
          className="border border-border rounded-sm max-w-[360px]"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase tracking-wider text-destructive" style={{ fontSize: 'var(--fs-card-title)' }}>
              DELETE LOADOUT?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-muted-foreground" style={{ fontSize: 'var(--fs-badge)' }}>
              "{deleteTarget?.name}" will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 font-mono uppercase tracking-wider text-muted-foreground border border-border rounded-sm py-2.5 min-h-[44px] hover:text-foreground transition-colors"
              style={{ fontSize: 'var(--fs-body)' }}
            >
              CANCEL
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 font-mono uppercase tracking-wider text-destructive-foreground bg-destructive rounded-sm py-2.5 min-h-[44px] hover:opacity-90 transition-opacity"
              style={{ fontSize: 'var(--fs-body)' }}
            >
              DELETE
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Load Confirm Dialog */}
      <AlertDialog open={!!loadTarget} onOpenChange={(o) => { if (!o) setLoadTarget(null); }}>
        <AlertDialogContent
          className="border border-border rounded-sm max-w-[360px]"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase tracking-wider text-primary" style={{ fontSize: 'var(--fs-card-title)' }}>
              LOAD LOADOUT?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-muted-foreground" style={{ fontSize: 'var(--fs-badge)' }}>
              This will replace your current build with "{loadTarget?.name}". Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <button
              onClick={() => setLoadTarget(null)}
              className="flex-1 font-mono uppercase tracking-wider text-muted-foreground border border-border rounded-sm py-2.5 min-h-[44px] hover:text-foreground transition-colors"
              style={{ fontSize: 'var(--fs-body)' }}
            >
              CANCEL
            </button>
            <button
              onClick={handleLoad}
              className="flex-1 font-mono uppercase tracking-wider text-primary-foreground bg-primary rounded-sm py-2.5 min-h-[44px] hover:opacity-90 transition-opacity"
              style={{ fontSize: 'var(--fs-body)' }}
            >
              LOAD
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedLoadoutsScreen;
