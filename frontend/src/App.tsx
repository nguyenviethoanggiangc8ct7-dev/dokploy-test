import { Routes, Route, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import { useUIStore } from './stores/uiStore';
import Dashboard from './pages/Dashboard';
import HardwareAssets from './pages/HardwareAssets';
import SoftwareAssets from './pages/SoftwareAssets';
import Categories from './pages/Categories';
import Locations from './pages/Locations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const pageTitles: Record<string, string> = {
    '/': 'Bảng Điều Khiển',
    '/hardware': 'Tài Sản Phần Cứng',
    '/software': 'Tài Sản Phần Mềm',
    '/categories': 'Danh Mục',
    '/locations': 'Vị Trí',
    '/reports': 'Báo Cáo',
    '/settings': 'Cài Đặt',
};

export default function App() {
    const { toggleSidebar } = useUIStore();
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'QLTSIT';

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <header className="main-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="menu-toggle" onClick={toggleSidebar}><Menu size={22} /></button>
                        <h1 className="header-title">{title}</h1>
                    </div>
                </header>
                <main className="page-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/hardware" element={<HardwareAssets />} />
                        <Route path="/software" element={<SoftwareAssets />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/locations" element={<Locations />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
            <Toast />
        </div>
    );
}
