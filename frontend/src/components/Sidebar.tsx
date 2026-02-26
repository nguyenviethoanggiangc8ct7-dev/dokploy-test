import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Monitor, AppWindow, FolderOpen, MapPin,
    FileBarChart, Settings, Server, X
} from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

const navItems = [
    { label: 'Tổng Quan', path: '/', icon: LayoutDashboard },
];

const manageItems = [
    { label: 'Phần Cứng', path: '/hardware', icon: Monitor },
    { label: 'Phần Mềm', path: '/software', icon: AppWindow },
    { label: 'Danh Mục', path: '/categories', icon: FolderOpen },
    { label: 'Vị Trí', path: '/locations', icon: MapPin },
];

const toolItems = [
    { label: 'Báo Cáo', path: '/reports', icon: FileBarChart },
    { label: 'Cài Đặt', path: '/settings', icon: Settings },
];

export default function Sidebar() {
    const { sidebarOpen, closeSidebar } = useUIStore();
    const location = useLocation();

    return (
        <>
            {sidebarOpen && <div className="modal-overlay" style={{ zIndex: 99 }} onClick={closeSidebar} />}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-icon"><Server size={20} /></div>
                    <h1>QLTSIT</h1>
                    <button className="modal-close" onClick={closeSidebar} style={{ marginLeft: 'auto', display: sidebarOpen ? 'block' : 'none' }}>
                        <X size={18} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Tổng quan</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="sidebar-section-label">Quản Lý</div>
                    {manageItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="sidebar-section-label">Công Cụ</div>
                    {toolItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}
