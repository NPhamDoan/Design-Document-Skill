# Cấu trúc tài liệu thiết kế (17 chương + phụ lục)

Theo mẫu **Software Engineering Project Report** (SDD chuẩn cho đồ án), phủ đủ các *design
viewpoint* của IEEE 1016-2009 và traceability của ISO/IEC/IEEE 42010.

> **NGUYÊN TẮC BAO TRÙM — ĐẦY ĐỦ, KHÔNG GIỚI HẠN SỐ LƯỢNG:**
> - Tài liệu phải phủ **mọi chương và mọi mục** dưới đây. Mục nào dự án thực sự không có thì ghi rõ
>   "Không áp dụng — <lý do>", KHÔNG bỏ trống hay lược đi.
> - Mọi con số trong template ("2-3", "5 module", "10 bảng") chỉ là ví dụ. **Luôn làm theo số lượng
>   THỰC TẾ**: đặc tả TẤT CẢ use case, TẤT CẢ endpoint API, TẤT CẢ bảng/cột dữ liệu, TẤT CẢ
>   module/lớp, TẤT CẢ luồng chính. Không cắt bớt vì "chọn cái quan trọng".
> - Mỗi diagram bắt buộc kèm **bảng mô tả** đầy đủ mọi thành phần (mỗi dòng = 1 phần tử) + số hiệu
>   hình ("Hình X-Y").
> - Mỗi phần tử phải **truy vết được** (chương 15): FR → UC → analysis → design → code → test.
> - Giới hạn "2-3" / "một vài" (nếu có) CHỈ áp dụng cho **số DIAGRAM vẽ ra** (tiết kiệm công render),
>   KHÔNG áp dụng cho phần chữ/bảng: use case, FR, từ điển dữ liệu, module/lớp phải liệt kê HẾT.
>   Nhóm phần tử cùng dạng có thể viết gọn + tham chiếu "tương tự X" nhưng không được bỏ sót mục nào.
> - Người dùng yêu cầu trọng tâm chủ đề nào thì viết chủ đề đó SÂU hơn, vẫn giữ ĐẦY ĐỦ các mục còn lại.

## Ánh xạ IEEE 1016 viewpoint → chương

| Viewpoint (IEEE 1016) | Chương |
|---|---|
| Context | 2.2 |
| Composition / Structure | 6.5, 6.6 |
| Logical (class) | 5.3, 7.2, 7.3 |
| Dependency | 6.6, 7.4 |
| Information | 5.1, 8 |
| Interface | 9 |
| Interaction | 5.5, 7.6 |
| State dynamics | 7.7 |
| Patterns use | 7.5 |
| Algorithm | 12.3 (chi tiết xử lý cốt lõi) |
| Resource | 10.1, 10.2, 14 |
| Design rationale | 6.2, 7.5, 16 |

---

## Trang bìa & phần đầu (front matter)
- Tên báo cáo ("BÁO CÁO ĐỒ ÁN KỸ THUẬT PHẦN MỀM"), tên dự án, môn học, phiên bản, ngày.
- **Thành viên nhóm** (bảng: STT / MSSV / họ và tên / vai trò) + giảng viên hướng dẫn.
- **MỤC LỤC**, **DANH MỤC HÌNH**, **DANH MỤC BẢNG** (sinh tự động theo Heading style trong Word).
- **DANH MỤC TỪ VIẾT TẮT** (bảng: từ viết tắt / ý nghĩa) — SRS, SDD, UML, API, UI, DB...

> Mẫu chuẩn tiếng Việt của tổ chức: xem steering `.kiro` "BÁO CÁO ĐỒ ÁN KỸ THUẬT PHẦN MỀM"
> (đầy đủ nhãn mục + bảng mẫu). Cấu trúc dưới đây khớp 1-1 với mẫu đó.

## Chương 1 — GIỚI THIỆU
- 1.1 Bối cảnh (background, ngữ cảnh dự án).
- 1.2 Phát biểu bài toán (vấn đề hệ thống giải quyết).
- 1.3 Mục tiêu dự án (danh sách mục tiêu).
- 1.4 Phạm vi: **Trong phạm vi** / **Ngoài phạm vi**.
- 1.5 Các bên liên quan (bảng: bên liên quan / mô tả / mối quan tâm) — *stakeholders & concerns, IEEE 1016*.
- 1.6 Định nghĩa / thuật ngữ.

