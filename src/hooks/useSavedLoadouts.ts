import { useState, useCallback } from 'react';
import type { SavedLoadout } from '@/types/savedLoadout';
import type { SlotAssignment, EquipmentSlot } from '@/types/loadout';

const STORAGE_KEY = 'btfm_saved_loadouts';

function readFromStorage(): SavedLoadout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(loadouts: SavedLoadout[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loadouts));
}

export function useSavedLoadouts() {
  const [savedLoadouts, setSavedLoadouts] = useState<SavedLoadout[]>(readFromStorage);

  const saveLoadout = useCallback((
    name: string,
    notes: string | undefined,
    mechId: string,
    slots: Record<string, SlotAssignment[]>,
    equipment: Record<string, EquipmentSlot[]>
  ): 'saved' | 'duplicate_name' => {
    const trimmed = name.trim();
    const current = readFromStorage();
    const duplicate = current.find(l => l.name.trim().toLowerCase() === trimmed.toLowerCase());
    if (duplicate) return 'duplicate_name';

    const newLoadout: SavedLoadout = {
      id: crypto.randomUUID(),
      name: trimmed,
      notes: notes?.trim() || undefined,
      mechId,
      slots,
      equipment,
      savedAt: Date.now(),
    };
    const updated = [...current, newLoadout];
    writeToStorage(updated);
    setSavedLoadouts(updated);
    return 'saved';
  }, []);

  const overwriteLoadout = useCallback((
    id: string,
    name: string,
    notes: string | undefined,
    mechId: string,
    slots: Record<string, SlotAssignment[]>,
    equipment: Record<string, EquipmentSlot[]>
  ) => {
    const current = readFromStorage();
    const updated = current.map(l => l.id === id ? {
      ...l,
      name: name.trim(),
      notes: notes?.trim() || undefined,
      mechId,
      slots,
      equipment,
      savedAt: Date.now(),
    } : l);
    writeToStorage(updated);
    setSavedLoadouts(updated);
  }, []);

  const deleteLoadout = useCallback((id: string) => {
    const current = readFromStorage();
    const updated = current.filter(l => l.id !== id);
    writeToStorage(updated);
    setSavedLoadouts(updated);
  }, []);

  const getLoadoutById = useCallback((id: string): SavedLoadout | undefined => {
    return readFromStorage().find(l => l.id === id);
  }, []);

  const getDuplicateByName = useCallback((name: string): SavedLoadout | undefined => {
    const trimmed = name.trim().toLowerCase();
    return readFromStorage().find(l => l.name.trim().toLowerCase() === trimmed);
  }, []);

  return { savedLoadouts, saveLoadout, overwriteLoadout, deleteLoadout, getLoadoutById, getDuplicateByName };
}
