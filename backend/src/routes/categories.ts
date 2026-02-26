import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const categoryRoutes = Router();

// GET all categories
categoryRoutes.get('/', async (_req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { hardwareAssets: true, softwareAssets: true } }
            }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh mục' });
    }
});

// GET category by id
categoryRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: req.params.id },
            include: {
                _count: { select: { hardwareAssets: true, softwareAssets: true } }
            }
        });
        if (!category) { res.status(404).json({ error: 'Không tìm thấy danh mục' }); return; }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh mục' });
    }
});

// POST create category
categoryRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const category = await prisma.category.create({ data: req.body });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo danh mục' });
    }
});

// PUT update category
categoryRoutes.put('/:id', async (req: Request, res: Response) => {
    try {
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật danh mục' });
    }
});

// DELETE category
categoryRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const count = await prisma.hardwareAsset.count({ where: { categoryId: req.params.id } });
        const swCount = await prisma.softwareAsset.count({ where: { categoryId: req.params.id } });
        if (count > 0 || swCount > 0) {
            res.status(400).json({ error: 'Không thể xóa danh mục đang có tài sản' }); return;
        }
        await prisma.category.delete({ where: { id: req.params.id } });
        res.json({ message: 'Đã xóa danh mục' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa danh mục' });
    }
});
