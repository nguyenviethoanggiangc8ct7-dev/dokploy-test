import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, FolderOpen } from 'lucide-react';
import { api } from '../services/api';
import { useUIStore } from '../stores/uiStore';
import type { Category } from '../types';

export default function Categories() {
    const { addToast } = useUIStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const loadData = () => {
        setLoading(true);
        api.getCategories().then(setCategories).catch((e: any) => addToast(e.message, 'error')).finally(() => setLoading(false));
    };

    useEffect(loadData, []);

    const filtered = filter ? categories.filter(c => c.type === filter) : categories;

    const handleSave = async (data: any) => {
        try {
            if (editing) { await api.updateCategory(editing.id, data); addToast('Đã cập nhật danh mục'); }
            else { await api.createCategory(data); addToast('Đã thêm danh mục mới'); }
            setShowModal(false); setEditing(null); loadData();
        } catch (e: any) { addToast(e.message, 'error'); }
    };

    const handleDelete = async (id: string) => {
        try { await api.deleteCategory(id); addToast('Đã xóa danh mục'); setConfirmDelete(null); loadData(); }
        catch (e: any) { addToast(e.message, 'error'); }
    };

    const getCount = (c: Category) => (c._count?.hardwareAssets || 0) + (c._count?.softwareAssets || 0);

    return (
        <div>
            <div className="page-title-bar">
                <h2>Danh Mục</h2>
                <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Thêm Danh Mục</button>
            </div>

            <div className="filters-bar">
                <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">Tất cả loại</option>
                    <option value="hardware">Phần cứng</option>
                    <option value="software">Phần mềm</option>
                </select>
            </div>

            {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
                <div className="card-grid">
                    {filtered.length === 0 ? (
                        <div className="empty-state"><FolderOpen /><h3>Chưa có danh mục</h3></div>
                    ) : filtered.map(c => (
                        <div key={c.id} className="grid-card">
                            <div className="grid-card-header">
                                <span className="grid-card-title">{c.name}</span>
                                <div className="table-actions">
                                    <button onClick={() => { setEditing(c); setShowModal(true); }}><Pencil size={16} /></button>
                                    <button className="danger" onClick={() => setConfirmDelete(c.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="grid-card-meta">
                                <span className={`badge badge-${c.type === 'hardware' ? 'active' : 'subscription'}`}>{c.type === 'hardware' ? 'Phần cứng' : 'Phần mềm'}</span>
                                <span style={{ marginLeft: 8 }}>{getCount(c)} tài sản</span>
                            </div>
                            {c.description && <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>{c.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {showModal && <CategoryForm category={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />}

            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-body"><div className="confirm-body"><div className="confirm-icon"><Trash2 size={28} /></div><h3>Xác nhận xóa</h3><p>Danh mục đang có tài sản sẽ không thể xóa.</p></div></div>
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

function CategoryForm({ category, onSave, onClose }: { category: Category | null; onSave: (d: any) => void; onClose: () => void; }) {
    const [form, setForm] = useState({ name: category?.name || '', type: category?.type || 'hardware', description: category?.description || '' });
    const set = (k: string, v: string) => setForm({ ...form, [k]: v });
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
                <div className="modal-header"><h2>{category ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</h2><button className="modal-close" onClick={onClose}><X size={20} /></button></div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
                    <div className="modal-body">
                        <div className="form-group"><label className="form-label">Tên danh mục *</label><input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Loại</label>
                            <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}><option value="hardware">Phần cứng</option><option value="software">Phần mềm</option></select>
                        </div>
                        <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} /></div>
                    </div>
                    <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button><button type="submit" className="btn btn-primary">{category ? 'Cập Nhật' : 'Thêm'}</button></div>
                </form>
            </div>
        </div>
    );
}
