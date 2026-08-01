import { createContext, useContext } from "react";

export const FrontendTestContext = createContext(null);

export const useFrontendTest = () => useContext(FrontendTestContext);
