---
name: design-doc
description: Tạo tài liệu thiết kế hệ thống (Software Design Document / Báo cáo đồ án Kỹ thuật phần mềm) tiếng Việt với draw.io diagrams + Word docx. Cấu trúc 17 chương + phụ lục theo chuẩn IEEE 1016, đầy đủ không giới hạn số lượng. Tự động render PNG và generate file Word.
---

# /design-doc

Skill giúp tạo Software Design Document (Báo cáo đồ án Kỹ thuật phần mềm) cho project, kết quả là 1 file Word (.docx) hoàn chỉnh với diagrams nhúng + bảng mô tả, theo **cấu trúc 17 chương + phụ lục A-G** (chuẩn IEEE 1016).

**NGUYÊN TẮC ĐẦY ĐỦ, KHÔNG GIỚI HẠN:** phủ mọi chương/mục; mục không áp dụng thì ghi rõ "Không áp dụng — lý do", không bỏ trống. Làm theo số lượng THỰC TẾ của dự án (tất cả use case, tất cả API, tất cả bảng dữ liệu, tất cả lớp, tất cả luồng chính). Chi tiết: `reference/design-structure.md`.

## Khi nào dùng skill này

Kích hoạt khi user yêu cầu:
- "Tạo báo cáo thiết kế hệ thống"
- "Generate design document"
- "Tạo file Word/docx mô tả thiết kế"
- "Vẽ class diagram / ERD / sequence cho project"
- "Tạo SDD theo template"

## Output

Sau khi chạy đầy đủ workflow:
- 13+ file `.drawio` source diagrams (tăng theo số luồng/entity thực tế)
- 13+ file `.png` exported (chạy được script `render`)
- 1 file `.docx` Word document theo **17 chương + phụ lục** đầy đủ (tiếng Việt)

## Cấu trúc thư mục output

```
docs/document/
├── Baocao_ThietKe_<ProjectName>.docx
└── diagrams/
    ├── drawio-common/
    │   ├── 01-context-diagram.drawio
    │   ├── 02-usecase.drawio
    │   ├── 03-domain-model.drawio
    │   ├── 04-analysis-class.drawio
    │   ├── 05-activity-<flow>.drawio        # mỗi luồng chính 1 file
    │   ├── 06-ssd-<uc>.drawio               # system sequence diagram
    │   ├── 07-architecture.drawio
    │   ├── 08-component.drawio
    │   ├── 09-design-class.drawio
    │   ├── 10-sequence-<uc>.drawio          # mỗi UC chính 1 file
    │   ├── 11-state-<entity>.drawio         # mỗi entity có vòng đời 1 file
    │   ├── 12-erd.drawio
    │   └── 13-deployment.drawio
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

Dùng cấu trúc **17 chương + phụ lục A-G** (chi tiết đầy đủ ở `reference/design-structure.md`, khớp mẫu tiếng Việt "BÁO CÁO ĐỒ ÁN KỸ THUẬT PHẦN MỀM"):

1. Giới thiệu (bối cảnh, bài toán, mục tiêu, phạm vi, bên liên quan, thuật ngữ)
2. Tổng quan hệ thống (góc nhìn sản phẩm, context diagram, chức năng, công nghệ)
3. Đặc tả yêu cầu (FR + đặc tả từng FR, NFR, business rule, ràng buộc, giả định)
4. Phân tích Use Case (actor, use case diagram, danh sách + **đặc tả TẤT CẢ UC**)
5. Phân tích hệ thống (domain model, lớp phân tích, activity mọi luồng, SSD)
6. Kiến trúc phần mềm (mẫu kiến trúc + lý do, architecture diagram, tầng, component, module)
7. Thiết kế chi tiết (design class, đặc tả TẤT CẢ lớp, interface, design pattern, sequence, state)
8. Thiết kế dữ liệu (ERD, lược đồ TẤT CẢ bảng, từ điển dữ liệu, validation)
9. Thiết kế giao diện (UI, **TẤT CẢ API**, giao diện ngoài)
10. Thiết kế chất lượng & bảo mật (hiệu năng, mở rộng, tin cậy, bảo trì, bảo mật, kiểm thử)
11. Xử lý lỗi & log (chiến lược lỗi, validation, mã lỗi, logging)
12. Triển khai (môi trường, cấu trúc mã, hiện thực quan trọng + thuật toán cốt lõi, design pattern)
13. Kiểm thử (chiến lược, unit/integration/system, test case, tổng kết)
14. Thiết kế triển khai (deployment diagram, môi trường, quy trình)
15. Ma trận truy vết (FR→UC→analysis→design→code→test)
16. Quyết định & đánh giá thiết kế (phương án, lựa chọn, lý do, đánh đổi, hạn chế, hướng phát triển)
17. Kết luận (tổng kết, mức đạt mục tiêu, bài học)
+ Tài liệu tham khảo + Phụ lục A-G (use case/UML/API/DB/test/UI/mã nguồn đầy đủ)

Mỗi diagram phải có **bảng mô tả đi kèm** (mỗi row = 1 element) + số hiệu hình ("Hình X-Y").

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

## Danh sách diagram (theo 17 chương)

Số lượng **tăng theo dự án**: có bao nhiêu luồng chính thì bấy nhiêu activity/sequence, bao nhiêu entity có vòng đời thì bấy nhiêu state diagram. Danh sách tối thiểu:

| # | File | Loại | Chương |
|---|---|---|---|
| 01 | context-diagram | System Context | 2.2 |
| 02 | usecase | Use Case | 4.2 |
| 03 | domain-model | Domain Model (phân tích) | 5.1 |
| 04 | analysis-class | Analysis Class | 5.3 |
| 05 | activity-<flow> | Activity (mỗi luồng chính 1 file) | 5.4 |
| 06 | ssd-<uc> | System Sequence Diagram | 5.5 |
| 07 | architecture | Software Architecture | 6.3 |
| 08 | component | Component | 6.5 |
| 09 | design-class | Design Class (chi tiết) | 7.2 |
| 10 | sequence-<uc> | Sequence (mỗi UC chính 1 file) | 7.6 |
| 11 | state-<entity> | State (mỗi entity có vòng đời) | 7.7 |
| 12 | erd | Entity Relationship (Crow's foot) | 8.2 |
| 13 | deployment | Deployment | 14.1 |

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

