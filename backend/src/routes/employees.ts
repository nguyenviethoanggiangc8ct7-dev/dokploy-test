import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const employeeRoutes = Router();

// GET all employees
employeeRoutes.get('/', async (_req: Request, res: Response) => {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { hardwareAssets: true } }
            }
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy nhân viên' });
    }
});

// POST create employee
employeeRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const employee = await prisma.employee.create({ data: req.body });
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo nhân viên' });
    }
});

// PUT update employee
employeeRoutes.put('/:id', async (req: Request, res: Response) => {
    try {
        const employee = await prisma.employee.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật nhân viên' });
    }
});

// DELETE employee
employeeRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const count = await prisma.hardwareAsset.count({ where: { assignedToId: req.params.id } });
        if (count > 0) {
            return res.status(400).json({ error: 'Không thể xóa nhân viên đang có tài sản' });
        }
        await prisma.employee.delete({ where: { id: req.params.id } });
        res.json({ message: 'Đã xóa nhân viên' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa nhân viên' });
    }
});
