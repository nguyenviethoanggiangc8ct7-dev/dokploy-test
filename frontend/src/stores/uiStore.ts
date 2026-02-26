import { create } from 'zustand';

interface ToastItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface UIStore {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    toasts: ToastItem[];
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    sidebarOpen: false,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    closeSidebar: () => set({ sidebarOpen: false }),
    toasts: [],
    addToast: (message, type = 'success') => {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => {
            set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 3500);
    },
    removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
