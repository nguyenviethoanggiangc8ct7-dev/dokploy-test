// === ENUMS ===
export type CategoryType = 'hardware' | 'software';
export type AssetStatus = 'active' | 'maintenance' | 'retired' | 'stored';
export type LicenseType = 'perpetual' | 'subscription' | 'volume' | 'oem';
export type SoftwareStatus = 'active' | 'expired' | 'suspended';

// === MODELS ===
export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    description?: string;
    createdAt: string;
    _count?: {
        hardwareAssets: number;
        softwareAssets: number;
    };
}

export interface Location {
    id: string;
    name: string;
    address?: string;
    building?: string;
    description?: string;
    createdAt: string;
    _count?: {
        hardwareAssets: number;
    };
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    department?: string;
    position?: string;
    createdAt: string;
    _count?: {
        hardwareAssets: number;
    };
}

export interface HardwareAsset {
    id: string;
    name: string;
    assetTag: string;
    serialNumber?: string;
    model?: string;
    manufacturer?: string;
    categoryId?: string;
    category?: Category;
    status: AssetStatus;
    assignedToId?: string;
    assignedTo?: Employee;
    locationId?: string;
    location?: Location;
    purchaseDate?: string;
    purchaseCost?: number;
    warrantyExpiration?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SoftwareAsset {
    id: string;
    name: string;
    version?: string;
    licenseKey?: string;
    licenseType: LicenseType;
    seatsTotal: number;
    seatsUsed: number;
    vendor?: string;
    categoryId?: string;
    category?: Category;
    purchaseDate?: string;
    purchaseCost?: number;
    expirationDate?: string;
    status: SoftwareStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// === DASHBOARD ===
export interface DashboardData {
    kpi: {
        totalAssets: number;
        totalHardware: number;
        totalSoftware: number;
        activeHardware: number;
        maintenanceHardware: number;
        retiredHardware: number;
        storedHardware: number;
        activeSoftware: number;
        expiredSoftware: number;
        totalValue: number;
        warrantyExpiring: number;
        licenseExpiring: number;
    };
    hardwareByCategory: { name: string; value: number }[];
    statusDistribution: { name: string; value: number }[];
    recentActivity: {
        id: string;
        name: string;
        assetTag?: string;
        status: string;
        type: 'hardware' | 'software';
        createdAt: string;
    }[];
}

// === REPORTS ===
export interface ReportData {
    byStatus: { status: string; count: number; totalValue: number }[];
    byCategory: { name: string; count: number; value: number }[];
    byLocation: { name: string; count: number }[];
    licenseCompliance: {
        id: string;
        name: string;
        seatsTotal: number;
        seatsUsed: number;
        status: string;
        expirationDate?: string;
        licenseType: string;
        compliance: string;
        usagePercent: number;
    }[];
    warrantyExpiring: HardwareAsset[];
}

// === LABELS ===
export const STATUS_LABELS: Record<AssetStatus, string> = {
    active: 'Đang dùng',
    maintenance: 'Bảo trì',
    retired: 'Thanh lý',
    stored: 'Lưu kho',
};

export const LICENSE_TYPE_LABELS: Record<LicenseType, string> = {
    perpetual: 'Vĩnh viễn',
    subscription: 'Đăng ký',
    volume: 'Số lượng',
    oem: 'OEM',
};

export const SOFTWARE_STATUS_LABELS: Record<SoftwareStatus, string> = {
    active: 'Đang dùng',
    expired: 'Hết hạn',
    suspended: 'Tạm ngưng',
};
