import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Monitor, AppWindow, Wrench, AlertTriangle, TrendingUp, DollarSign, ShieldAlert, Clock } from 'lucide-react';
import { api } from '../services/api';
import type { DashboardData } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const COLORS = ['#4F46E5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#f97316'];

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
    if (!data) return <div className="empty-state"><h3>Không thể tải dữ liệu</h3></div>;

    const formatVND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

    return (
        <div>
            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon primary"><Monitor size={24} /></div>
                    <div className="kpi-content">
                        <h4>Tổng Tài Sản</h4>
                        <div className="kpi-value">{data.kpi.totalAssets}</div>
                        <div className="kpi-sub">{data.kpi.totalHardware} phần cứng · {data.kpi.totalSoftware} phần mềm</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon success"><TrendingUp size={24} /></div>
                    <div className="kpi-content">
                        <h4>Đang Dùng</h4>
                        <div className="kpi-value">{data.kpi.activeHardware}</div>
                        <div className="kpi-sub">Phần cứng hoạt động</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon warning"><Wrench size={24} /></div>
                    <div className="kpi-content">
                        <h4>Bảo Trì</h4>
                        <div className="kpi-value">{data.kpi.maintenanceHardware}</div>
                        <div className="kpi-sub">Đang sửa chữa / nâng cấp</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon danger"><AlertTriangle size={24} /></div>
                    <div className="kpi-content">
                        <h4>Cảnh Báo</h4>
                        <div className="kpi-value">{data.kpi.warrantyExpiring + data.kpi.licenseExpiring}</div>
                        <div className="kpi-sub">{data.kpi.warrantyExpiring} BH + {data.kpi.licenseExpiring} BQ sắp hết</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon info"><DollarSign size={24} /></div>
                    <div className="kpi-content">
                        <h4>Tổng Giá Trị</h4>
                        <div className="kpi-value" style={{ fontSize: '1.3rem' }}>{formatVND(data.kpi.totalValue)}</div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="chart-grid">
                <div className="chart-card">
                    <h3>Tài Sản Theo Loại</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={data.hardwareByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                {data.hardwareByCategory.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h3>Phân Bố Trạng Thái</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data.statusDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {data.statusDistribution.map((entry, i) => (
                                    <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444', '#06b6d4'][i]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <div className="card-header"><h3>Hoạt Động Gần Đây</h3></div>
                <div className="card-body">
                    {data.recentActivity.length === 0 ? (
                        <div className="empty-state"><p>Chưa có hoạt động</p></div>
                    ) : (
                        <div className="activity-list">
                            {data.recentActivity.map((a) => (
                                <div key={a.id} className="activity-item">
                                    <div className={`activity-dot ${a.type}`} />
                                    <span className="activity-text">
                                        <strong>{a.name}</strong>
                                        {a.assetTag && <span className="font-mono" style={{ marginLeft: 6, color: 'var(--accent-primary)' }}>{a.assetTag}</span>}
                                        {' — '}
                                        <span className={`badge badge-${a.status}`}>
                                            <span className="badge-dot" />{a.status === 'active' ? 'Đang dùng' : a.status === 'maintenance' ? 'Bảo trì' : a.status === 'retired' ? 'Thanh lý' : a.status}
                                        </span>
                                    </span>
                                    <span className="activity-time">
                                        {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true, locale: vi })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
