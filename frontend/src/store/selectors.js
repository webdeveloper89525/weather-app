import { useSelector } from "react-redux";

export const _getSettings = () => useSelector((state) => state.settings);
