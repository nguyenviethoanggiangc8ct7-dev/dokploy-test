import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, ShieldCheck, AlertTriangle, FileBarChart } from 'lucide-react';
import { api } from '../services/api';
import type { ReportData } from '../types';

const COLORS = ['#4F46E5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'];

export default function Reports() {
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getReports().then(setData).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
    if (!data) return <div className="empty-state"><FileBarChart /><h3>Không thể tải báo cáo</h3></div>;

    const formatVND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
    const statusName: Record<string, string> = { active: 'Đang dùng', maintenance: 'Bảo trì', retired: 'Thanh lý', stored: 'Lưu kho' };

    return (
        <div>
            <div className="page-title-bar">
                <h2>Báo Cáo</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    <a href={api.exportHardwareCSV()} className="btn btn-secondary btn-sm"><Download size={16} /> Phần Cứng CSV</a>
                    <a href={api.exportSoftwareCSV()} className="btn btn-secondary btn-sm"><Download size={16} /> Phần Mềm CSV</a>
                </div>
            </div>

            {/* Charts Row */}
            <div className="chart-grid">
                <div className="chart-card">
                    <h3>Tài Sản Theo Trạng Thái</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data.byStatus.map(s => ({ ...s, name: statusName[s.status] || s.status }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v: any) => [v, 'Số lượng']} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                {data.byStatus.map((_, i) => <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444', '#06b6d4'][i]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h3>Tài Sản Theo Danh Mục</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={data.byCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="count" label={({ name, count }) => `${name}: ${count}`}>
                                {data.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Asset Value by Status */}
            <div className="card mb-3">
                <div className="card-header"><h3>Giá Trị Theo Trạng Thái</h3></div>
                <div className="card-body">
                    <table className="data-table">
                        <thead><tr><th>Trạng Thái</th><th>Số Lượng</th><th className="text-right">Tổng Giá Trị</th></tr></thead>
                        <tbody>
                            {data.byStatus.map(s => (
                                <tr key={s.status}>
                                    <td><span className={`badge badge-${s.status}`}><span className="badge-dot" />{statusName[s.status] || s.status}</span></td>
                                    <td>{s.count}</td>
                                    <td className="text-right">{formatVND(s.totalValue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* License Compliance */}
            <div className="card mb-3">
                <div className="card-header"><h3><ShieldCheck size={18} style={{ marginRight: 8 }} /> Tuân Thủ Bản Quyền</h3></div>
                <div className="card-body">
                    <table className="data-table">
                        <thead><tr><th>Phần Mềm</th><th>Loại BQ</th><th>Sử Dụng</th><th>Trạng Thái</th><th>Tuân Thủ</th></tr></thead>
                        <tbody>
                            {data.licenseCompliance.map(sw => (
                                <tr key={sw.id}>
                                    <td><strong>{sw.name}</strong></td>
                                    <td>{sw.licenseType}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ flex: 1, height: 6, background: 'var(--bg-hover)', borderRadius: 3, overflow: 'hidden', maxWidth: 100 }}>
                                                <div style={{ width: `${Math.min(sw.usagePercent, 100)}%`, height: '100%', background: sw.usagePercent > 90 ? 'var(--accent-danger)' : 'var(--accent-success)', borderRadius: 3 }} />
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.78rem' }}>{sw.seatsUsed}/{sw.seatsTotal} ({sw.usagePercent}%)</span>
                                        </div>
                                    </td>
                                    <td><span className={`badge badge-${sw.status}`}>{sw.status === 'active' ? 'Đang dùng' : 'Hết hạn'}</span></td>
                                    <td><span className={`badge ${sw.compliance === 'Tuân thủ' ? 'badge-active' : 'badge-retired'}`}>{sw.compliance}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Warranty Expiring */}
            {data.warrantyExpiring.length > 0 && (
                <div className="card">
                    <div className="card-header"><h3><AlertTriangle size={18} style={{ marginRight: 8, color: 'var(--accent-warning)' }} /> Bảo Hành Sắp Hết (90 ngày)</h3></div>
                    <div className="card-body">
                        <table className="data-table">
                            <thead><tr><th>Mã TS</th><th>Tên</th><th>Danh Mục</th><th>Hạn BH</th></tr></thead>
                            <tbody>
                                {data.warrantyExpiring.map(a => (
                                    <tr key={a.id}>
                                        <td><span className="asset-tag">{a.assetTag}</span></td>
                                        <td>{a.name}</td>
                                        <td>{a.category?.name || '—'}</td>
                                        <td className="text-warning">{a.warrantyExpiration ? new Date(a.warrantyExpiration).toLocaleDateString('vi-VN') : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* By Location */}
            <div className="card mt-3">
                <div className="card-header"><h3>Tài Sản Theo Vị Trí</h3></div>
                <div className="card-body">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.byLocation} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={180} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4F46E5" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
