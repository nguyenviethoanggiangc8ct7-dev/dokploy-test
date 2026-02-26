import { PrismaClient, CategoryType, AssetStatus, LicenseType, SoftwareStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.hardwareAsset.deleteMany();
    await prisma.softwareAsset.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.location.deleteMany();
    await prisma.category.deleteMany();

    // Categories - Hardware
    const catLaptop = await prisma.category.create({ data: { name: 'Laptop', type: CategoryType.hardware, description: 'Máy tính xách tay' } });
    const catDesktop = await prisma.category.create({ data: { name: 'Desktop', type: CategoryType.hardware, description: 'Máy tính để bàn' } });
    const catServer = await prisma.category.create({ data: { name: 'Server', type: CategoryType.hardware, description: 'Máy chủ' } });
    const catMonitor = await prisma.category.create({ data: { name: 'Màn hình', type: CategoryType.hardware, description: 'Màn hình máy tính' } });
    const catPrinter = await prisma.category.create({ data: { name: 'Máy in', type: CategoryType.hardware, description: 'Máy in laser/phun' } });
    const catNetwork = await prisma.category.create({ data: { name: 'Thiết bị mạng', type: CategoryType.hardware, description: 'Router, Switch, Access Point' } });
    const catPhone = await prisma.category.create({ data: { name: 'Điện thoại', type: CategoryType.hardware, description: 'Điện thoại IP/di động' } });
    const catTablet = await prisma.category.create({ data: { name: 'Tablet', type: CategoryType.hardware, description: 'Máy tính bảng' } });

    // Categories - Software
    const catOS = await prisma.category.create({ data: { name: 'Hệ điều hành', type: CategoryType.software, description: 'Windows, macOS, Linux' } });
    const catOffice = await prisma.category.create({ data: { name: 'Ứng dụng văn phòng', type: CategoryType.software, description: 'Office, Google Workspace' } });
    const catSecurity = await prisma.category.create({ data: { name: 'Bảo mật', type: CategoryType.software, description: 'Antivirus, Firewall' } });
    const catDatabase = await prisma.category.create({ data: { name: 'Cơ sở dữ liệu', type: CategoryType.software, description: 'SQL Server, PostgreSQL, Oracle' } });
    const catDesign = await prisma.category.create({ data: { name: 'Thiết kế', type: CategoryType.software, description: 'Adobe, Figma' } });

    // Locations
    const loc1 = await prisma.location.create({ data: { name: 'Văn phòng HCM - Tầng 3', address: '123 Nguyễn Huệ, Q1, HCM', building: 'Tòa nhà A' } });
    const loc2 = await prisma.location.create({ data: { name: 'Văn phòng HCM - Tầng 5', address: '123 Nguyễn Huệ, Q1, HCM', building: 'Tòa nhà A' } });
    const loc3 = await prisma.location.create({ data: { name: 'Văn phòng Hà Nội', address: '456 Hoàn Kiếm, HN', building: 'Tòa nhà B' } });
    const loc4 = await prisma.location.create({ data: { name: 'Data Center', address: '789 Quận 7, HCM', building: 'DC-01', description: 'Trung tâm dữ liệu chính' } });
    const loc5 = await prisma.location.create({ data: { name: 'Kho lưu trữ', address: '123 Nguyễn Huệ, Q1, HCM', building: 'Tòa nhà A', description: 'Kho chứa thiết bị dự phòng' } });

    // Employees
    const emp1 = await prisma.employee.create({ data: { name: 'Nguyễn Văn An', email: 'an.nguyen@company.com', department: 'Phòng IT', position: 'IT Manager' } });
    const emp2 = await prisma.employee.create({ data: { name: 'Trần Thị Bình', email: 'binh.tran@company.com', department: 'Phòng Kinh doanh', position: 'Sales Manager' } });
    const emp3 = await prisma.employee.create({ data: { name: 'Lê Hoàng Cường', email: 'cuong.le@company.com', department: 'Phòng Kỹ thuật', position: 'Developer' } });
    const emp4 = await prisma.employee.create({ data: { name: 'Phạm Minh Đức', email: 'duc.pham@company.com', department: 'Phòng Marketing', position: 'Designer' } });
    const emp5 = await prisma.employee.create({ data: { name: 'Hoàng Thu Hà', email: 'ha.hoang@company.com', department: 'Phòng Nhân sự', position: 'HR Manager' } });
    const emp6 = await prisma.employee.create({ data: { name: 'Võ Quang Huy', email: 'huy.vo@company.com', department: 'Phòng IT', position: 'System Admin' } });
    const emp7 = await prisma.employee.create({ data: { name: 'Đặng Thanh Mai', email: 'mai.dang@company.com', department: 'Phòng Kế toán', position: 'Accountant' } });
    const emp8 = await prisma.employee.create({ data: { name: 'Bùi Văn Nam', email: 'nam.bui@company.com', department: 'Phòng Kỹ thuật', position: 'DevOps Engineer' } });

    // Hardware Assets
    const hardwareAssets = [
        { name: 'Dell XPS 15 9530', assetTag: 'HW-001', serialNumber: 'DL-XPS-2024-001', model: 'XPS 15 9530', manufacturer: 'Dell', categoryId: catLaptop.id, status: AssetStatus.active, assignedToId: emp1.id, locationId: loc1.id, purchaseDate: new Date('2024-01-15'), purchaseCost: 42000000, warrantyExpiration: new Date('2027-01-15'), notes: 'Core i7, 16GB RAM, 512GB SSD' },
        { name: 'MacBook Pro 14" M3', assetTag: 'HW-002', serialNumber: 'AP-MBP-2024-001', model: 'MacBook Pro 14 M3', manufacturer: 'Apple', categoryId: catLaptop.id, status: AssetStatus.active, assignedToId: emp3.id, locationId: loc1.id, purchaseDate: new Date('2024-03-20'), purchaseCost: 55000000, warrantyExpiration: new Date('2027-03-20'), notes: 'M3 Pro, 18GB RAM, 512GB SSD' },
        { name: 'ThinkPad X1 Carbon Gen 11', assetTag: 'HW-003', serialNumber: 'LN-X1C-2024-001', model: 'X1 Carbon Gen 11', manufacturer: 'Lenovo', categoryId: catLaptop.id, status: AssetStatus.active, assignedToId: emp2.id, locationId: loc2.id, purchaseDate: new Date('2024-02-10'), purchaseCost: 38000000, warrantyExpiration: new Date('2027-02-10') },
        { name: 'Dell OptiPlex 7010', assetTag: 'HW-004', serialNumber: 'DL-OPT-2023-001', model: 'OptiPlex 7010', manufacturer: 'Dell', categoryId: catDesktop.id, status: AssetStatus.active, assignedToId: emp7.id, locationId: loc2.id, purchaseDate: new Date('2023-06-15'), purchaseCost: 22000000, warrantyExpiration: new Date('2026-06-15') },
        { name: 'HP ProDesk 400 G9', assetTag: 'HW-005', serialNumber: 'HP-PD4-2023-001', model: 'ProDesk 400 G9', manufacturer: 'HP', categoryId: catDesktop.id, status: AssetStatus.maintenance, assignedToId: emp5.id, locationId: loc3.id, purchaseDate: new Date('2023-08-01'), purchaseCost: 18000000, warrantyExpiration: new Date('2026-08-01'), notes: 'Đang thay ổ cứng' },
        { name: 'Dell PowerEdge R750', assetTag: 'HW-006', serialNumber: 'DL-PE-2023-001', model: 'PowerEdge R750', manufacturer: 'Dell', categoryId: catServer.id, status: AssetStatus.active, locationId: loc4.id, purchaseDate: new Date('2023-01-20'), purchaseCost: 150000000, warrantyExpiration: new Date('2028-01-20'), notes: 'Database Server chính' },
        { name: 'HP ProLiant DL380 Gen10', assetTag: 'HW-007', serialNumber: 'HP-DL3-2022-001', model: 'ProLiant DL380 Gen10', manufacturer: 'HP', categoryId: catServer.id, status: AssetStatus.active, locationId: loc4.id, purchaseDate: new Date('2022-06-10'), purchaseCost: 120000000, warrantyExpiration: new Date('2027-06-10'), notes: 'Application Server' },
        { name: 'Dell UltraSharp U2723QE', assetTag: 'HW-008', serialNumber: 'DL-MON-2024-001', model: 'U2723QE', manufacturer: 'Dell', categoryId: catMonitor.id, status: AssetStatus.active, assignedToId: emp4.id, locationId: loc1.id, purchaseDate: new Date('2024-01-15'), purchaseCost: 14000000, warrantyExpiration: new Date('2027-01-15') },
        { name: 'LG 27UK850-W', assetTag: 'HW-009', serialNumber: 'LG-MON-2023-001', model: '27UK850-W', manufacturer: 'LG', categoryId: catMonitor.id, status: AssetStatus.active, assignedToId: emp3.id, locationId: loc1.id, purchaseDate: new Date('2023-09-05'), purchaseCost: 11000000, warrantyExpiration: new Date('2026-09-05') },
        { name: 'HP LaserJet Pro M404dn', assetTag: 'HW-010', serialNumber: 'HP-LJ-2023-001', model: 'LaserJet Pro M404dn', manufacturer: 'HP', categoryId: catPrinter.id, status: AssetStatus.active, locationId: loc1.id, purchaseDate: new Date('2023-04-20'), purchaseCost: 8500000, warrantyExpiration: new Date('2025-04-20'), notes: 'Máy in chung tầng 3' },
        { name: 'Canon imageCLASS MF269dw', assetTag: 'HW-011', serialNumber: 'CN-IC-2023-001', model: 'imageCLASS MF269dw', manufacturer: 'Canon', categoryId: catPrinter.id, status: AssetStatus.retired, locationId: loc5.id, purchaseDate: new Date('2020-03-10'), purchaseCost: 7000000, warrantyExpiration: new Date('2023-03-10'), notes: 'Đã thanh lý - hỏng bộ sấy' },
        { name: 'Cisco Catalyst 2960-X', assetTag: 'HW-012', serialNumber: 'CS-SW-2023-001', model: 'Catalyst 2960-X', manufacturer: 'Cisco', categoryId: catNetwork.id, status: AssetStatus.active, locationId: loc4.id, purchaseDate: new Date('2023-01-20'), purchaseCost: 35000000, warrantyExpiration: new Date('2028-01-20'), notes: 'Core Switch' },
        { name: 'Ubiquiti UniFi AP AC Pro', assetTag: 'HW-013', serialNumber: 'UB-AP-2024-001', model: 'UniFi AP AC Pro', manufacturer: 'Ubiquiti', categoryId: catNetwork.id, status: AssetStatus.active, locationId: loc1.id, purchaseDate: new Date('2024-05-10'), purchaseCost: 5000000, warrantyExpiration: new Date('2026-05-10') },
        { name: 'iPad Pro 12.9" M2', assetTag: 'HW-014', serialNumber: 'AP-IPD-2024-001', model: 'iPad Pro 12.9 M2', manufacturer: 'Apple', categoryId: catTablet.id, status: AssetStatus.active, assignedToId: emp4.id, locationId: loc1.id, purchaseDate: new Date('2024-04-01'), purchaseCost: 32000000, warrantyExpiration: new Date('2026-04-01') },
        { name: 'Cisco IP Phone 8845', assetTag: 'HW-015', serialNumber: 'CS-PH-2023-001', model: 'IP Phone 8845', manufacturer: 'Cisco', categoryId: catPhone.id, status: AssetStatus.stored, locationId: loc5.id, purchaseDate: new Date('2023-07-15'), purchaseCost: 8000000, warrantyExpiration: new Date('2026-07-15'), notes: 'Dự phòng - chưa triển khai' },
        { name: 'Dell Latitude 5540', assetTag: 'HW-016', serialNumber: 'DL-LAT-2024-001', model: 'Latitude 5540', manufacturer: 'Dell', categoryId: catLaptop.id, status: AssetStatus.active, assignedToId: emp6.id, locationId: loc1.id, purchaseDate: new Date('2024-06-01'), purchaseCost: 28000000, warrantyExpiration: new Date('2027-06-01') },
        { name: 'HP EliteBook 840 G10', assetTag: 'HW-017', serialNumber: 'HP-EB-2024-001', model: 'EliteBook 840 G10', manufacturer: 'HP', categoryId: catLaptop.id, status: AssetStatus.maintenance, assignedToId: emp8.id, locationId: loc3.id, purchaseDate: new Date('2024-02-15'), purchaseCost: 32000000, warrantyExpiration: new Date('2027-02-15'), notes: 'Đang sửa bàn phím' },
        { name: 'Dell PowerEdge T550', assetTag: 'HW-018', serialNumber: 'DL-PE-2024-001', model: 'PowerEdge T550', manufacturer: 'Dell', categoryId: catServer.id, status: AssetStatus.active, locationId: loc4.id, purchaseDate: new Date('2024-03-01'), purchaseCost: 95000000, warrantyExpiration: new Date('2029-03-01'), notes: 'Backup/DR Server' },
    ];

    for (const asset of hardwareAssets) {
        await prisma.hardwareAsset.create({ data: asset });
    }

    // Software Assets
    const softwareAssets = [
        { name: 'Microsoft 365 Business', version: 'E3', licenseKey: 'MS365-BIZ-2024-001', licenseType: LicenseType.subscription, seatsTotal: 50, seatsUsed: 42, vendor: 'Microsoft', categoryId: catOffice.id, purchaseDate: new Date('2024-01-01'), purchaseCost: 180000000, expirationDate: new Date('2025-01-01'), status: SoftwareStatus.active },
        { name: 'Windows 11 Pro', version: '23H2', licenseKey: 'WIN11-PRO-VOL-001', licenseType: LicenseType.volume, seatsTotal: 60, seatsUsed: 45, vendor: 'Microsoft', categoryId: catOS.id, purchaseDate: new Date('2023-06-15'), purchaseCost: 150000000, status: SoftwareStatus.active },
        { name: 'Adobe Creative Cloud', version: '2024', licenseKey: 'ADOBE-CC-2024-001', licenseType: LicenseType.subscription, seatsTotal: 5, seatsUsed: 4, vendor: 'Adobe', categoryId: catDesign.id, purchaseDate: new Date('2024-03-01'), purchaseCost: 45000000, expirationDate: new Date('2025-03-01'), status: SoftwareStatus.active },
        { name: 'Kaspersky Endpoint Security', version: '12.0', licenseKey: 'KES-2024-001', licenseType: LicenseType.subscription, seatsTotal: 60, seatsUsed: 52, vendor: 'Kaspersky', categoryId: catSecurity.id, purchaseDate: new Date('2024-02-01'), purchaseCost: 60000000, expirationDate: new Date('2025-02-01'), status: SoftwareStatus.active, notes: 'Bao gồm server + endpoint' },
        { name: 'SQL Server 2022 Standard', version: '2022', licenseKey: 'MSSQL-STD-2023-001', licenseType: LicenseType.perpetual, seatsTotal: 2, seatsUsed: 2, vendor: 'Microsoft', categoryId: catDatabase.id, purchaseDate: new Date('2023-01-20'), purchaseCost: 85000000, status: SoftwareStatus.active },
        { name: 'VMware vSphere', version: '8.0', licenseKey: 'VMW-VS8-2023-001', licenseType: LicenseType.perpetual, seatsTotal: 3, seatsUsed: 2, vendor: 'VMware', categoryId: catOS.id, purchaseDate: new Date('2023-01-20'), purchaseCost: 120000000, status: SoftwareStatus.active, notes: 'Hypervisor cho DC' },
        { name: 'AutoCAD LT', version: '2024', licenseKey: 'ACAD-LT-2024-001', licenseType: LicenseType.subscription, seatsTotal: 3, seatsUsed: 2, vendor: 'Autodesk', categoryId: catDesign.id, purchaseDate: new Date('2024-05-01'), purchaseCost: 25000000, expirationDate: new Date('2025-05-01'), status: SoftwareStatus.active },
        { name: 'Norton 360 Deluxe', version: '2023', licenseKey: 'NRT-360-2023-001', licenseType: LicenseType.subscription, seatsTotal: 10, seatsUsed: 10, vendor: 'NortonLifeLock', categoryId: catSecurity.id, purchaseDate: new Date('2023-06-01'), purchaseCost: 8000000, expirationDate: new Date('2024-06-01'), status: SoftwareStatus.expired, notes: 'Đã hết hạn - chuyển sang Kaspersky' },
        { name: 'Slack Business+', version: 'N/A', licenseKey: 'SLACK-BIZ-2024-001', licenseType: LicenseType.subscription, seatsTotal: 50, seatsUsed: 38, vendor: 'Salesforce', categoryId: catOffice.id, purchaseDate: new Date('2024-01-01'), purchaseCost: 55000000, expirationDate: new Date('2025-01-01'), status: SoftwareStatus.active },
        { name: 'Figma Organization', version: 'N/A', licenseKey: 'FIGMA-ORG-2024-001', licenseType: LicenseType.subscription, seatsTotal: 10, seatsUsed: 6, vendor: 'Figma', categoryId: catDesign.id, purchaseDate: new Date('2024-04-01'), purchaseCost: 18000000, expirationDate: new Date('2025-04-01'), status: SoftwareStatus.active },
    ];

    for (const asset of softwareAssets) {
        await prisma.softwareAsset.create({ data: asset });
    }

    console.log('✅ Seed completed!');
    console.log(`   📁 ${13} categories`);
    console.log(`   📍 ${5} locations`);
    console.log(`   👤 ${8} employees`);
    console.log(`   💻 ${hardwareAssets.length} hardware assets`);
    console.log(`   📀 ${softwareAssets.length} software assets`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
