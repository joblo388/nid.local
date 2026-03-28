"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { Lightbox } from "./Lightbox";

type LightboxContextType = {
  openLightbox: (images: string[], startIndex?: number) => void;
};

const LightboxContext = createContext<LightboxContextType>({
  openLightbox: () => {},
});

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const openLightbox = useCallback((imgs: string[], idx = 0) => {
    setImages(imgs);
    setStartIndex(idx);
    setOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}
      {open && images.length > 0 && (
        <Lightbox images={images} startIndex={startIndex} onClose={closeLightbox} />
      )}
    </LightboxContext.Provider>
  );
}
