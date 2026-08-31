---
name: design-doc
description: Tạo tài liệu thiết kế hệ thống (Software Design Document) cho đồ án sinh viên với draw.io diagrams + Word docx. Workflow 7 phần theo chuẩn + 12 loại diagram. Tự động render PNG và generate file Word.
---

# /design-doc

Skill giúp tạo Software Design Document cho project, kết quả là 1 file Word (.docx) hoàn chỉnh với diagrams nhúng + bảng mô tả.

## Khi nào dùng skill này

Kích hoạt khi user yêu cầu:
- "Tạo báo cáo thiết kế hệ thống"
- "Generate design document"
- "Tạo file Word/docx mô tả thiết kế"
- "Vẽ class diagram / ERD / sequence cho project"
- "Tạo SDD theo template"

## Output

Sau khi chạy đầy đủ workflow:
- 12+ file `.drawio` source diagrams
- 12+ file `.png` exported (chạy được script `render`)
- 1 file `.docx` Word document với 7 phần đầy đủ

## Cấu trúc thư mục output

```
docs/document/
├── Baocao_ThietKe_<ProjectName>.docx
└── diagrams/
    ├── drawio-common/
    │   ├── 01-context-diagram.drawio
    │   ├── 02-usecase.drawio
    │   ├── 03-activity-<flow1>.drawio
    │   ├── 04-activity-<flow2>.drawio
    │   ├── 05-erd-conceptual.drawio
    │   ├── 06-architecture.drawio
    │   ├── 07-class-diagram.drawio
    │   ├── 07a-class-diagram-<main>.drawio
    │   ├── 07b-component-diagram.drawio
    │   ├── 08-erd-physical.drawio
    │   ├── 09-sequence-<flow1>.drawio
    │   ├── 10-sequence-<auth>.drawio
    │   ├── 11-sequence-<flow2>.drawio
    │   └── 12-state-<entity>.drawio
    └── drawio-export/

tools/
└── generate-docx.mjs

scripts/
├── render.bat
├── render.ps1
└── render.sh
```

## Workflow 4 bước

### Bước 1: Phân tích project

Hỏi user (hoặc tự đọc code) để xác định:
- Tên project
- Ngôn ngữ + framework chính
- Database schema (tìm `init.sql`, `*.prisma`, migration files)
- Source code structure (controllers, services, repositories)
- Use cases chính (tìm trong requirements.md hoặc routes/controllers)

Output: file `design-context.md` ở `docs/document/` ghi tóm tắt.

### Bước 2: Thiết kế cấu trúc tài liệu

Dùng cấu trúc 7 phần (xem `reference/design-structure.md`):

1. **Tầm nhìn và bối cảnh** - Mục tiêu, user, context diagram
2. **Mô hình nghiệp vụ** - Use case, activity, conceptual ERD
3. **Đặc tả yêu cầu** - Functional + non-functional, MoSCoW priority
4. **Kiến trúc tổng thể** - Architectural drivers, tech stack, system architecture
5. **Component & Data** - Component diagram, API spec, physical ERD, security
6. **Thiết kế chi tiết** - Class diagram, sequence diagram, state diagram, data dictionary
7. **Triển khai & Test** - WBS, error handling, risk register

Mỗi diagram phải có **bảng mô tả đi kèm** (mỗi row = 1 element trong diagram).

**QUY TẮC ĐỘ ĐẦY ĐỦ (bắt buộc — chi tiết ở reference/design-structure.md):** phần MÔ TẢ/ĐẶC TẢ bằng chữ và bảng phải phủ ĐẦY ĐỦ, không rút gọn "vài mục tiêu biểu": đặc tả HẾT mọi use case (không chỉ 2-3), liệt kê HẾT yêu cầu chức năng, đặc tả HẾT mọi bảng CSDL, phủ HẾT module/lớp chính. Giới hạn "2-3"/"một vài" CHỈ áp dụng cho SỐ DIAGRAM vẽ ra, KHÔNG áp dụng cho phần chữ/bảng. Nhóm phần tử cùng dạng vẫn tách từng mục (được viết gọn + tham chiếu "tương tự X") nhưng KHÔNG bỏ sót.

### Bước 3: Tạo diagrams

Copy templates từ `templates/diagrams/` vào `docs/document/diagrams/drawio-common/`. Modify nội dung cho project hiện tại.

