import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const hardwareRoutes = Router();

// GET all hardware assets with filters
hardwareRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const { search, status, categoryId, locationId } = req.query;
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { assetTag: { contains: search as string, mode: 'insensitive' } },
                { serialNumber: { contains: search as string, mode: 'insensitive' } },
                { model: { contains: search as string, mode: 'insensitive' } },
                { manufacturer: { contains: search as string, mode: 'insensitive' } },
            ];
        }
        if (status) where.status = status;
        if (categoryId) where.categoryId = categoryId;
        if (locationId) where.locationId = locationId;

        const assets = await prisma.hardwareAsset.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                location: true,
                assignedTo: true,
            },
        });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy tài sản phần cứng' });
    }
});

// GET hardware by id
hardwareRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const asset = await prisma.hardwareAsset.findUnique({
            where: { id: req.params.id },
            include: { category: true, location: true, assignedTo: true },
        });
        if (!asset) return res.status(404).json({ error: 'Không tìm thấy tài sản' });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy tài sản' });
    }
});

// GET next asset tag
hardwareRoutes.get('/next-tag/generate', async (_req: Request, res: Response) => {
    try {
        const lastAsset = await prisma.hardwareAsset.findFirst({
            orderBy: { assetTag: 'desc' },
            select: { assetTag: true },
        });
        let nextNum = 1;
        if (lastAsset) {
            const match = lastAsset.assetTag.match(/HW-(\d+)/);
            if (match) nextNum = parseInt(match[1]) + 1;
        }
        res.json({ assetTag: `HW-${String(nextNum).padStart(3, '0')}` });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi sinh mã tài sản' });
    }
});

// POST create hardware
hardwareRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const asset = await prisma.hardwareAsset.create({
            data: req.body,
            include: { category: true, location: true, assignedTo: true },
        });
        res.status(201).json(asset);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Mã tài sản đã tồn tại' });
        }
        res.status(500).json({ error: 'Lỗi khi tạo tài sản phần cứng' });
    }
});

// PUT update hardware
hardwareRoutes.put('/:id', async (req: Request, res: Response) => {
    try {
        const asset = await prisma.hardwareAsset.update({
            where: { id: req.params.id },
            data: req.body,
            include: { category: true, location: true, assignedTo: true },
        });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật tài sản' });
    }
});

// DELETE hardware
hardwareRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        await prisma.hardwareAsset.delete({ where: { id: req.params.id } });
        res.json({ message: 'Đã xóa tài sản phần cứng' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa tài sản' });
    }
});
