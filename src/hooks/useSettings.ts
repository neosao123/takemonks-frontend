import { useContext } from "react";
import SettingsContext from "../contexts/SettingsContext";

// ----------------------------------------------------------------------

const useSettings = () => useContext(SettingsContext as any);

export default useSettings;
