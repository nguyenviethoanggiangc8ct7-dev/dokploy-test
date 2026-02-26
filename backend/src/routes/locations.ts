import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const locationRoutes = Router();

// GET all locations
locationRoutes.get('/', async (_req: Request, res: Response) => {
    try {
        const locations = await prisma.location.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { hardwareAssets: true } }
            }
        });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy vị trí' });
    }
});

// GET location by id
locationRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const location = await prisma.location.findUnique({
            where: { id: req.params.id },
            include: { _count: { select: { hardwareAssets: true } } }
        });
        if (!location) { res.status(404).json({ error: 'Không tìm thấy vị trí' }); return; }
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy vị trí' });
    }
});

// POST create location
locationRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const location = await prisma.location.create({ data: req.body });
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo vị trí' });
    }
});

// PUT update location
locationRoutes.put('/:id', async (req: Request, res: Response) => {
    try {
        const location = await prisma.location.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật vị trí' });
    }
});

// DELETE location
locationRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const count = await prisma.hardwareAsset.count({ where: { locationId: req.params.id } });
        if (count > 0) {
            res.status(400).json({ error: 'Không thể xóa vị trí đang có tài sản' }); return;
        }
        await prisma.location.delete({ where: { id: req.params.id } });
        res.json({ message: 'Đã xóa vị trí' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa vị trí' });
    }
});
