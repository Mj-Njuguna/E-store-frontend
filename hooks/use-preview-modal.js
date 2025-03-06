import { create } from 'zustand';

/**
 * Store for managing product preview modal state
 */
const usePreviewModal = create((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewModal;
