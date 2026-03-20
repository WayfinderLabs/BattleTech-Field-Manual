import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "./components/AppShell";
import WeaponsScreen from "./pages/WeaponsScreen";
import MechsScreen from "./pages/MechsScreen";
import EquipmentScreen from "./pages/EquipmentScreen";
import WeaponDetailScreen from "./pages/WeaponDetailScreen";
import MechDetailScreen from "./pages/MechDetailScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<WeaponsScreen />} />
            <Route path="/mechs" element={<MechsScreen />} />
            <Route path="/equipment" element={<EquipmentScreen />} />
            <Route path="/weapons/:id" element={<WeaponDetailScreen />} />
            <Route path="/mechs/:id" element={<MechDetailScreen />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
