import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Download, X } from 'lucide-react';
import { api } from '../services/api';
import { useUIStore } from '../stores/uiStore';
import type { SoftwareAsset, Category } from '../types';
import { SOFTWARE_STATUS_LABELS, LICENSE_TYPE_LABELS } from '../types';

export default function SoftwareAssets() {
    const { addToast } = useUIStore();
    const [assets, setAssets] = useState<SoftwareAsset[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState<SoftwareAsset | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    const loadData = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            const [sw, cats] = await Promise.all([
                api.getSoftware(Object.keys(params).length > 0 ? params : undefined),
                api.getCategories(),
            ]);
            setAssets(sw);
            setCategories(cats.filter((c: Category) => c.type === 'software'));
        } catch (e: any) { addToast(e.message, 'error'); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [search, statusFilter]);

    const paged = assets.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(assets.length / perPage);

    const handleSave = async (formData: any) => {
        try {
            if (editingAsset) {
                await api.updateSoftware(editingAsset.id, formData);
                addToast('Đã cập nhật bản quyền');
            } else {
                await api.createSoftware(formData);
                addToast('Đã thêm bản quyền mới');
            }
            setShowModal(false); setEditingAsset(null); loadData();
        } catch (e: any) { addToast(e.message, 'error'); }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deleteSoftware(id);
            addToast('Đã xóa bản quyền');
            setConfirmDelete(null); loadData();
        } catch (e: any) { addToast(e.message, 'error'); }
    };

    const formatVND = (n?: number) => n ? new Intl.NumberFormat('vi-VN').format(n) + ' ₫' : '—';
    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

    const complianceBar = (used: number, total: number) => {
        const pct = total > 0 ? Math.round((used / total) * 100) : 0;
        const color = pct > 90 ? 'var(--accent-danger)' : pct > 70 ? 'var(--accent-warning)' : 'var(--accent-success)';
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{used}/{total}</span>
            </div>
        );
    };

    return (
        <div>
            <div className="page-title-bar">
                <h2>Tài Sản Phần Mềm</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    <a href={api.exportSoftwareCSV()} className="btn btn-secondary btn-sm"><Download size={16} /> Xuất CSV</a>
                    <button className="btn btn-primary" onClick={() => { setEditingAsset(null); setShowModal(true); }}><Plus size={18} /> Thêm Bản Quyền</button>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-input">
                    <Search />
                    <input placeholder="Tìm theo tên, nhà cung cấp, mã bản quyền..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="">Tất cả trạng thái</option>
                    {Object.entries(SOFTWARE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>

            {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
                <div className="card">
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Phiên Bản</th>
                                    <th>Loại BQ</th>
                                    <th>Sử Dụng</th>
                                    <th>NCC</th>
                                    <th>Trạng Thái</th>
                                    <th>Hết Hạn</th>
                                    <th>Giá Mua</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.length === 0 ? (
                                    <tr><td colSpan={9} className="text-center text-muted" style={{ padding: 40 }}>Không có bản quyền nào</td></tr>
                                ) : paged.map((a) => (
                                    <tr key={a.id}>
                                        <td><strong>{a.name}</strong></td>
                                        <td className="text-muted">{a.version || '—'}</td>
                                        <td><span className={`badge badge-${a.licenseType}`}>{LICENSE_TYPE_LABELS[a.licenseType]}</span></td>
                                        <td style={{ minWidth: 140 }}>{complianceBar(a.seatsUsed, a.seatsTotal)}</td>
                                        <td>{a.vendor || '—'}</td>
                                        <td><span className={`badge badge-${a.status}`}><span className="badge-dot" />{SOFTWARE_STATUS_LABELS[a.status]}</span></td>
                                        <td>{formatDate(a.expirationDate)}</td>
                                        <td className="text-right">{formatVND(a.purchaseCost)}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button title="Sửa" onClick={() => { setEditingAsset(a); setShowModal(true); }}><Pencil size={16} /></button>
                                                <button title="Xóa" className="danger" onClick={() => setConfirmDelete(a.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination">
                            <span>Hiển thị {(page - 1) * perPage + 1}–{Math.min(page * perPage, assets.length)} / {assets.length}</span>
                            <div className="pagination-buttons">
                                <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>◀</button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i} className={`pagination-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                                ))}
                                <button className="pagination-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>▶</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <SoftwareForm asset={editingAsset} categories={categories} onSave={handleSave} onClose={() => { setShowModal(false); setEditingAsset(null); }} />
            )}

            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-body">
                            <div className="confirm-body">
                                <div className="confirm-icon"><Trash2 size={28} /></div>
                                <h3>Xác nhận xóa</h3>
                                <p>Bạn có chắc muốn xóa bản quyền này?</p>
                            </div>
                        </div>
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

function SoftwareForm({ asset, categories, onSave, onClose }: {
    asset: SoftwareAsset | null; categories: Category[]; onSave: (d: any) => void; onClose: () => void;
}) {
    const [form, setForm] = useState({
        name: asset?.name || '', version: asset?.version || '', licenseKey: asset?.licenseKey || '',
        licenseType: asset?.licenseType || 'perpetual', seatsTotal: asset?.seatsTotal?.toString() || '1',
        seatsUsed: asset?.seatsUsed?.toString() || '0', vendor: asset?.vendor || '',
        categoryId: asset?.categoryId || '', purchaseDate: asset?.purchaseDate?.split('T')[0] || '',
        purchaseCost: asset?.purchaseCost?.toString() || '', expirationDate: asset?.expirationDate?.split('T')[0] || '',
        status: asset?.status || 'active', notes: asset?.notes || '',
    });
    const set = (k: string, v: string) => setForm({ ...form, [k]: v });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = { ...form, seatsTotal: parseInt(form.seatsTotal) || 1, seatsUsed: parseInt(form.seatsUsed) || 0 };
        if (data.purchaseCost) data.purchaseCost = parseFloat(data.purchaseCost); else delete data.purchaseCost;
        if (data.purchaseDate) data.purchaseDate = new Date(data.purchaseDate).toISOString(); else delete data.purchaseDate;
        if (data.expirationDate) data.expirationDate = new Date(data.expirationDate).toISOString(); else delete data.expirationDate;
        if (!data.categoryId) data.categoryId = null;
        onSave(data);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{asset ? 'Sửa Bản Quyền' : 'Thêm Bản Quyền Phần Mềm'}</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Tên phần mềm *</label><input className="form-input" required value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Phiên bản</label><input className="form-input" value={form.version} onChange={(e) => set('version', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Mã bản quyền</label><input className="form-input font-mono" value={form.licenseKey} onChange={(e) => set('licenseKey', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Loại bản quyền</label>
                                <select className="form-select" value={form.licenseType} onChange={(e) => set('licenseType', e.target.value)}>
                                    {Object.entries(LICENSE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Tổng số ghế</label><input className="form-input" type="number" min="1" value={form.seatsTotal} onChange={(e) => set('seatsTotal', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Đã sử dụng</label><input className="form-input" type="number" min="0" value={form.seatsUsed} onChange={(e) => set('seatsUsed', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Nhà cung cấp</label><input className="form-input" value={form.vendor} onChange={(e) => set('vendor', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Danh mục</label>
                                <select className="form-select" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                                    <option value="">— Chọn —</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Ngày mua</label><input className="form-input" type="date" value={form.purchaseDate} onChange={(e) => set('purchaseDate', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Giá mua (VNĐ)</label><input className="form-input" type="number" value={form.purchaseCost} onChange={(e) => set('purchaseCost', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Ngày hết hạn</label><input className="form-input" type="date" value={form.expirationDate} onChange={(e) => set('expirationDate', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Trạng thái</label>
                                <select className="form-select" value={form.status} onChange={(e) => set('status', e.target.value)}>
                                    {Object.entries(SOFTWARE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-group"><label className="form-label">Ghi chú</label><textarea className="form-textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} /></div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
                        <button type="submit" className="btn btn-primary">{asset ? 'Cập Nhật' : 'Thêm Bản Quyền'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
