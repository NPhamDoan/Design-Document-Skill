# Best Practices và Lessons Learned về drawio

Tổng hợp kinh nghiệm khi dùng draw.io desktop CLI để export PNG cho documents.

## 1. Quy tắc về structure XML

### Tất cả elements ở root level

**TỐT:**
```xml
<mxCell id="my_cell" parent="1" vertex="1">
  <mxGeometry x="100" y="200" width="160" height="60"/>
</mxCell>
```

**TRÁNH** (gây lỗi crop khi export):
```xml
<mxCell id="my_swimlane" vertex="1" parent="1">...</mxCell>
<mxCell id="child_in_swimlane" parent="my_swimlane" vertex="1">
  <mxGeometry x="10" y="20" .../>
</mxCell>
```

CLI export của draw.io có bug khi swimlane có `horizontal=0` hoặc child elements nằm ngoài swimlane bounds. Convert mọi tọa độ tương đối thành tuyệt đối và đặt ở `parent="1"`.

## 2. Font

### TRÁNH (deprecated)
```xml
<font face='Courier New' size='10'>+ method(): void</font>
```

### TỐT
```xml
<span style='font-family:Consolas,monospace;font-size:11px;'>+ method(): void</span>
```

## 3. End nodes (UML final state)

### TRÁNH
```
shape=mxgraph.flowchart.terminate;fillColor=#000000;
```

### TỐT
```
ellipse;whiteSpace=wrap;html=1;aspect=fixed;
fillColor=#000000;strokeColor=#333333;strokeWidth=3;
```

## 4. Crow's Foot Notation (ERD)

```
edgeStyle=entityRelationEdgeStyle;
startArrow=ERmandOne;startFill=0;
endArrow=ERmany;endFill=0;
strokeColor=#7B1FA2;strokeWidth=2;
```

Cardinality: `ERone`, `ERmandOne`, `ERzeroToOne`, `ERmany`, `ERoneToMany`, `ERzeroToMany`.

## 5. Page size (gợi ý — flag --crop sẽ override)

Khi vẽ, đặt `pageWidth × pageHeight` khớp content để xem dễ chịu. Khi render, `--crop` sẽ tự fit theo content thực, bỏ qua page size.

| Loại diagram | pageWidth × pageHeight |
|---|---|
| Context, Use Case, State | 1100 × 800 |
| Activity (2 lanes) | 1200 × 950 |
| Architecture | 1200 × 850 |
| Sequence (4-6 lifelines) | 1300 × 950 |
| Component | 1200 × 850 |
| Class diagram | 1300 × 950 |
| ERD conceptual | 1200 × 900 |
| ERD physical | 1300 × 950 |

Quy tắc thiết kế:
- Khoảng cách giữa block: 30-50px tối thiểu, 80-120px tối đa.
- Block kích thước vừa đủ chứa text, padding 8-10px.
- Font: 10-11 cho body, 14 cho title, 9-10 cho legend.

## 6. Render command (LUÔN dùng --crop)

### Recommendation chuẩn
```bash
drawio --export --format png --scale 2 --crop --border 20 --output output.png input.drawio
```

### Vì sao bắt buộc `--crop`?

Không có `--crop`, drawio export theo `pageWidth × pageHeight` đặt trong file `.drawio`. Nếu content vượt page size (rất dễ xảy ra với sequence/ERD/class diagram lớn), **PNG sẽ bị cắt mất phần overflow**.

Với `--crop`, drawio bỏ qua page size và **tự fit theo bounding box thực của tất cả elements**. Đây là cách an toàn nhất.

### Flags chuẩn
- `--crop` (BẮT BUỘC) — fit theo content
- `--scale 2` — render 2x cho nét
- `--border 20` — viền trắng 20px
- `--format png` — output PNG
- KHÔNG dùng `--transparent` cho docx

### Pitfalls thường gặp

| Triệu chứng | Nguyên nhân | Giải pháp |
|---|---|---|
| PNG cắt mất phần dưới/phải | Không có `--crop`, content > page size | Thêm `--crop` |
| PNG quá to (>5000px) | `--scale 4` hoặc 5 | Dùng `--scale 2` |
| PNG nền lạ trong Word | `--transparent` | Bỏ flag transparent |
| Element âm tọa độ bị cắt | Có element x<0 hoặc y<0 | `--crop` vẫn fit được |

## 7. Cross-lane edges

