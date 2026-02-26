import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const reportRoutes = Router();

// GET reports list
reportRoutes.get('/', async (_req: Request, res: Response) => {
    try {
        // Assets by status
        const byStatus = await prisma.hardwareAsset.groupBy({
            by: ['status'],
            _count: { id: true },
            _sum: { purchaseCost: true },
        });

        // Assets by category
        const hwByCategory = await prisma.hardwareAsset.groupBy({
            by: ['categoryId'],
            _count: { id: true },
            _sum: { purchaseCost: true },
        });
        const categories = await prisma.category.findMany();
        const byCategory = hwByCategory.map(item => {
            const cat = categories.find(c => c.id === item.categoryId);
            return { name: cat?.name || 'Không phân loại', count: item._count.id, value: item._sum.purchaseCost || 0 };
        });

        // Assets by location
        const byLocation = await prisma.hardwareAsset.groupBy({
            by: ['locationId'],
            _count: { id: true },
        });
        const locations = await prisma.location.findMany();
        const assetsByLocation = byLocation.map(item => {
            const loc = locations.find(l => l.id === item.locationId);
            return { name: loc?.name || 'Không xác định', count: item._count.id };
        });

        // License compliance
        const softwareAssets = await prisma.softwareAsset.findMany({
            select: {
                id: true, name: true, seatsTotal: true, seatsUsed: true,
                status: true, expirationDate: true, licenseType: true,
            },
        });
        const licenseCompliance = softwareAssets.map(sw => ({
            ...sw,
            compliance: sw.seatsUsed <= sw.seatsTotal ? 'Tuân thủ' : 'Vi phạm',
            usagePercent: sw.seatsTotal > 0 ? Math.round((sw.seatsUsed / sw.seatsTotal) * 100) : 0,
        }));

        // Warranty expiring
        const now = new Date();
        const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        const warrantyExpiring = await prisma.hardwareAsset.findMany({
            where: {
                warrantyExpiration: { gte: now, lte: in90Days },
                status: { not: 'retired' },
            },
            include: { category: true, location: true },
            orderBy: { warrantyExpiration: 'asc' },
        });

        res.json({
            byStatus: byStatus.map(s => ({
                status: s.status,
                count: s._count.id,
                totalValue: s._sum.purchaseCost || 0,
            })),
            byCategory,
            byLocation: assetsByLocation,
            licenseCompliance,
            warrantyExpiring,
        });
    } catch (error) {
        console.error('Reports error:', error);
        res.status(500).json({ error: 'Lỗi khi tạo báo cáo' });
    }
});

// GET CSV export for hardware
reportRoutes.get('/export/hardware', async (_req: Request, res: Response) => {
    try {
        const assets = await prisma.hardwareAsset.findMany({
            include: { category: true, location: true, assignedTo: true },
            orderBy: { assetTag: 'asc' },
        });

        const header = 'Mã TS,Tên,Serial,Model,Nhà SX,Danh Mục,Trạng Thái,Người Dùng,Vị Trí,Ngày Mua,Giá Mua,Hạn BH\n';
        const rows = assets.map(a =>
            `${a.assetTag},"${a.name}",${a.serialNumber || ''},${a.model || ''},${a.manufacturer || ''},${a.category?.name || ''},${a.status},${a.assignedTo?.name || ''},${a.location?.name || ''},${a.purchaseDate?.toISOString().split('T')[0] || ''},${a.purchaseCost || ''},${a.warrantyExpiration?.toISOString().split('T')[0] || ''}`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=hardware_assets.csv');
        res.send('\uFEFF' + header + rows);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xuất CSV phần cứng' });
    }
});

// GET CSV export for software
reportRoutes.get('/export/software', async (_req: Request, res: Response) => {
    try {
        const assets = await prisma.softwareAsset.findMany({
            include: { category: true },
            orderBy: { name: 'asc' },
        });

        const header = 'Tên,Phiên Bản,Mã BQ,Loại BQ,Tổng Ghế,Đã Dùng,NCC,Danh Mục,Ngày Mua,Giá Mua,Hết Hạn,Trạng Thái\n';
        const rows = assets.map(a =>
            `"${a.name}",${a.version || ''},${a.licenseKey || ''},${a.licenseType},${a.seatsTotal},${a.seatsUsed},${a.vendor || ''},${a.category?.name || ''},${a.purchaseDate?.toISOString().split('T')[0] || ''},${a.purchaseCost || ''},${a.expirationDate?.toISOString().split('T')[0] || ''},${a.status}`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=software_assets.csv');
        res.send('\uFEFF' + header + rows);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xuất CSV phần mềm' });
    }
});
