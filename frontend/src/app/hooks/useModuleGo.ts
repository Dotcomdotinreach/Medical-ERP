import { useNavigate } from "react-router";
import { useCallback } from "react";

export function useModuleGo(basePath: string) {
  const nav = useNavigate();
  return useCallback((screen: string) => {
    nav(`/${basePath}/${screen}`);
  }, [nav, basePath]);
}