**Quan trọng - best practices từ kinh nghiệm:**

- **Page size vừa đủ** (gợi ý ở `reference/diagram-patterns.md` mục 5). Khoảng cách giữa block: 30-50px tối thiểu, 80-120px tối đa. Không để khoảng trắng quá rộng.
- **Block kích thước vừa đủ chứa text**, padding 8-10px hai bên. Font 10-11 cho body, 14 cho title.
- **Tất cả mxCell parent="1"** (root level), KHÔNG dùng swimlane container - bị crop khi export CLI.
- **Cross-lane edges** dùng explicit `parent="1"` để vẽ giữa các lane.
- **Font**: dùng `<span style="font-family:Consolas,monospace;font-size:11px;">` thay vì `<font>` tag (deprecated).
- **End nodes**: dùng `ellipse;fillColor=#000000;strokeColor=#333333;strokeWidth=3;` thay vì `shape=mxgraph.flowchart.terminate`.
- **Crow's foot ERD**: dùng `startArrow=ERmandOne;startFill=0;endArrow=ERmany;endFill=0` cho 1:N.
- **Class diagram lớn** → tách 2 file: 1 cho module chính (chi tiết), 1 cho module phụ (compact).

### Bước 4: Render PNG + Generate Word

Copy 3 script từ `templates/`:
- `scripts/render.bat`, `scripts/render.ps1`, `scripts/render.sh`

**BẮT BUỘC: 3 script này phải dùng flag `--crop --border 20` khi gọi drawio CLI.** Đây là cách duy nhất bảo đảm PNG không bị cắt nội dung khi content vượt page size đã đặt trong file `.drawio`.

Lệnh chuẩn:
```bash
drawio --export --format png --scale 2 --crop --border 20 --output output.png input.drawio
```

Copy `templates/generate-docx.template.mjs` thành `tools/generate-docx.mjs`. Chỉnh các phần:
- Tên project ở trang bìa
- Filename output
- Nội dung text mô tả (từ `design-context.md`)
- Đường dẫn images (mặc định `docs/document/diagrams/drawio-export/`)

Chạy:
```powershell
# Render PNG
.\scripts\render.ps1

# Generate Word
node tools/generate-docx.mjs
```

**Hai cách sinh .docx — chọn theo dạng nguồn:**

| Nguồn tài liệu | Công cụ | Khi dùng |
|---|---|---|
| Nội dung dựng bằng code (mảng section/text trong script) | `generate-docx.template.mjs` (Node) | Làm mới từ đầu theo skill; kiểm soát trang bìa/mục lục chi tiết |
| Tài liệu ĐÃ viết sẵn ở dạng Markdown (heading + bảng + `![](png)`) | `md-to-docx.py` (Python, python-docx) | Đã có 1 file `.md` hoàn chỉnh, chỉ cần xuất `.docx`; không cần/không có pandoc |

`md-to-docx.py` parse thẳng Markdown → docx: heading, đoạn văn, **đậm**/`code`, danh sách, bảng, ảnh (nhúng + co theo lề, đường dẫn tính tương đối theo file `.md`), blockquote, code block. Chạy:
```powershell
pip install python-docx Pillow
python templates/md-to-docx.py docs/design/tai-lieu.md docs/design/tai-lieu.docx
```
Cần `Pillow` để co ảnh đúng tỉ lệ (thiếu vẫn chạy nhưng chỉ co theo bề rộng). Kiểm tra nhanh sau khi tạo: `python -c "from docx import Document; d=Document('out.docx'); print(len(d.tables),'bảng',len(d.inline_shapes),'ảnh')"`.

## 12 loại diagram (theo design_content.md)

