import { useState } from 'react';
import { Download, Upload, Trash2, Database, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { useUIStore } from '../stores/uiStore';

export default function Settings() {
    const { addToast } = useUIStore();
    const [confirmClear, setConfirmClear] = useState(false);

    return (
        <div>
            <div className="page-title-bar"><h2>Cài Đặt</h2></div>

            <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Export */}
                <div className="card">
                    <div className="card-header"><h3><Download size={18} style={{ marginRight: 8 }} /> Xuất Dữ Liệu</h3></div>
                    <div className="card-body">
                        <p className="text-muted mb-2">Xuất dữ liệu tài sản ra file CSV để lưu trữ hoặc xử lý.</p>
                        <div className="flex gap-2">
                            <a href={api.exportHardwareCSV()} className="btn btn-secondary"><Download size={16} /> Xuất Phần Cứng (CSV)</a>
                            <a href={api.exportSoftwareCSV()} className="btn btn-secondary"><Download size={16} /> Xuất Phần Mềm (CSV)</a>
                        </div>
                    </div>
                </div>

                {/* Database Info */}
                <div className="card">
                    <div className="card-header"><h3><Database size={18} style={{ marginRight: 8 }} /> Thông Tin Hệ Thống</h3></div>
                    <div className="card-body">
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr><td className="text-muted" style={{ padding: '8px 0' }}>Cơ sở dữ liệu</td><td>PostgreSQL 16</td></tr>
                                <tr><td className="text-muted" style={{ padding: '8px 0' }}>Backend</td><td>Express.js + Prisma ORM</td></tr>
                                <tr><td className="text-muted" style={{ padding: '8px 0' }}>Frontend</td><td>React 18 + TypeScript + Vite</td></tr>
                                <tr><td className="text-muted" style={{ padding: '8px 0' }}>Phiên bản</td><td>1.0.0</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* About */}
                <div className="card">
                    <div className="card-body text-center" style={{ padding: 40 }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>QLTSIT — Quản Lý Tài Sản IT</h3>
                        <p className="text-muted">Hệ thống quản lý tài sản CNTT chuyên nghiệp</p>
                        <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: 4 }}>© 2025 QLTSIT. Built with ❤️</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
