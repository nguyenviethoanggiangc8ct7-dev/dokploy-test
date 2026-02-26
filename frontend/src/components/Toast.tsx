import { X } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

export default function Toast() {
    const { toasts, removeToast } = useUIStore();
    if (toasts.length === 0) return null;
    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <span className="toast-message">{t.message}</span>
                    <button className="toast-close" onClick={() => removeToast(t.id)}><X size={16} /></button>
                </div>
            ))}
        </div>
    );
}