Edges nối giữa 2 lanes phải có `parent="1"` (KHÔNG phải parent của lane).

```xml
<mxCell id="cross_edge"
  style="endArrow=open;dashed=1;strokeColor=#666;"
  edge="1"
  source="frontend_action" target="backend_action"
  parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## 8. Splitting large diagrams

Nếu >25 elements hoặc 1 trục >2000px, tách thành 2 file:
- **07a-class-diagram-main.drawio** — module chính, full chi tiết
- **07-class-diagram.drawio** — module phụ, compact

## 9. Color coding nhất quán

| Layer/Category | Fill | Stroke | Hex |
|---|---|---|---|
| Frontend / Client / Controller | Blue | Dark blue | `#BBDEFB` / `#0288D1` |
| API Gateway / Middleware | Orange | Dark orange | `#FFE0B2` / `#F57C00` |
| Service / Logic | Purple | Dark purple | `#E1BEE7` / `#7B1FA2` |
| Data / Repository | Green | Dark green | `#C8E6C9` / `#2E7D32` |
| Interface | Yellow | Dark yellow | `#FFF9C4` / `#F57F17` |
| Error / Critical | Red | Dark red | `#FFCDD2` / `#C62828` |
| Decision (rhombus) | Light yellow | Yellow | `#FFF9C4` / `#F57F17` |
| Database | Cyan | Dark cyan | `#26C6DA` / `#00838F` |

## 10. Render script template

Đặt ở `scripts/render.ps1` (BẮT BUỘC dùng `--crop`):

```powershell
$drawio = "C:\Program Files\draw.io\draw.io.exe"
$src = "docs/document/diagrams/drawio-common"
$out = "docs/document/diagrams/drawio-export"

if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out -Force }

Get-ChildItem "$src/*.drawio" | ForEach-Object {
    $outFile = Join-Path $out ($_.BaseName + ".png")
    & $drawio --export --format png --scale 2 --crop --border 20 --output $outFile $_.FullName
}
```

drawio CLI mới (>= v22) không cần `Start-Sleep`. Nếu render hàng loạt fail thỉnh thoảng, thêm `Start-Sleep -Seconds 2` giữa mỗi file.

## 11. Tiếng Việt trong diagrams

- UTF-8 khi save file (`[System.IO.File]::WriteAllText` với `[Encoding]::UTF8`)
- HTML entities: `&lt;` `&gt;` `&amp;`
- Newline: `&#xa;` hoặc `<br/>`
- Quotes: `&quot;`
- Apostrophe: `&#39;` hoặc `&apos;`

## 12. Validation trước export

```powershell
[xml]$doc = Get-Content path/to/file.drawio
```

## 13. Sequence diagram (lifeline + message toạ độ tường minh)

Cách vẽ sequence ổn định nhất khi export CLI: dùng `umlLifeline` cho participant và vẽ
message bằng **edge toạ độ tường minh** (không nối vào cell), để kiểm soát chính xác vị trí y.

**Participant / lifeline** (actor thêm `participant=umlActor`):
```xml
<mxCell id="ll_qp" value="Xử lý hỏi-đáp"
  style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=0;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#dae8fc;strokeColor=#6c8ebf;fontFamily=Segoe UI;"
  vertex="1" parent="1">
  <mxGeometry x="380" y="30" width="120" height="550" as="geometry"/>
</mxCell>
```
- `container=0` để không cần bỏ message vào trong lifeline (tránh crop child).
- Tất cả lifeline cùng `y` và cùng `height`; center của lifeline = `x + width/2`.

**Message** = edge với `sourcePoint`/`targetPoint` cố định (x = center lifeline, y = mốc thời gian):
```xml
<mxCell id="m3" value="sinh vector câu hỏi"
  style="html=1;endArrow=block;endFill=1;startArrow=none;verticalAlign=bottom;fontFamily=Segoe UI;"
  edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="440" y="180" as="sourcePoint"/>
    <mxPoint x="610" y="180" as="targetPoint"/>
  </mxGeometry>
</mxCell>
```
- Return message: `endArrow=open;dashed=1;endFill=0`.
- Self-message: source và target cùng center, thêm `<Array as="points">` 2 điểm lệch phải để tạo vòng.
- `verticalAlign=bottom` để nhãn nằm trên đường.

