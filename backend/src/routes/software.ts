import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const softwareRoutes = Router();

// GET all software assets with filters
softwareRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const { search, status, licenseType, categoryId } = req.query;
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { vendor: { contains: search as string, mode: 'insensitive' } },
                { licenseKey: { contains: search as string, mode: 'insensitive' } },
                { version: { contains: search as string, mode: 'insensitive' } },
            ];
        }
        if (status) where.status = status;
        if (licenseType) where.licenseType = licenseType;
        if (categoryId) where.categoryId = categoryId;

        const assets = await prisma.softwareAsset.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy tài sản phần mềm' });
    }
});

// GET software by id
softwareRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const asset = await prisma.softwareAsset.findUnique({
            where: { id: req.params.id },
            include: { category: true },
        });
        if (!asset) return res.status(404).json({ error: 'Không tìm thấy bản quyền' });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy bản quyền' });
    }
});

// POST create software
softwareRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const asset = await prisma.softwareAsset.create({
            data: req.body,
            include: { category: true },
        });
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo bản quyền phần mềm' });
    }
});

// PUT update software
softwareRoutes.put('/:id', async (req: Request, res: Response) => {
    try {
        const asset = await prisma.softwareAsset.update({
            where: { id: req.params.id },
            data: req.body,
            include: { category: true },
        });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật bản quyền' });
    }
});

// DELETE software
softwareRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        await prisma.softwareAsset.delete({ where: { id: req.params.id } });
        res.json({ message: 'Đã xóa bản quyền phần mềm' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa bản quyền' });
    }
});