## Chương 2 — TỔNG QUAN DỰ ÁN
- 2.1 Góc nhìn sản phẩm (hệ thống nằm ở đâu trong môi trường tổng thể).
- 2.2 Bối cảnh hệ thống + **Sơ đồ ngữ cảnh** (Context Diagram, "Hình 2-1") + bảng mô tả actor/hệ thống ngoài.
- 2.3 Tính năng hệ thống (bảng F-01..F-N: tính năng / mô tả).
- 2.4 Tổng quan công nghệ (bảng: hạng mục / công nghệ).

## Chương 3 — ĐẶC TẢ YÊU CẦU
- 3.1 Yêu cầu chức năng: bảng FR-01..N (mức ưu tiên) **+ đặc tả từng FR**: mô tả, đầu vào, xử lý, đầu ra, business rules.
- 3.2 Yêu cầu phi chức năng (bảng NFR: hiệu năng / bảo mật / tin cậy / bảo trì / khả dụng).
- 3.3 Quy tắc nghiệp vụ (bảng BR-01..N).
- 3.4 Ràng buộc hệ thống.
- 3.5 Giả định.

## Chương 4 — PHÂN TÍCH USE CASE
- 4.1 Tác nhân (bảng: actor / mô tả).
- 4.2 **Sơ đồ Use Case** ("Hình 4-1") + bảng quan hệ include/extend.
- 4.3 Danh sách Use Case (bảng UC-01..N: use case / actor / mô tả).
- 4.4 **Đặc tả TẤT CẢ Use Case** — mỗi UC: primary actor, goal, tiền/hậu điều kiện, kịch bản
  chính (bảng bước: actor ↔ hệ thống), luồng thay thế (Ax), luồng ngoại lệ (Ex), business rules
  liên quan, yêu cầu liên quan (FR). UC đơn giản lặp lại có thể theo mẫu gọn nhưng vẫn phải đủ mọi UC.

## Chương 5 — PHÂN TÍCH HỆ THỐNG
- 5.1 Mô hình miền (domain model) + **Sơ đồ Domain Model** ("Hình 5-1").
- 5.2 Lớp phân tích (bảng: lớp / trách nhiệm).
- 5.3 **Sơ đồ lớp phân tích** ("Hình 5-2").
- 5.4 **Activity diagram cho MỌI luồng nghiệp vụ chính** (mỗi UC/luồng 1 sơ đồ) + bảng bước/lane.
- 5.5 **System Sequence Diagram (SSD)** cho các UC chính.

## Chương 6 — KIẾN TRÚC PHẦN MỀM
- 6.1 Tổng quan kiến trúc.
- 6.2 Mẫu kiến trúc (Layered / MVC / Clean / Hexagonal...) + **lý do chọn** (*design rationale*).
- 6.3 **Sơ đồ kiến trúc** ("Hình 6-1") + bảng mô tả tier/thành phần.
- 6.4 Các tầng hệ thống (Presentation / Application-Service / Domain / Infrastructure) — trách nhiệm từng tầng.
- 6.5 **Sơ đồ Component** ("Hình 6-2") + provided/required interface.
- 6.6 Cấu trúc module (bảng: module / trách nhiệm / phụ thuộc).

## Chương 7 — THIẾT KẾ CHI TIẾT
- 7.1 Tổng quan thiết kế (analysis model → design model).
- 7.2 **Sơ đồ lớp thiết kế** ("Hình 7-1") — đầy đủ chi tiết.
- 7.3 Đặc tả lớp — cho **TẤT CẢ lớp thiết kế**: mục đích, bảng thuộc tính (tên/kiểu/visibility/mô tả),
  bảng phương thức (tên/tham số/kiểu trả về/mô tả), quan hệ.
- 7.4 Thiết kế interface — mỗi interface: mục đích, bảng phương thức.
- 7.5 **Mẫu thiết kế** (*patterns use viewpoint*) — mỗi mẫu: pattern, problem, solution, participants,
  sơ đồ mẫu, cách hiện thực, lợi ích, đánh đổi, FR/UC liên quan.
- 7.6 **Sequence diagram** cho các UC chính + mô tả tương tác từng bước.
- 7.7 **State diagram** cho entity có vòng đời + bảng trạng thái.