**Combined fragment (alt/opt/loop)** = `umlFrame` (nhãn ở góc trái) + đường kẻ ngăn dashed:
```xml
<mxCell id="altf" value="alt  [đúng / sai]"
  style="shape=umlFrame;whiteSpace=wrap;html=1;width=110;height=26;fillColor=none;strokeColor=#999999;fontStyle=2;verticalAlign=top;align=left;fontFamily=Segoe UI;"
  vertex="1" parent="1"><mxGeometry x="240" y="225" width="380" height="165" as="geometry"/></mxCell>
<!-- divider giữa 2 nhánh -->
<mxCell id="divider" style="endArrow=none;dashed=1;html=1;strokeColor=#999999;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="332" as="sourcePoint"/><mxPoint x="620" y="332" as="targetPoint"/></mxGeometry></mxCell>
```

## 14. Box-text thay UML class/ERD shape (tránh crop hoàn toàn)

Với class diagram và ERD, thay vì swimlane/stack-layout (dễ bị crop khi export), có thể vẽ
mỗi lớp/thực thể bằng **một mxCell box** chứa tiêu đề + danh sách trường qua `&#10;` (newline),
căn trái trên:
```xml
<mxCell id="store" value="&lt;b&gt;VectorStore&lt;/b&gt;&#10;──────────────&#10;+ vector_search(vector, k)&#10;+ add_chunks(chunks, vectors)"
  style="verticalAlign=top;align=left;overflow=hidden;html=1;whiteSpace=wrap;rounded=0;fillColor=#d5e8d4;strokeColor=#82b366;spacingLeft=8;spacingTop=6;fontFamily=Segoe UI;"
  vertex="1" parent="1"><mxGeometry x="440" y="440" width="250" height="110" as="geometry"/></mxCell>
```
- Dùng `──────────────` làm đường ngăn tiêu đề ↔ thành viên (render ổn định hơn `<hr>`).
- Generalization (kế thừa): edge `endArrow=block;endFill=0` (tam giác rỗng), source = lớp con.
- Interface: ghi `«interface»` trong tiêu đề.
- Datastore: `shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=14` render đẹp cho ChromaDB/DB.

## 15. Checklist trước khi finalize

- [ ] Tất cả mxCell có `parent="1"`
- [ ] Render command có flag `--crop --border 20`
- [ ] Font dùng `<span style="...">` không phải `<font>`
- [ ] End nodes dùng ellipse
- [ ] Color coding nhất quán
- [ ] Có legend nếu diagram complex (>10 elements)
- [ ] Tiếng Việt có dấu đầy đủ
- [ ] Mở PNG xem tất cả 4 cạnh có đủ content không (đặc biệt sequence, ERD)

## Phát hiện draw.io khi render (Windows)

`tools/render-diagrams.mjs` (hàm `findDrawio`) tự dò draw.io theo thứ tự sau. Khi kiểm tra thủ công cũng nên theo đúng thứ tự này, đừng kết luận thiếu draw.io quá sớm:

1. Bản desktop:
   - `C:\Program Files\draw.io\draw.io.exe`
   - `C:\Program Files (x86)\draw.io\draw.io.exe`
   - `%LOCALAPPDATA%\Programs\draw.io\draw.io.exe`
2. Bản Microsoft Store (UWP): quét `C:\Program Files\WindowsApps\` tìm thư mục bắt đầu bằng `draw.io.draw.ioDiagrams`, dùng `...\app\draw.io.exe`.
3. Lệnh trên PATH: `where drawio` (Windows) / `which drawio` (macOS, Linux), thử cả `draw.io`.
4. macOS/Linux: `/Applications/draw.io.app/Contents/MacOS/draw.io`, `/usr/bin/drawio`, `/usr/local/bin/drawio`, `/snap/bin/drawio`.

Lưu ý quan trọng:
- Bản cài từ Microsoft Store KHÔNG tạo lệnh `drawio` trên PATH, nên `where drawio` trả về rỗng dù draw.io đã có. Phải quét thêm `WindowsApps`.
- Thư mục `WindowsApps` thường cần quyền cao để liệt kê; bọc trong try/catch và bỏ qua nếu lỗi. Tuy vậy file `draw.io.exe` bên trong vẫn chạy `--export` bình thường khi gọi bằng đường dẫn đầy đủ.
- Cách lấy nhanh đường dẫn bản Store: `Get-AppxPackage *draw.io* | Select InstallLocation` rồi nối thêm `app\draw.io.exe`.
