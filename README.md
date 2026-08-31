# design-doc skill

Kiro skill giúp tạo Software Design Document (SDD) cho đồ án sinh viên với draw.io diagrams + Word docx tự động.

## Nội dung skill

- **Workflow 4 bước** từ phân tích project đến generate file Word
- **Cấu trúc 17 chương + phụ lục A-G** chuẩn theo IEEE 1016 (mẫu tiếng Việt "Báo cáo đồ án Kỹ thuật phần mềm")
- **Nguyên tắc đầy đủ, không giới hạn số lượng**: đặc tả tất cả use case, API, bảng dữ liệu, lớp, luồng
- **Diagram templates** đã debug và test (không lỗi crop, font, end node)
- **3 render scripts** cross-platform (Windows .bat / .ps1, Linux/macOS .sh)
- **2 docx generator**: Node.js dựng nội dung bằng code, và Python chuyển thẳng Markdown → docx
- **3 reference files** chi tiết về cấu trúc tài liệu, ERD rules, drawio best practices

## Các loại diagram được hỗ trợ

Số lượng tăng theo dự án (mỗi luồng chính một activity/sequence, mỗi entity có vòng đời một state):

| # | Loại | Chương |
|---|---|---|
| 01 | System Context Diagram | 2.2 |
| 02 | Use Case Diagram | 4.2 |
| 03 | Domain Model | 5.1 |
| 04 | Analysis Class Diagram | 5.3 |
| 05 | Activity Diagram (mỗi luồng) | 5.4 |
| 06 | System Sequence Diagram | 5.5 |
| 07 | Software Architecture | 6.3 |
| 08 | Component Diagram | 6.5 |
| 09 | Design Class Diagram | 7.2 |
| 10 | Sequence Diagram (mỗi UC) | 7.6 |
| 11 | State Diagram (mỗi entity) | 7.7 |
| 12 | Entity Relationship Diagram | 8.2 |
| 13 | Deployment Diagram | 14.1 |

## Cách cài đặt

### Yêu cầu

- [Kiro IDE](https://kiro.dev) hoặc compatible AI assistant
- [draw.io desktop](https://github.com/jgraph/drawio-desktop/releases) - để render PNG
- Node.js >= 18 - để chạy script generate docx (bản dựng nội dung bằng code)
- Hoặc Python + `python-docx` + `Pillow` - nếu dùng `md-to-docx.py` (chuyển thẳng Markdown → docx)

### Cài skill (User-level, dùng cho mọi project)

**Windows:**
```powershell
git clone https://github.com/<your-username>/design-doc.git "$env:USERPROFILE\.kiro\skills\design-doc"
```

**Linux/macOS:**
```bash
git clone https://github.com/<your-username>/design-doc.git ~/.kiro/skills/design-doc
```

### Cài skill (Project-level, chỉ cho 1 project)

```bash
cd your-project
git clone https://github.com/<your-username>/design-doc.git .kiro/skills/design-doc
```

## Cách dùng

Sau khi cài, mở Kiro IDE và gõ trong chat:

```
/design-doc
```

Hoặc nói tự nhiên: "Tạo báo cáo thiết kế hệ thống cho project này"

Kiro sẽ:
1. Đọc requirements/code của project
2. Copy diagram templates → modify cho project (số lượng theo dự án)
3. Render diagrams ra PNG
4. Generate file Word `.docx` với 17 chương + phụ lục đầy đủ

## Cấu trúc thư mục output

```
docs/document/
├── Baocao_ThietKe_<ProjectName>.docx
└── diagrams/
    ├── drawio-common/         # 13 .drawio source files
    └── drawio-export/          # PNG exports

tools/
└── generate-docx.mjs           # Word generator

scripts/
├── render.bat                  # Windows render script
├── render.ps1                  # PowerShell version
└── render.sh                   # Linux/macOS version
```

## Phong cách viết tài liệu

Skill này áp dụng phong cách viết phù hợp với báo cáo sinh viên đệ trình hội đồng:

- KHÔNG dùng "em" trong tài liệu
- KHÔNG dùng từ ngữ AI hoa mỹ ("seamless", "leverage", "robust")
- Câu ngắn, đơn giản, tiếng Việt có dấu
- Dùng câu bị động khi nói về hệ thống

## Reference files

- `reference/design-structure.md` - Chi tiết 17 chương + phụ lục của SDD (ánh xạ IEEE 1016)
- `reference/erd-rules.md` - Quy tắc ERD theo Crow's foot
- `reference/diagram-patterns.md` - Best practices và lessons learned về drawio export

## License

MIT - dùng tự do cho project học tập và thương mại.

## Contributing

PR và issue welcome!