## Chương 8 — THIẾT KẾ DỮ LIỆU
- 8.1 Mô hình dữ liệu.
- 8.2 **ERD** ("Hình 8-1") — Crow's foot (chi tiết quy tắc: `erd-rules.md`).
- 8.3 Lược đồ CSDL — cho **TẤT CẢ bảng**: bảng cột (tên / kiểu / ràng buộc / mô tả).
- 8.4 Từ điển dữ liệu (bảng: entity / attribute / type / mô tả) — đủ mọi thực thể.
- 8.5 Kiểm tra hợp lệ dữ liệu (validation + ràng buộc DB).

## Chương 9 — THIẾT KẾ GIAO DIỆN
- 9.1 Giao diện người dùng — mỗi màn hình: hình, mục đích, kiểm tra đầu vào.
- 9.2 Thiết kế API — cho **TẤT CẢ endpoint**: mục đích, auth, request, response, bảng HTTP status.
- 9.3 Giao diện ngoài (bảng: hệ thống / interface / mục đích).

## Chương 10 — THIẾT KẾ CHẤT LƯỢNG & BẢO MẬT
- 10.1 Hiệu năng. 10.2 Khả năng mở rộng. 10.3 Độ tin cậy. 10.4 Khả năng bảo trì.
- 10.5 Bảo mật: xác thực, phân quyền (bảng role/permission), bảo vệ dữ liệu (mã hoá, hashing, HTTPS).
- 10.6 Khả năng kiểm thử.

## Chương 11 — XỬ LÝ LỖI & LOGGING
- 11.1 Chiến lược xử lý lỗi. 11.2 Validation. 11.3 Mã lỗi (bảng ERR-xxx). 11.4 Logging.

## Chương 12 — HIỆN THỰC
- 12.1 Môi trường phát triển (bảng: thành phần / phiên bản-công nghệ).
- 12.2 Cấu trúc thư mục dự án.
- 12.3 Các hiện thực quan trọng — mô tả + trích code cốt lõi + **thuật toán cốt lõi**
  (*algorithm viewpoint*: pseudocode/các bước + độ phức tạp).
- 12.4 Hiện thực mẫu thiết kế (từ chương 7 → source).

## Chương 13 — KIỂM THỬ
- 13.1 Chiến lược. 13.2 Unit test. 13.3 Integration. 13.4 System.
- 13.5 Test case (bảng TC-xxx: requirement / UC / tiền điều kiện / dữ liệu / kỳ vọng / thực tế / trạng thái).
- 13.6 Tổng kết kiểm thử (bảng: loại / tổng / pass / fail).

## Chương 14 — TRIỂN KHAI
- 14.1 **Sơ đồ triển khai** ("Hình 14-1"). 14.2 Môi trường triển khai (bảng). 14.3 Quy trình triển khai.

## Chương 15 — TRUY VẾT (Traceability)
- 15.1 FR → UC. 15.2 UC → analysis class. 15.3 Analysis → design. 15.4 Design → code. 15.5 FR → test case.
- Trình bày dạng bảng, phủ đủ mọi FR/UC.

## Chương 16 — QUYẾT ĐỊNH THIẾT KẾ & ĐÁNH GIÁ (Design rationale — IEEE 1016)
- 16.1 Các phương án thiết kế (mỗi quyết định: problem, alternative 1/2...).
- 16.2 Phương án được chọn. 16.3 Lý do. 16.4 Đánh đổi (ưu/nhược). 16.5 Hạn chế. 16.6 Hướng phát triển.

## Chương 17 — KẾT LUẬN
- 17.1 Tóm tắt. 17.2 Mức đạt mục tiêu (bảng: mục tiêu / kết quả). 17.3 Bài học.

## TÀI LIỆU THAM KHẢO
- IEEE 1016, ISO/IEC/IEEE 42010, UML spec, và nguồn khác.

## PHỤ LỤC (đưa phần chi tiết dài xuống đây để thân bài gọn)
- A — Đặc tả use case đầy đủ (bổ sung). B — Sơ đồ UML bổ sung. C — Đặc tả API đầy đủ.
- D — Lược đồ CSDL đầy đủ. E — Test case đầy đủ. F — Giao diện (thêm ảnh). G — Cấu trúc mã nguồn.

---

## Danh sách diagram tối thiểu (theo 17 chương)

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

> Số file **tăng theo dự án**: có bao nhiêu luồng chính thì bấy nhiêu activity/sequence, có bao nhiêu
> entity có vòng đời thì bấy nhiêu state diagram. Không giới hạn ở danh sách trên.
