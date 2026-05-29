// generate-docx.mjs — Tạo file Word báo cáo thiết kế hệ thống
// Chạy: node tools/generate-docx.mjs

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, ImageRun, WidthType,
  TableLayoutType, ShadingType, PageBreak
} from 'docx';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIAGRAMS = resolve(ROOT, 'docs/document/diagrams/drawio-export');
const OUTPUT = resolve(ROOT, 'docs/document/Baocao_ThietKe_QLTS.docx');

// Ensure output directory exists
const outputDir = dirname(OUTPUT);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Helper: load image
function loadImage(name) {
  const path = resolve(DIAGRAMS, name);
  if (!existsSync(path)) {
    console.warn(`  [WARN] Image not found: ${name}`);
    return null;
  }
  return readFileSync(path);
}

// Helper: tạo paragraph text
function text(content, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text: content, bold: opts.bold, size: opts.size || 24, font: 'Times New Roman' })],
    spacing: { after: 120 },
    alignment: opts.align || AlignmentType.LEFT,
  });
}

// Helper: heading
function heading(content, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text: content,
    heading: level,
    spacing: { before: 240, after: 120 },
  });
}

// Helper: tạo table từ data
function createTable(headers, rows, colWidths) {
  const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: '000000' };
  const borders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };

  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 22, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })],
      borders,
      shading: { type: ShadingType.SOLID, color: 'D9E2F3' },
      width: colWidths ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
    })),
  });

  const dataRows = rows.map(row => new TableRow({
    children: row.map((cell, i) => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: cell, size: 22, font: 'Times New Roman' })], spacing: { before: 40, after: 40 } })],
      borders,
      width: colWidths ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
    })),
  }));

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
  });
}

