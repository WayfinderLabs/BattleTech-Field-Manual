import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "./components/AppShell";
import WeaponsScreen from "./pages/WeaponsScreen";
import MechsScreen from "./pages/MechsScreen";
import EquipmentScreen from "./pages/EquipmentScreen";
import WeaponDetailScreen from "./pages/WeaponDetailScreen";
import MechDetailScreen from "./pages/MechDetailScreen";
import LoadoutBuilderScreen from "./pages/LoadoutBuilderScreen";
import SavedLoadoutsScreen from "./pages/SavedLoadoutsScreen";
import NotFound from "./pages/NotFound";
import { FilterProvider } from "./contexts/FilterContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FilterProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<WeaponsScreen />} />
              <Route path="/mechs" element={<MechsScreen />} />
              <Route path="/equipment" element={<EquipmentScreen />} />
              <Route path="/weapons/:id" element={<WeaponDetailScreen />} />
              <Route path="/mechs/:id" element={<MechDetailScreen />} />
              <Route path="/loadout" element={<LoadoutBuilderScreen />} />
              <Route path="/saved-loadouts" element={<SavedLoadoutsScreen />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
