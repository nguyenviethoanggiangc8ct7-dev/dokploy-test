const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
}

export const api = {
    // Dashboard
    getDashboard: () => request<any>('/dashboard'),

    // Categories
    getCategories: () => request<any[]>('/categories'),
    createCategory: (data: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    updateCategory: (id: string, data: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCategory: (id: string) => request<any>(`/categories/${id}`, { method: 'DELETE' }),

    // Locations
    getLocations: () => request<any[]>('/locations'),
    createLocation: (data: any) => request<any>('/locations', { method: 'POST', body: JSON.stringify(data) }),
    updateLocation: (id: string, data: any) => request<any>(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteLocation: (id: string) => request<any>(`/locations/${id}`, { method: 'DELETE' }),

    // Employees
    getEmployees: () => request<any[]>('/employees'),
    createEmployee: (data: any) => request<any>('/employees', { method: 'POST', body: JSON.stringify(data) }),
    updateEmployee: (id: string, data: any) => request<any>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteEmployee: (id: string) => request<any>(`/employees/${id}`, { method: 'DELETE' }),

    // Hardware
    getHardware: (params?: Record<string, string>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return request<any[]>(`/hardware${query}`);
    },
    getNextHardwareTag: () => request<{ assetTag: string }>('/hardware/next-tag/generate'),
    createHardware: (data: any) => request<any>('/hardware', { method: 'POST', body: JSON.stringify(data) }),
    updateHardware: (id: string, data: any) => request<any>(`/hardware/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteHardware: (id: string) => request<any>(`/hardware/${id}`, { method: 'DELETE' }),

    // Software
    getSoftware: (params?: Record<string, string>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return request<any[]>(`/software${query}`);
    },
    createSoftware: (data: any) => request<any>('/software', { method: 'POST', body: JSON.stringify(data) }),
    updateSoftware: (id: string, data: any) => request<any>(`/software/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSoftware: (id: string) => request<any>(`/software/${id}`, { method: 'DELETE' }),

    // Reports
    getReports: () => request<any>('/reports'),
    exportHardwareCSV: () => `${API_BASE}/reports/export/hardware`,
    exportSoftwareCSV: () => `${API_BASE}/reports/export/software`,
};