// Helper: image paragraph
function imageParagraph(filename, width = 600, height = 400) {
  const data = loadImage(filename);
  if (!data) return text(`[Khong tim thay anh: ${filename}]`);
  return new Paragraph({
    children: [new ImageRun({ data, transformation: { width, height }, type: 'png' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
  });
}

// Helper: caption
function caption(content) {
  return new Paragraph({
    children: [new TextRun({ text: content, italics: true, size: 20, font: 'Times New Roman' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  });
}

// ============ BUILD DOCUMENT ============

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Times New Roman', size: 24 } },
    },
  },
  sections: [{
    properties: {},
    children: [
      // === TRANG BÌA ===
      new Paragraph({ spacing: { before: 2000 } }),
      new Paragraph({
        children: [new TextRun({ text: 'BÁO CÁO THIẾT KẾ HỆ THỐNG', bold: true, size: 36, font: 'Times New Roman' })],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [new TextRun({ text: 'QUẢN LÝ TUYỂN SINH', bold: true, size: 36, font: 'Times New Roman' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Phân tích & Thiết kế Hệ thống thông tin', bold: true, size: 28, font: 'Times New Roman' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Môn học: Phân tích & Thiết kế Hệ thống thông tin', size: 26, font: 'Times New Roman' })],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Đề tài: Hệ thống quản lý tuyển sinh và hồ sơ sinh viên đầu vào', size: 26, font: 'Times New Roman' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 1000 },
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // === 1. GIỚI THIỆU ===
      heading('1. Giới thiệu đề tài'),
      heading('1.1 Mục tiêu', HeadingLevel.HEADING_2),
      text('Xây dựng ứng dụng web giúp phòng tuyển sinh quản lý hồ sơ sinh viên đầu vào, thay thế cho việc dùng Excel/giấy tờ.'),

      heading('1.2 Phạm vi', HeadingLevel.HEADING_2),
      createTable(
        ['Làm được', 'Không làm'],
        [
          ['Đăng nhập, phân quyền admin/staff', 'Quản lý điểm số'],
          ['Tạo/tìm kiếm/cập nhật hồ sơ', 'Môn học, lớp học'],
          ['Upload tệp đính kèm', 'Đăng ký học phần'],
          ['Quản lý danh mục (Năm, Đợt, Ngành, Hệ)', 'Học phí, CRM'],
          ['Hỗ trợ database (Repository Pattern)', 'Quy trình sau nhập học'],
          ['Lịch sử cập nhật trạng thái hồ sơ', 'Thông báo email/SMS'],
        ],
        [50, 50]
      ),

      heading('1.3 Sơ đồ bối cảnh hệ thống', HeadingLevel.HEADING_2),
      imageParagraph('01-context-diagram.png', 550, 350),
      caption('Hình 1.1: Sơ đồ bối cảnh hệ thống (System Context Diagram)'),
      createTable(
        ['Thành phần', 'Loại', 'Mô tả'],
        [
          ['User (staff)', 'Actor', 'Nhân viên phòng tuyển sinh — tạo, tra cứu, cập nhật hồ sơ'],
          ['Quản trị viên (admin)', 'Actor', 'Quản lý tài khoản, danh mục hệ thống'],
          ['Hệ thống QuanLyTS', 'System', 'React SPA + Node.js Express API'],
          ['Database', 'Storage', 'Lưu trữ dữ liệu hệ thống'],
          ['/uploads/', 'File Storage', 'Lưu tệp đính kèm vật lý trên disk'],
        ],
        [25, 15, 60]
      ),

      new Paragraph({ children: [new PageBreak()] }),

      // === 2. PHÂN TÍCH NGHIỆP VỤ ===
      heading('2. Phân tích nghiệp vụ'),
      heading('2.1 Tác nhân (Actors)', HeadingLevel.HEADING_2),
      createTable(
        ['Actor', 'Mô tả', 'Quyền'],
        [
          ['Cán bộ tiếp nhận (staff)', 'Nhân viên phòng tuyển sinh', 'Tạo/xem/sửa hồ sơ, upload tệp, xem lịch sử'],
          ['Quản trị viên (admin)', 'Trưởng phòng hoặc IT', 'Tất cả quyền staff + quản lý user + danh mục'],
        ],
        [25, 35, 40]
      ),

      heading('2.2 Sơ đồ Use Case', HeadingLevel.HEADING_2),
      imageParagraph('02-usecase.png', 580, 420),
      caption('Hình 2.1: Sơ đồ Use Case - Hệ thống Quản lý Tuyển sinh'),
      createTable(
        ['Mã UC', 'Tên Use Case', 'Actor', 'Mô tả ngắn'],
        [
          ['UC-01', 'Đăng nhập', 'Staff, Admin', 'Xác thực bằng JWT (access + refresh token)'],
          ['UC-02', 'Tạo hồ sơ tuyển sinh', 'Staff', 'Tạo SinhVien + HoSo trong 1 request'],
          ['UC-03', 'Tra cứu & lọc hồ sơ', 'Staff', 'Tìm kiếm theo trạng thái, năm, đợt, ngành'],
          ['UC-04', 'Cập nhật trạng thái hồ sơ', 'Staff', 'Chuyển trạng thái + ghi lịch sử'],
          ['UC-05', 'Upload tệp đính kèm', 'Staff', 'Đính kèm file vào hồ sơ (Multer)'],
          ['UC-06', 'Quản lý tài khoản', 'Admin', 'CRUD tài khoản, đặt lại mật khẩu'],
          ['UC-07', 'Quản lý danh mục', 'Admin', 'CRUD Năm/Đợt/Ngành/Hệ đào tạo'],
          ['UC-08', 'Xem lịch sử cập nhật', 'Staff', 'Xem timeline thay đổi trạng thái hồ sơ'],
        ],
        [10, 28, 15, 47]
      ),

      heading('2.3 Sơ đồ hoạt động — Luồng tạo hồ sơ (UC-02)', HeadingLevel.HEADING_2),
      imageParagraph('03-activity-tao-hoso.png', 500, 600),
      caption('Hình 2.2: Sơ đồ hoạt động - Tạo hồ sơ tuyển sinh'),
      createTable(
        ['Bước', 'Lane', 'Hành động', 'Ghi chú'],
        [
          ['1', 'User', 'Mở form tạo hồ sơ', ''],
          ['2', 'User', 'Nhập thông tin sinh viên', 'Họ tên, CCCD, email, SĐT, địa chỉ'],
          ['3', 'User', 'Chọn Năm/Đợt/Ngành/Hệ', 'Từ dropdown danh mục'],
          ['4', 'User', 'Bấm nút Lưu', 'POST /ho-so'],
          ['5', 'Backend', 'Kiểm tra JWT', 'Trả 401 nếu không hợp lệ'],
          ['6', 'Backend', 'Tạo record SinhVien (UUID)', 'INSERT INTO SinhVien'],
          ['7', 'Backend', 'Tạo record HoSoTuyenSinh', 'trạng_thái = mới_nộp'],
          ['8', 'Backend', 'JOIN 5 bảng lấy view', 'Trả HTTP 201 + HoSoView'],
          ['9', 'User', 'Hiển thị mã hồ sơ', 'HS-xxx'],
          ['10', 'User', 'Upload tệp (tùy chọn)', 'Multer lưu file → INSERT TepDinhKem'],
        ],
        [8, 12, 35, 45]
      ),

      heading('2.4 Sơ đồ hoạt động — Luồng cập nhật trạng thái (UC-04)', HeadingLevel.HEADING_2),
      imageParagraph('04-activity-capnhat-trangthai.png', 500, 600),
      caption('Hình 2.3: Sơ đồ hoạt động - Cập nhật trạng thái hồ sơ'),
      createTable(
        ['Bước', 'Lane', 'Hành động', 'Ghi chú'],
        [
          ['1', 'User', 'Mở chi tiết hồ sơ', ''],
          ['2', 'User', 'Chọn trạng thái mới', 'Dropdown: dang_kiem_tra, thieu_giay_to, hoan_tat, tu_choi'],
          ['3', 'User', 'Nhập ghi chú lý do', 'Bắt buộc'],
          ['4', 'User', 'Bấm nút Cập nhật', 'PATCH /ho-so/:id/trang-thai'],
          ['5', 'Backend', 'Kiểm tra JWT', 'Trả 401 nếu không hợp lệ'],
          ['6', 'Backend', 'Lấy trạng thái hiện tại', 'findRawById — trả 404 nếu không tìm thấy'],
          ['7', 'Backend', 'Validate trạng thái khác', 'Trả 400 nếu trùng trạng thái cũ'],
          ['8', 'Backend', 'Atomic: UPDATE + INSERT lịch sử', 'Transaction đảm bảo consistency'],
          ['9', 'Backend', 'SELECT JOIN lấy view', 'Trả HTTP 200 + HoSoView'],
          ['10', 'User', 'Hiển thị hồ sơ đã cập nhật', ''],
        ],
        [8, 12, 35, 45]
      ),

      heading('2.5 ERD khái niệm', HeadingLevel.HEADING_2),
      text('Sơ đồ quan hệ thực thể (Entity-Relationship Diagram) thể hiện các thực thể chính và mối quan hệ giữa chúng:'),
      imageParagraph('05-erd-conceptual.png', 580, 400),
      caption('Hình 2.4: Sơ đồ ERD khái niệm (Conceptual ERD) - 7 thực thể nghiệp vụ'),
      createTable(
        ['Quan hệ', 'Ý nghĩa', 'Loại'],
        [
          ['TaiKhoan → RefreshToken', 'Mỗi user có thể có nhiều refresh token', '1-N'],
          ['TaiKhoan → LichSuCapNhat', 'Mỗi user thực hiện nhiều thao tác cập nhật', '1-N'],
          ['SinhVien → HoSoTuyenSinh', 'Một SV có thể nộp nhiều hồ sơ', '1-N'],
          ['NamTuyenSinh → DotTuyenSinh', 'Mỗi năm có nhiều đợt tuyển sinh', '1-N'],
          ['NamTuyenSinh → HoSoTuyenSinh', 'Hồ sơ thuộc về 1 năm tuyển sinh', '1-N'],
          ['DotTuyenSinh → HoSoTuyenSinh', 'Hồ sơ thuộc về 1 đợt cụ thể', '1-N'],
          ['NganhDangKy → HoSoTuyenSinh', 'Hồ sơ đăng ký 1 ngành', '1-N'],
          ['HeDaoTao → HoSoTuyenSinh', 'Hồ sơ theo 1 hệ đào tạo', '1-N'],
          ['HoSoTuyenSinh → TepDinhKem', 'Mỗi hồ sơ có nhiều tệp đính kèm', '1-N'],
          ['HoSoTuyenSinh → LichSuCapNhat', 'Mỗi hồ sơ có nhiều lần cập nhật trạng thái', '1-N'],
        ],
        [35, 45, 20]
      ),

      new Paragraph({ children: [new PageBreak()] }),

      // === 3. YÊU CẦU HỆ THỐNG ===
      heading('3. Yêu cầu hệ thống'),
      heading('3.1 Yêu cầu chức năng', HeadingLevel.HEADING_2),
      createTable(
        ['ID', 'Chức năng', 'Mô tả'],
        [
          ['FR-01', 'Đăng nhập JWT', 'Access token 15 phút, refresh token 7 ngày'],
          ['FR-02', 'Phân quyền', 'Staff không vào được /admin/*'],
          ['FR-03', 'Tạo hồ sơ', '1 request tạo cả SV + hồ sơ, trạng thái mặc định moi_nop'],
          ['FR-04', 'Cập nhật trạng thái', '5 trạng thái theo quy trình'],
          ['FR-05', 'Tìm kiếm & lọc', 'Lọc theo trạng thái/năm/đợt/ngành'],
          ['FR-06', 'Upload tệp', 'Lưu file vật lý + record DB'],
          ['FR-07', 'Quản lý danh mục', 'CRUD 4 bảng danh mục'],
          ['FR-08', 'Database abstraction', 'Repository Pattern cho phép đổi DB linh hoạt'],
          ['FR-09', 'Lịch sử cập nhật', 'Ghi lại mọi thay đổi trạng thái hồ sơ kèm người thực hiện và thời gian'],
        ],
        [10, 25, 65]
      ),

      heading('3.2 Yêu cầu phi chức năng', HeadingLevel.HEADING_2),
      createTable(
        ['Tiêu chí', 'Yêu cầu', 'Ghi chú'],
        [
          ['Hiệu năng', 'API < 200ms (local)', 'Database tối ưu cho workload hệ thống'],
          ['Bảo mật', 'Password hash bcrypt, refresh token hash SHA-256', 'Không lưu plaintext'],
          ['Bảo mật', 'Rate limit login: 10 lần/15 phút/IP', 'In-memory, đủ cho 1 instance'],
          ['Bảo trì', 'TypeScript cả frontend + backend', 'Bắt lỗi type lúc compile'],
          ['Mở rộng', 'Repository interface cho phép thêm DB mới', 'Chỉ cần thêm case trong factory'],
        ],
        [20, 45, 35]
      ),

      new Paragraph({ children: [new PageBreak()] }),

      // === 4. KIẾN TRÚC HỆ THỐNG ===
      heading('4. Kiến trúc hệ thống'),
      heading('4.1 Lý do chọn kiến trúc', HeadingLevel.HEADING_2),
      createTable(
        ['Quyết định', 'Lý do'],
        [
          ['Monolith (1 process Node.js)', 'Dự án nhỏ, 1-2 người, dễ deploy'],
          ['SQL thuần (không ORM)', 'Đơn giản, dễ debug, kiểm soát query'],
          ['Repository Pattern', 'Cho phép đổi DB mà không sửa service'],
          ['Feature-first frontend', 'Dễ tìm file, mỗi feature gom lại 1 chỗ'],
        ],
        [40, 60]
      ),

      heading('4.2 Sơ đồ kiến trúc tổng thể', HeadingLevel.HEADING_2),
      imageParagraph('06-architecture.png', 560, 450),
      caption('Hình 4.1: Sơ đồ kiến trúc tổng thể (Deployment Diagram)'),
      createTable(
        ['Tier', 'Thành phần', 'Vai trò'],
        [
          ['Client', 'React 19 SPA + Vite', 'Giao diện người dùng, gọi API qua Axios'],
          ['Gateway', 'Express API Gateway', 'Routing, middleware (CORS, Rate Limit, Auth, Multer)'],
          ['Service', 'HoSo, SinhVien, DanhMuc, TaiKhoan, TepDinhKem, LichSu', '6 service xử lý logic nghiệp vụ'],
          ['Data', 'Database', 'Lưu trữ dữ liệu hệ thống'],
          ['Data', '/uploads/ File system', 'Lưu tệp đính kèm vật lý'],
        ],
        [12, 38, 50]
      ),

      heading('4.3 Công nghệ sử dụng', HeadingLevel.HEADING_2),
      createTable(
        ['Thành phần', 'Công nghệ', 'Phiên bản'],
        [
          ['Backend runtime', 'Node.js + Express', 'Express 4'],
          ['Backend language', 'TypeScript', '5.x'],
          ['Database', 'Repository Pattern (SQL thuần)', '-'],
          ['Frontend framework', 'React', '19'],
          ['Build tool', 'Vite', '8'],
          ['CSS', 'Tailwind CSS', '4'],
          ['Routing', 'react-router-dom', '7'],
          ['HTTP client', 'Axios', '-'],
          ['Auth', 'JWT + bcryptjs', '-'],
          ['File upload', 'Multer', '2.x'],
        ],
        [35, 40, 25]
      ),

      new Paragraph({ children: [new PageBreak()] }),

      // === 5. THIẾT KẾ DỮ LIỆU & API ===
      heading('5. Thiết kế dữ liệu & API'),
      heading('5.1 ERD vật lý', HeadingLevel.HEADING_2),
      text('Schema database bao gồm 10 bảng chính với các ràng buộc FK và UNIQUE:'),
      imageParagraph('08-erd-physical.png', 580, 500),
      caption('Hình 5.1: Sơ đồ ERD — Cơ sở dữ liệu Quản lý Tuyển sinh (10 bảng)'),
      createTable(
        ['Bảng', 'Mục đích', 'PK', 'Ghi chú'],
        [
          ['TaiKhoan', 'Lưu thông tin đăng nhập', 'id (auto)', 'Password hash bcrypt'],
          ['RefreshToken', 'Lưu token làm mới phiên', 'id (auto)', 'Hash SHA-256, CASCADE khi xóa user'],
          ['NamTuyenSinh', 'Danh mục năm', 'id (auto)', 'VD: 2024, 2025, 2026'],
          ['DotTuyenSinh', 'Danh mục đợt trong năm', 'id (auto)', 'FK tới NamTuyenSinh'],
          ['NganhDangKy', 'Danh mục ngành', 'id (auto)', 'Có mã ngành unique'],
          ['HeDaoTao', 'Danh mục hệ', 'id (auto)', 'VD: Đại học chính quy'],
          ['SinhVien', 'Thông tin cá nhân SV', 'maSinhVien (UUID)', 'Họ tên, CCCD, email, SĐT'],
          ['HoSoTuyenSinh', 'Hồ sơ đăng ký', 'maHoSo (UUID)', 'FK tới SV + 4 bảng danh mục'],
          ['TepDinhKem', 'File đính kèm', 'maTep (UUID)', 'Lưu đường dẫn file'],
          ['LichSuCapNhat', 'Lịch sử thay đổi trạng thái', 'id (UUID)', 'FK tới HoSoTuyenSinh + TaiKhoan'],
        ],
        [20, 30, 20, 30]
      ),

      heading('5.2 Bảng LichSuCapNhat — Chi tiết', HeadingLevel.HEADING_2),
      text('Bảng ghi lại lịch sử mọi thay đổi trạng thái của hồ sơ tuyển sinh:'),
      createTable(
        ['Cột', 'Kiểu', 'Mô tả'],
        [
          ['id', 'TEXT (UUID)', 'Primary key'],
          ['maHoSo', 'TEXT', 'FK → HoSoTuyenSinh.maHoSo'],
          ['trangThaiCu', 'TEXT', 'Trạng thái trước khi thay đổi'],
          ['trangThaiMoi', 'TEXT', 'Trạng thái sau khi thay đổi'],
          ['ghiChu', 'TEXT', 'Ghi chú lý do thay đổi'],
          ['nguoiThucHienId', 'INTEGER', 'FK → TaiKhoan.id'],
          ['thoiGian', 'TEXT', 'ISO 8601 timestamp'],
        ],
        [25, 20, 55]
      ),

      heading('5.3 API Endpoints chính', HeadingLevel.HEADING_2),
      createTable(
        ['Method', 'Endpoint', 'Mô tả'],
        [
          ['POST', '/auth/login', 'Đăng nhập, nhận access + refresh token'],
          ['POST', '/auth/refresh', 'Làm mới access token'],
          ['POST', '/ho-so', 'Tạo hồ sơ mới (kèm SinhVien)'],
          ['GET', '/ho-so', 'Danh sách hồ sơ (có filter)'],
          ['PATCH', '/ho-so/:id/trang-thai', 'Cập nhật trạng thái + ghi lịch sử'],
          ['POST', '/tep-dinh-kem/upload', 'Upload file đính kèm'],
          ['GET', '/admin/tai-khoan', 'Danh sách tài khoản (admin only)'],
          ['CRUD', '/admin/danh-muc/*', 'CRUD 4 bảng danh mục'],
        ],
        [12, 35, 53]
      ),

      new Paragraph({ children: [new PageBreak()] }),

      // === 6. THIẾT KẾ CHI TIẾT ===
      heading('6. Thiết kế chi tiết'),
      heading('6.1 Sơ đồ lớp — Module Hồ sơ (chi tiết)', HeadingLevel.HEADING_2),
      imageParagraph('07a-class-diagram-hoso.png', 580, 500),
      caption('Hình 6.1: Sơ đồ lớp chi tiết - Module Hồ sơ Tuyển sinh (chính)'),
      text('Module Hồ sơ là trung tâm của hệ thống. Sơ đồ này thể hiện đầy đủ các method signatures, domain entities (HoSoTuyenSinh, HoSoTuyenSinhView, LichSuCapNhat) và Error hierarchy.'),

      heading('6.1.1 Sơ đồ lớp — Các module phụ trợ', HeadingLevel.HEADING_3),
      imageParagraph('07-class-diagram.png', 580, 460),
      caption('Hình 6.1.1: Sơ đồ lớp - 5 module phụ trợ (Auth, SinhVien, TepDinhKem, TaiKhoan, DanhMuc)'),
      createTable(
        ['Module', 'Controller', 'Service', 'Interface', 'Repository'],
        [
          ['Auth', 'AuthController', 'AuthService', 'ITaiKhoanRepository, IRefreshTokenRepository', 'TaiKhoanRepository, RefreshTokenRepository'],
          ['HoSo', 'HoSoController', 'HoSoService', 'IHoSoTuyenSinhRepository, ILichSuCapNhatRepository', 'HoSoRepository, LichSuRepository'],
          ['SinhVien', 'SinhVienController', 'SinhVienService', 'ISinhVienRepository', 'SinhVienRepository'],
          ['TepDinhKem', 'TepDinhKemController', 'TepDinhKemService', 'ITepDinhKemRepository', 'TepDinhKemRepository'],
          ['TaiKhoan', 'TaiKhoanController', 'TaiKhoanService', 'ITaiKhoanRepository, IRefreshTokenRepository', 'TaiKhoanRepository, RefreshTokenRepository'],
          ['DanhMuc', 'DanhMucController', 'DanhMucService', 'ICatalogRepository<T>', 'CatalogRepository'],
        ],
        [12, 18, 16, 30, 24]
      ),
      text('Giải thích: Mỗi module gồm Controller → Service → Interface → Repository. Controller nhận HTTP request, Service xử lý logic nghiệp vụ, phụ thuộc Interface (contract). Concrete Repository implement interface, viết SQL thuần. Pattern này cho phép đổi database mà không sửa code nghiệp vụ.'),

      heading('6.2 Sơ đồ tuần tự — Luồng tạo hồ sơ', HeadingLevel.HEADING_2),
      imageParagraph('09-sequence-tao-hoso.png', 580, 450),
      caption('Hình 6.2: Sơ đồ tuần tự (Sequence Diagram) - Tạo hồ sơ'),
      createTable(
        ['#', 'Từ', 'Đến', 'Message', 'Ghi chú'],
        [
          ['1', 'User', 'React SPA', 'Submit form', ''],
          ['2', 'React SPA', 'authMiddleware', 'POST /ho-so (JWT)', 'Bearer token trong header'],
          ['3', 'authMiddleware', 'authMiddleware', 'jwt.verify()', 'Xác thực token'],
          ['4', 'authMiddleware', 'HoSoController', 'next()', 'Chuyển tiếp request'],
          ['5', 'HoSoController', 'HoSoService', 'taoHoSo(data)', ''],
          ['6', 'HoSoService', 'Repository', 'create(data)', 'INSERT SinhVien + HoSo'],
          ['7', 'Repository', 'Database', 'INSERT + SELECT JOIN', 'Trả HoSoView'],
          ['8', 'HoSoController', 'React SPA', '201 + JSON', 'Response'],
        ],
        [5, 15, 15, 30, 35]
      ),

      heading('6.3 Sơ đồ tuần tự — Luồng Refresh Token', HeadingLevel.HEADING_2),
      imageParagraph('10-sequence-refresh-token.png', 560, 420),
      caption('Hình 6.3: Sơ đồ tuần tự - Refresh Token'),
      createTable(
        ['Case', 'Điều kiện', 'Kết quả'],
        [
          ['[null]', 'Token hash không tìm thấy trong DB', '401 Unauthorized'],
          ['[hết hạn]', 'hetHan < now — token đã expired', 'Xóa token + 401'],
          ['[vô hiệu hóa]', 'Tài khoản trangThai = vo_hieu_hoa', '403 Forbidden'],
          ['[hợp lệ]', 'Token valid + account active', 'jwt.sign(15m) → 200 {accessToken}'],
        ],
        [15, 40, 45]
      ),

      heading('6.4 Sơ đồ tuần tự — Luồng cập nhật trạng thái (UC-04)', HeadingLevel.HEADING_2),
      imageParagraph('11-sequence-capnhat-trangthai.png', 580, 450),
      caption('Hình 6.4: Sơ đồ tuần tự - Cập nhật trạng thái hồ sơ + Ghi lịch sử'),
      createTable(
        ['#', 'Từ', 'Đến', 'Message', 'Ghi chú'],
        [
          ['1', 'User', 'React SPA', 'Click cập nhật', ''],
          ['2', 'React SPA', 'authMiddleware', 'PATCH /ho-so/:id/trang-thai', 'JWT Bearer'],
          ['3-4', 'authMiddleware', 'HoSoController', 'jwt.verify() → next()', ''],
          ['5', 'HoSoController', 'HoSoService', 'capNhatTrangThai(maHoSo, ...)', ''],
          ['6-9', 'HoSoService', 'HoSoRepository', 'findRawById(maHoSo)', 'Validate tồn tại + trạng thái khác'],
          ['12-17', 'HoSoService', 'LichSuRepository', 'capNhatTrangThaiVaGhiLichSu()', 'BEGIN → UPDATE → INSERT → COMMIT'],
          ['19-22', 'HoSoService', 'HoSoRepository', 'findById(maHoSo)', 'SELECT JOIN 5 tables → HoSoView'],
          ['23-25', 'HoSoController', 'React SPA → User', '200 + JSON', 'Hiển thị kết quả'],
        ],
        [7, 13, 17, 33, 30]
      ),
      text('Điểm quan trọng: Bước 12-17 là atomic transaction — nếu INSERT lịch sử fail thì UPDATE trạng thái cũng rollback, đảm bảo consistency.'),

      heading('6.5 Máy trạng thái hồ sơ', HeadingLevel.HEADING_2),
      imageParagraph('12-state-hoso.png', 500, 350),
      caption('Hình 6.5: Sơ đồ trạng thái (State Diagram) - Hồ sơ tuyển sinh'),

      createTable(
        ['Trạng thái', 'Ý nghĩa', 'Chuyển được sang'],
        [
          ['moi_nop', 'Hồ sơ vừa được tạo, chưa ai xử lý', 'dang_kiem_tra'],
          ['dang_kiem_tra', 'Cán bộ đang xem xét hồ sơ', 'thieu_giay_to, hoan_tat, tu_choi'],
          ['thieu_giay_to', 'Cần SV bổ sung giấy tờ', 'dang_kiem_tra, tu_choi'],
          ['hoan_tat', 'Hồ sơ đầy đủ, SV được nhận', '(kết thúc)'],
          ['tu_choi', 'Hồ sơ bị từ chối', '(kết thúc)'],
        ],
        [20, 40, 40]
      ),
      text('Ghi chú: Mỗi lần chuyển trạng thái đều được ghi vào bảng LichSuCapNhat kèm thông tin người thực hiện và thời gian.'),

      new Paragraph({ children: [new PageBreak()] }),

      // === 7. KẾ HOẠCH TRIỂN KHAI ===
      heading('7. Kế hoạch triển khai & Đánh giá'),
      heading('7.1 Phân chia công việc', HeadingLevel.HEADING_2),
      createTable(
        ['Sprint', 'Nội dung', 'Kết quả'],
        [
          ['1', 'Setup TypeScript + Vite + Tailwind, viết schema SQL, làm JWT auth', 'Backend chạy được, login OK'],
          ['2', 'Module SinhVien + HoSoTuyenSinh, repository interface + SQLite', 'CRUD hồ sơ hoạt động'],
          ['3', 'Upload tệp (multer), CRUD 4 danh mục, form tạo hồ sơ frontend', 'Tạo hồ sơ end-to-end'],
          ['4', 'Middleware admin, UI quản lý tài khoản + danh mục', 'Phân quyền hoạt động'],
          ['5', 'Dashboard thống kê, bộ lọc, các component UI chung', 'UX hoàn thiện'],
          ['6', 'Hoàn thiện Repository Pattern, lịch sử cập nhật', 'Hệ thống ổn định'],
        ],
        [10, 55, 35]
      ),

      heading('7.2 Rủi ro và cách xử lý', HeadingLevel.HEADING_2),
      createTable(
        ['Rủi ro', 'Mức độ', 'Cách xử lý'],
        [
          ['init.sql DROP bảng mỗi lần restart', 'Cao', 'Chỉ drop khi env FRESH_DB=1'],
          ['JWT_SECRET hardcoded fallback', 'Trung bình', 'Production phải set env'],
          ['Upload không giới hạn size', 'Trung bình', 'Thêm limits: {fileSize: 10MB}'],
          ['Xóa danh mục đang có hồ sơ dùng', 'Cao', 'FK RESTRICT chặn + UI disable nút xóa'],
        ],
        [40, 15, 45]
      ),

      // === KẾT LUẬN ===
      heading('Kết luận'),
      text('Hệ thống đã hoàn thành các chức năng chính: đăng nhập phân quyền, quản lý hồ sơ từ đầu đến cuối, quản lý danh mục, upload tệp, lịch sử cập nhật trạng thái, và đặc biệt là tách được tầng repository để đổi database mà không sửa code nghiệp vụ.'),
      text('Kiến trúc sử dụng SQL thuần với Repository Pattern, đảm bảo hiệu năng cao và đơn giản trong triển khai. Bảng LichSuCapNhat giúp truy vết mọi thay đổi trạng thái hồ sơ, phục vụ kiểm tra và giám sát.'),
      text('Các hạn chế (chưa có test tự động, chưa giới hạn upload) đã được ghi nhận và có hướng xử lý cụ thể cho các sprint tiếp theo.'),
    ],
  }],
});

// Generate file
const buffer = await Packer.toBuffer(doc);
writeFileSync(OUTPUT, buffer);
console.log(`\nDone! File saved: ${OUTPUT}`);
console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
