import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dashboardRoutes = Router();

// GET dashboard stats
dashboardRoutes.get('/', async (_req: Request, res: Response) => {
    try {
        // KPI counts
        const totalHardware = await prisma.hardwareAsset.count();
        const totalSoftware = await prisma.softwareAsset.count();
        const activeHardware = await prisma.hardwareAsset.count({ where: { status: 'active' } });
        const maintenanceHardware = await prisma.hardwareAsset.count({ where: { status: 'maintenance' } });
        const retiredHardware = await prisma.hardwareAsset.count({ where: { status: 'retired' } });
        const storedHardware = await prisma.hardwareAsset.count({ where: { status: 'stored' } });

        // Hardware by category
        const hwByCategory = await prisma.hardwareAsset.groupBy({
            by: ['categoryId'],
            _count: { id: true },
        });
        const categories = await prisma.category.findMany({ where: { type: 'hardware' } });
        const hardwareByCategory = hwByCategory.map(item => {
            const cat = categories.find(c => c.id === item.categoryId);
            return { name: cat?.name || 'Không phân loại', value: item._count.id };
        });

        // Software status
        const activeSoftware = await prisma.softwareAsset.count({ where: { status: 'active' } });
        const expiredSoftware = await prisma.softwareAsset.count({ where: { status: 'expired' } });

        // Total value
        const hwValueResult = await prisma.hardwareAsset.aggregate({ _sum: { purchaseCost: true } });
        const swValueResult = await prisma.softwareAsset.aggregate({ _sum: { purchaseCost: true } });
        const totalValue = (hwValueResult._sum.purchaseCost || 0) + (swValueResult._sum.purchaseCost || 0);

        // Recent assets (last 10)
        const recentHardware = await prisma.hardwareAsset.findMany({
            take: 5, orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, assetTag: true, status: true, createdAt: true },
        });
        const recentSoftware = await prisma.softwareAsset.findMany({
            take: 5, orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, status: true, createdAt: true },
        });

        // Warranty expiring soon (next 90 days)
        const now = new Date();
        const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        const warrantyExpiring = await prisma.hardwareAsset.count({
            where: {
                warrantyExpiration: { gte: now, lte: in90Days },
                status: { not: 'retired' },
            },
        });

        // License expiring soon (next 90 days)
        const licenseExpiring = await prisma.softwareAsset.count({
            where: {
                expirationDate: { gte: now, lte: in90Days },
                status: 'active',
            },
        });

        res.json({
            kpi: {
                totalAssets: totalHardware + totalSoftware,
                totalHardware,
                totalSoftware,
                activeHardware,
                maintenanceHardware,
                retiredHardware,
                storedHardware,
                activeSoftware,
                expiredSoftware,
                totalValue,
                warrantyExpiring,
                licenseExpiring,
            },
            hardwareByCategory,
            statusDistribution: [
                { name: 'Đang dùng', value: activeHardware },
                { name: 'Bảo trì', value: maintenanceHardware },
                { name: 'Thanh lý', value: retiredHardware },
                { name: 'Lưu kho', value: storedHardware },
            ],
            recentActivity: [
                ...recentHardware.map(a => ({ ...a, type: 'hardware' as const })),
                ...recentSoftware.map(a => ({ ...a, type: 'software' as const, assetTag: undefined })),
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10),
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thống kê dashboard' });
    }
});
