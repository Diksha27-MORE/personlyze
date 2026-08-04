import { createContext, useContext, useState, useCallback, useMemo } from "react";
import BookDemoModal from "../components/BookDemoModal/BookDemoModal";

const BookDemoModalContext = createContext(undefined);

export function BookDemoModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBookDemo = useCallback(() => setIsOpen(true), []);
  const closeBookDemo = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openBookDemo, closeBookDemo }),
    [isOpen, openBookDemo, closeBookDemo]
  );

  return (
    <BookDemoModalContext.Provider value={value}>
      {children}
      <BookDemoModal isOpen={isOpen} onClose={closeBookDemo} />
    </BookDemoModalContext.Provider>
  );
}

export function useBookDemoModal() {
  const context = useContext(BookDemoModalContext);

  if (context === undefined) {
    throw new Error(
      "useBookDemoModal must be used within a BookDemoModalProvider"
    );
  }

  return context;
}

export default BookDemoModalContext;