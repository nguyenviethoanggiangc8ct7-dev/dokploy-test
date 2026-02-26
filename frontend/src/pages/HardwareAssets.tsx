import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Download, X } from 'lucide-react';
import { api } from '../services/api';
import { useUIStore } from '../stores/uiStore';
import type { HardwareAsset, Category, Location, Employee } from '../types';
import { STATUS_LABELS } from '../types';

export default function HardwareAssets() {
    const { addToast } = useUIStore();
    const [assets, setAssets] = useState<HardwareAsset[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState<HardwareAsset | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    const loadData = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (categoryFilter) params.categoryId = categoryFilter;
            if (locationFilter) params.locationId = locationFilter;
            const [hw, cats, locs, emps] = await Promise.all([
                api.getHardware(Object.keys(params).length > 0 ? params : undefined),
                api.getCategories(),
                api.getLocations(),
                api.getEmployees(),
            ]);
            setAssets(hw);
            setCategories(cats.filter((c: Category) => c.type === 'hardware'));
            setLocations(locs);
            setEmployees(emps);
        } catch (e: any) {
            addToast(e.message, 'error');
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [search, statusFilter, categoryFilter, locationFilter]);

    const paged = assets.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(assets.length / perPage);

    const handleSave = async (formData: any) => {
        try {
            if (editingAsset) {
                await api.updateHardware(editingAsset.id, formData);
                addToast('Đã cập nhật tài sản');
            } else {
                await api.createHardware(formData);
                addToast('Đã thêm tài sản mới');
            }
            setShowModal(false);
            setEditingAsset(null);
            loadData();
        } catch (e: any) {
            addToast(e.message, 'error');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deleteHardware(id);
            addToast('Đã xóa tài sản');
            setConfirmDelete(null);
            loadData();
        } catch (e: any) {
            addToast(e.message, 'error');
        }
    };

    const openEdit = (asset: HardwareAsset) => { setEditingAsset(asset); setShowModal(true); };
    const openAdd = () => { setEditingAsset(null); setShowModal(true); };

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
    const formatVND = (n?: number) => n ? new Intl.NumberFormat('vi-VN').format(n) + ' ₫' : '—';

    return (
        <div>
            <div className="page-title-bar">
                <h2>Tài Sản Phần Cứng</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    <a href={api.exportHardwareCSV()} className="btn btn-secondary btn-sm"><Download size={16} /> Xuất CSV</a>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Thêm Tài Sản</button>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-input">
                    <Search />
                    <input placeholder="Tìm theo tên, mã, serial, model..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="">Tất cả trạng thái</option>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select className="filter-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
                    <option value="">Tất cả danh mục</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="filter-select" value={locationFilter} onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}>
                    <option value="">Tất cả vị trí</option>
                    {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : (
                <div className="card">
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Mã TS</th>
                                    <th>Tên</th>
                                    <th>Model</th>
                                    <th>Danh Mục</th>
                                    <th>Trạng Thái</th>
                                    <th>Người Dùng</th>
                                    <th>Vị Trí</th>
                                    <th>Ngày Mua</th>
                                    <th>Giá Mua</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.length === 0 ? (
                                    <tr><td colSpan={10} className="text-center text-muted" style={{ padding: 40 }}>Không có tài sản nào</td></tr>
                                ) : paged.map((a) => (
                                    <tr key={a.id}>
                                        <td><span className="asset-tag">{a.assetTag}</span></td>
                                        <td><strong>{a.name}</strong></td>
                                        <td className="text-muted">{a.model || '—'}</td>
                                        <td>{a.category?.name || '—'}</td>
                                        <td><span className={`badge badge-${a.status}`}><span className="badge-dot" />{STATUS_LABELS[a.status]}</span></td>
                                        <td>{a.assignedTo?.name || '—'}</td>
                                        <td>{a.location?.name || '—'}</td>
                                        <td>{formatDate(a.purchaseDate)}</td>
                                        <td className="text-right">{formatVND(a.purchaseCost)}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button title="Sửa" onClick={() => openEdit(a)}><Pencil size={16} /></button>
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

            {/* Add/Edit Modal */}
            {showModal && (
                <HardwareForm
                    asset={editingAsset}
                    categories={categories}
                    locations={locations}
                    employees={employees}
                    onSave={handleSave}
                    onClose={() => { setShowModal(false); setEditingAsset(null); }}
                />
            )}

            {/* Delete Confirm */}
            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-body">
                            <div className="confirm-body">
                                <div className="confirm-icon"><Trash2 size={28} /></div>
                                <h3>Xác nhận xóa</h3>
                                <p>Bạn có chắc muốn xóa tài sản này? Hành động này không thể hoàn tác.</p>
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

function HardwareForm({ asset, categories, locations, employees, onSave, onClose }: {
    asset: HardwareAsset | null;
    categories: Category[];
    locations: Location[];
    employees: Employee[];
    onSave: (data: any) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        name: asset?.name || '',
        assetTag: asset?.assetTag || '',
        serialNumber: asset?.serialNumber || '',
        model: asset?.model || '',
        manufacturer: asset?.manufacturer || '',
        categoryId: asset?.categoryId || '',
        status: asset?.status || 'active',
        assignedToId: asset?.assignedToId || '',
        locationId: asset?.locationId || '',
        purchaseDate: asset?.purchaseDate?.split('T')[0] || '',
        purchaseCost: asset?.purchaseCost?.toString() || '',
        warrantyExpiration: asset?.warrantyExpiration?.split('T')[0] || '',
        notes: asset?.notes || '',
    });

    useEffect(() => {
        if (!asset) {
            api.getNextHardwareTag().then(({ assetTag }) => setForm(f => ({ ...f, assetTag })));
        }
    }, [asset]);

    const set = (k: string, v: string) => setForm({ ...form, [k]: v });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = { ...form };
        if (data.purchaseCost) data.purchaseCost = parseFloat(data.purchaseCost);
        else delete data.purchaseCost;
        if (data.purchaseDate) data.purchaseDate = new Date(data.purchaseDate).toISOString();
        else delete data.purchaseDate;
        if (data.warrantyExpiration) data.warrantyExpiration = new Date(data.warrantyExpiration).toISOString();
        else delete data.warrantyExpiration;
        if (!data.categoryId) data.categoryId = null;
        if (!data.assignedToId) data.assignedToId = null;
        if (!data.locationId) data.locationId = null;
        onSave(data);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{asset ? 'Sửa Tài Sản' : 'Thêm Tài Sản Phần Cứng'}</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Tên tài sản *</label>
                                <input className="form-input" required value={form.name} onChange={(e) => set('name', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mã tài sản *</label>
                                <input className="form-input font-mono" required value={form.assetTag} onChange={(e) => set('assetTag', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Số serial</label>
                                <input className="form-input" value={form.serialNumber} onChange={(e) => set('serialNumber', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Model</label>
                                <input className="form-input" value={form.model} onChange={(e) => set('model', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Nhà sản xuất</label>
                                <input className="form-input" value={form.manufacturer} onChange={(e) => set('manufacturer', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Danh mục</label>
                                <select className="form-select" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                                    <option value="">— Chọn —</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Trạng thái</label>
                                <select className="form-select" value={form.status} onChange={(e) => set('status', e.target.value)}>
                                    <option value="active">Đang dùng</option>
                                    <option value="maintenance">Bảo trì</option>
                                    <option value="retired">Thanh lý</option>
                                    <option value="stored">Lưu kho</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Người dùng</label>
                                <select className="form-select" value={form.assignedToId} onChange={(e) => set('assignedToId', e.target.value)}>
                                    <option value="">— Không —</option>
                                    {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Vị trí</label>
                            <select className="form-select" value={form.locationId} onChange={(e) => set('locationId', e.target.value)}>
                                <option value="">— Chọn —</option>
                                {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Ngày mua</label>
                                <input className="form-input" type="date" value={form.purchaseDate} onChange={(e) => set('purchaseDate', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Giá mua (VNĐ)</label>
                                <input className="form-input" type="number" value={form.purchaseCost} onChange={(e) => set('purchaseCost', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Hạn bảo hành</label>
                            <input className="form-input" type="date" value={form.warrantyExpiration} onChange={(e) => set('warrantyExpiration', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ghi chú</label>
                            <textarea className="form-textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
                        <button type="submit" className="btn btn-primary">{asset ? 'Cập Nhật' : 'Thêm Tài Sản'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