| # | File | Loại | Mục document |
|---|---|---|---|
| 01 | context-diagram | System Context | 1.3 |
| 02 | usecase | Use Case | 2.1 |
| 03 | activity-flow1 | Activity (UC chính 1) | 2.2 |
| 04 | activity-flow2 | Activity (UC chính 2) | 2.2 |
| 05 | erd-conceptual | Conceptual ERD (Crow's foot) | 2.3 |
| 06 | architecture | System Architecture | 4.3 |
| 07 | class-diagram | Class (5 module phụ) | 5.1, 6.1.1 |
| 07a | class-diagram-main | Class chi tiết module chính | 6.1 |
| 07b | component-diagram | Component | 5.1 |
| 08 | erd-physical | Physical ERD | 5.3 |
| 09 | sequence-flow1 | Sequence UC chính | 6.2 |
| 10 | sequence-auth | Sequence Auth/Refresh | 6.2 |
| 11 | sequence-flow2 | Sequence UC phụ | 6.2 |
| 12 | state-entity | State Diagram | 6.x |

## Phong cách viết tài liệu

Vì là báo cáo sinh viên đệ trình hội đồng:
- KHÔNG dùng "em" trong tài liệu (xưng hô không phù hợp khi báo cáo hội đồng)
- KHÔNG dùng từ ngữ AI hoa mỹ ("seamless", "leverage", "robust")
- KHÔNG dùng em dash dài, thay bằng dấu gạch ngang ngắn hoặc dấu phẩy
- Câu ngắn, đơn giản, kiểu sinh viên viết
- Dùng câu bị động khi nói về hệ thống ("Hệ thống được chia thành...")
- Tiếng Việt có dấu đầy đủ

## Reference files

Đọc thêm các file trong `reference/` khi cần:
- `design-structure.md` - Cấu trúc 7 phần đầy đủ với mô tả từng đầu mục
- `erd-rules.md` - Quy tắc vẽ Conceptual ERD theo Crow's foot
- `diagram-patterns.md` - Best practices và lessons learned về drawio export, **bao gồm rule `--crop` bắt buộc**

## Templates

Các file template trong `templates/`:
- `generate-docx.template.mjs` - Skeleton Node.js script tạo file .docx (dùng package `docx`), dựng nội dung bằng code
- `md-to-docx.py` - Chuyển thẳng tài liệu Markdown (heading + bảng + ảnh) sang .docx bằng python-docx; dùng khi đã có file `.md` hoàn chỉnh
- `render.bat`, `render.ps1`, `render.sh` - Scripts render diagrams (đã có flag `--crop --border 20`)
- `diagrams/*.drawio` - Sample diagrams (copy + modify)

## Lưu ý quan trọng

- **Cần draw.io** trên máy: bản desktop (`winget install JGraph.Draw`, macOS `brew install --cask drawio`) HOẶC bản Microsoft Store. Script render tự dò cả hai (xem `reference/diagram-patterns.md` mục "Phát hiện draw.io khi render"). Lưu ý bản Store không tạo lệnh `drawio` trên PATH nên `where drawio` rỗng dù đã cài; phải quét `C:\Program Files\WindowsApps\draw.io.draw.ioDiagrams*\app\draw.io.exe`.
- **Node.js >=18** để chạy script generate-docx.mjs
- **NPM package `docx`** sẽ được install tự động khi chạy lần đầu (npm install docx)
- **Nếu dùng `md-to-docx.py`**: cần `python-docx` (bắt buộc) và `Pillow` (khuyến nghị, để co ảnh đúng tỉ lệ theo cả bề rộng lẫn chiều cao). Không cần Node hay pandoc.
- **PNG bị cắt nội dung là dấu hiệu render thiếu flag `--crop`**, không phải lỗi page size. Luôn dùng `--crop --border 20`.

## Tips troubleshooting

| Vấn đề | Nguyên nhân | Cách fix |
|---|---|---|
| PNG bị cắt nội dung (cạnh phải/dưới) | Render KHÔNG có flag `--crop` | Thêm `--crop --border 20` vào lệnh drawio |
| PNG nền lạ trong Word | Render có `--transparent` | Bỏ flag transparent |
| Font không đúng | Dùng tag `<font>` HTML deprecated | Đổi sang `<span style="font-family:...;">` |
| End node hình vuông đen | `shape=mxgraph.flowchart.terminate` không render | Dùng `ellipse;fillColor=#000;strokeWidth=3` |
| PNG quá to (>5000px) | `--scale 4` hoặc 5 | Dùng `--scale 2` |
| Crow's foot không hiện | Dùng arrow style sai | Dùng `startArrow=ERmandOne;endArrow=ERmany` |
| Diagram dính nhau | Layer boundary boxes lồng nhau | Bỏ container, dùng layer label text bên cạnh |
| Element là child của swimlane bị crop | Tọa độ relative | Move ra `parent="1"`, convert tọa độ tuyệt đối |

