import {createContext, useContext} from "react";

export const CollapseContext = createContext(null);

export const useCollapse = () => useContext(CollapseContext);
