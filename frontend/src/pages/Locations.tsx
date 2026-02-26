import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useUIStore } from '../stores/uiStore';
import type { Location } from '../types';

export default function Locations() {
    const { addToast } = useUIStore();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Location | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const loadData = () => {
        setLoading(true);
        api.getLocations().then(setLocations).catch((e: any) => addToast(e.message, 'error')).finally(() => setLoading(false));
    };

    useEffect(loadData, []);

    const handleSave = async (data: any) => {
        try {
            if (editing) { await api.updateLocation(editing.id, data); addToast('Đã cập nhật vị trí'); }
            else { await api.createLocation(data); addToast('Đã thêm vị trí mới'); }
            setShowModal(false); setEditing(null); loadData();
        } catch (e: any) { addToast(e.message, 'error'); }
    };

    const handleDelete = async (id: string) => {
        try { await api.deleteLocation(id); addToast('Đã xóa vị trí'); setConfirmDelete(null); loadData(); }
        catch (e: any) { addToast(e.message, 'error'); }
    };

    return (
        <div>
            <div className="page-title-bar">
                <h2>Vị Trí</h2>
                <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Thêm Vị Trí</button>
            </div>

            {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
                <div className="card-grid">
                    {locations.length === 0 ? (
                        <div className="empty-state"><MapPin /><h3>Chưa có vị trí</h3></div>
                    ) : locations.map(l => (
                        <div key={l.id} className="grid-card">
                            <div className="grid-card-header">
                                <span className="grid-card-title">{l.name}</span>
                                <div className="table-actions">
                                    <button onClick={() => { setEditing(l); setShowModal(true); }}><Pencil size={16} /></button>
                                    <button className="danger" onClick={() => setConfirmDelete(l.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="grid-card-meta">
                                {l.building && <span>🏢 {l.building}</span>}
                                <span style={{ marginLeft: l.building ? 8 : 0 }}>{l._count?.hardwareAssets || 0} tài sản</span>
                            </div>
                            {l.address && <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>📍 {l.address}</p>}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => { setShowModal(false); setEditing(null); }}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
                        <div className="modal-header"><h2>{editing ? 'Sửa Vị Trí' : 'Thêm Vị Trí'}</h2><button className="modal-close" onClick={() => { setShowModal(false); setEditing(null); }}><X size={20} /></button></div>
                        <LocationForm location={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-body"><div className="confirm-body"><div className="confirm-icon"><Trash2 size={28} /></div><h3>Xác nhận xóa</h3><p>Vị trí đang có tài sản sẽ không thể xóa.</p></div></div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Hủy</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function LocationForm({ location, onSave, onClose }: { location: Location | null; onSave: (d: any) => void; onClose: () => void; }) {
    const [form, setForm] = useState({ name: location?.name || '', address: location?.address || '', building: location?.building || '', description: location?.description || '' });
    const set = (k: string, v: string) => setForm({ ...form, [k]: v });
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
            <div className="modal-body">
                <div className="form-group"><label className="form-label">Tên vị trí *</label><input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Tòa nhà</label><input className="form-input" value={form.building} onChange={e => set('building', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Địa chỉ</label><input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} /></div>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button><button type="submit" className="btn btn-primary">{location ? 'Cập Nhật' : 'Thêm'}</button></div>
        </form>
    );
}
