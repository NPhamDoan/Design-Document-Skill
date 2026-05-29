# design-doc skill

Kiro skill giúp tạo Software Design Document (SDD) cho đồ án sinh viên với draw.io diagrams + Word docx tự động.

## Nội dung skill

- **Workflow 4 bước** từ phân tích project đến generate file Word
- **Cấu trúc 7 phần** chuẩn cho SDD (theo Software Design Document standard)
- **13 diagram templates** đã debug và test (không lỗi crop, font, end node)
- **3 render scripts** cross-platform (Windows .bat / .ps1, Linux/macOS .sh)
- **1 docx generator** Node.js dùng package `docx`
- **3 reference files** chi tiết về cấu trúc tài liệu, ERD rules, drawio best practices

## 12 loại diagram được hỗ trợ

| # | Loại | Mục document |
|---|---|---|
| 01 | System Context Diagram | 1.3 |
| 02 | Use Case Diagram | 2.1 |
| 03-04 | Activity Diagrams | 2.2 |
| 05 | Conceptual ERD (Crow's foot) | 2.3 |
| 06 | System Architecture Diagram | 4.3 |
| 07/07a/07b | Class + Component Diagrams | 5.1, 6.1 |
| 08 | Physical ERD | 5.3 |
| 09-11 | Sequence Diagrams | 6.2 |
| 12 | State Diagram | 6.x |

## Cách cài đặt

### Yêu cầu

- [Kiro IDE](https://kiro.dev) hoặc compatible AI assistant
- [draw.io desktop](https://github.com/jgraph/drawio-desktop/releases) - để render PNG
- Node.js >= 18 - để chạy script generate docx

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
2. Copy 13 diagram templates → modify cho project
3. Render diagrams ra PNG
4. Generate file Word `.docx` với 7 phần đầy đủ

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

- `reference/design-structure.md` - Chi tiết 7 phần của SDD
- `reference/erd-rules.md` - Quy tắc Conceptual ERD theo Crow's foot
- `reference/diagram-patterns.md` - Best practices và lessons learned về drawio export

## License

MIT - dùng tự do cho project học tập và thương mại.

## Contributing

PR và issue welcome!
