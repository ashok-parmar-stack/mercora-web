"use client";

import React, { createContext, useContext } from "react";

interface QueryContextType {
  cache: Map<string, any>;
}

const defaultQueryContext: QueryContextType = {
  cache: new Map(),
};

const QueryContext = createContext<QueryContextType>(defaultQueryContext);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryContext.Provider value={defaultQueryContext}>{children}</QueryContext.Provider>;
}

export const useQueryContext = () => useContext(QueryContext);
