# Cấu trúc tài liệu thiết kế (7 phần)

Tham khảo theo Software Design Document chuẩn cho đồ án sinh viên.

> ## NGUYÊN TẮC ĐỘ ĐẦY ĐỦ (đọc trước khi viết tài liệu)
>
> Tài liệu phải ĐẦY ĐỦ, không rút gọn kiểu "làm vài mục tiêu biểu":
> - Use case (2.1-B): đặc tả HẾT mọi UC, không chỉ 2-3.
> - Yêu cầu chức năng (3.1): liệt kê HẾT (FR-01..FR-N).
> - Từ điển dữ liệu (6.4): đặc tả HẾT mọi bảng, đủ cột từng bảng.
> - Component/class (5.1, 6.1): phủ HẾT module/lớp chính.
> - Nhóm phần tử cùng dạng: vẫn tách từng mục, được viết gọn + tham chiếu "tương tự X", nhưng KHÔNG bỏ sót.
> - Giới hạn "2-3"/"một vài" CHỈ áp dụng cho SỐ DIAGRAM vẽ ra (tiết kiệm công render), KHÔNG áp dụng cho phần chữ/bảng.
> - Người dùng yêu cầu trọng tâm chủ đề nào thì viết chủ đề đó SÂU hơn, nhưng vẫn giữ ĐẦY ĐỦ các mục còn lại.

> **Ánh xạ chuẩn IEEE 1016-2009 (Software Design Description):** cấu trúc 7 phần dưới đây phủ các
> *design viewpoint* của IEEE 1016. Ánh xạ + các mục BỔ SUNG để phủ đủ chuẩn:
>
> | Viewpoint (IEEE 1016) | Nằm ở phần |
> |---|---|
> | Context | 1.3, 2.1 |
> | Composition / Structure | 4.3, 5.1 |
> | Logical | 6.1 (class) |
> | Dependency | 5.1-B (interface/coupling) |
> | Information | 2.3, 5.3, 6.4 |
> | Interface | 3.3 (UI), 5.2 (API) |
> | Interaction | 6.2 (sequence) |
> | State dynamics | 6.x (state) |
> | **Patterns use** | 5.5 (bổ sung) |
> | **Algorithm** | 6.5 (bổ sung) |
> | **Resource** | 4.4 (bổ sung) |
>
> Bắt buộc kèm: **Phần 0 Định danh + Lịch sử thay đổi + Tài liệu tham khảo + Thuật ngữ**,
> **Stakeholders & mối quan tâm** (1.2), **Design rationale** (4.3-B, để BẮT BUỘC).

## PHẦN 0: ĐỊNH DANH TÀI LIỆU (SDD Identification — IEEE 1016)
- Tên tài liệu, tên dự án, phiên bản, ngày ban hành, tác giả, trạng thái.
- **Lịch sử thay đổi** (bảng: phiên bản / ngày / người sửa / mô tả thay đổi).
- **Tài liệu tham khảo** (SRS, chuẩn áp dụng, tài liệu liên quan).
- **Thuật ngữ & viết tắt** (glossary).
- Mục lục.

## PHẦN 1: TẦM NHÌN VÀ BỐI CẢNH (Project Vision & Context)

### 1.1 Tầm nhìn dự án (DOC 1.1-A: Project Vision Document)
- Mục tiêu hệ thống
- Phạm vi (làm gì, không làm gì)
- Lý do xây dựng

### 1.2 Người dùng và các bên liên quan
- DOC 1.2-A: User Personas Document (2-3 personas điển hình)
- DOC 1.2-B: Stakeholder Register + **mối quan tâm thiết kế** (design concerns)
  - Bảng: bên liên quan / vai trò / **mối quan tâm** (điều họ cần đảm bảo ở thiết kế)
  - IEEE 1016 yêu cầu nêu rõ concerns để các design view giải quyết chúng

### 1.3 Bối cảnh hệ thống (DOC 1.3-A: System Context Diagram)
- **Diagram**: Context diagram (`01-context-diagram.drawio`)
- Bảng mô tả: actor, system, external storage, file system

## PHẦN 2: MÔ HÌNH HÓA NGHIỆP VỤ (Business Modeling)

### 2.1 Mô hình Use Case
- DOC 2.1-A: Use Case Diagram (`02-usecase.drawio`)
  - Actors: tất cả người dùng
  - Use cases: tất cả chức năng chính (UC-01 đến UC-N)
  - Quan hệ include / extend
- DOC 2.1-B: Use Case Specifications — ĐẶC TẢ ĐẦY ĐỦ TẤT CẢ use case (UC-01..UC-N), KHÔNG chỉ 2-3 UC. Mỗi UC có mục riêng; UC dạng CRUD giống nhau được viết gọn + tham chiếu "tương tự UC-X" nhưng KHÔNG bỏ sót
  - Actor, mô tả, điều kiện trước/sau
  - Luồng chính (numbered steps)
  - Luồng phụ (alternative flows)

### 2.2 Sơ đồ quy trình (DOC 2.2-A: Process Flow Diagrams)
- Activity diagrams cho TẤT CẢ luồng nghiệp vụ chính (phần mô tả bằng bảng phủ đầy đủ; số diagram vẽ ra có thể giới hạn ở luồng tiêu biểu)
- Mỗi diagram: 2 swimlanes (User / Backend)
- Bảng mô tả: bước, lane, hành động, ghi chú

### 2.3 Mô hình dữ liệu khái niệm (DOC 2.3-A: Conceptual ERD)
- **Diagram**: `05-erd-conceptual.drawio`
- Sử dụng Crow's foot notation
- Phân loại entity: Core / Reference / Supporting
- KHÔNG có FK columns, KHÔNG có data types vật lý
- Chi tiết quy tắc xem `erd-rules.md`

## PHẦN 3: ĐẶC TẢ YÊU CẦU (Requirements Specification)

### 3.1 Yêu cầu chức năng (DOC 3.1-A: Functional Requirements List)
Bảng FR-01 đến FR-N với cột:
- ID (FR-01, FR-02...)
- Chức năng
- Mô tả ngắn

### 3.2 Yêu cầu phi chức năng (DOC 3.2-A: Non-Functional Requirements)
Bảng NFR theo các tiêu chí:
- Hiệu năng (performance)
- Bảo mật (security)
- Bảo trì (maintainability)
- Mở rộng (scalability)
- Khả dụng (availability)

### 3.3 Phác thảo giao diện (Wireframes) — TÙY CHỌN
- DOC 3.3-A: UI Wireframes Document (low-fidelity)
- DOC 3.3-B: Navigation Flow Diagram
- Có thể bỏ qua nếu không có thời gian

### 3.4 Ma trận ưu tiên yêu cầu (MoSCoW)
- Must have
- Should have
- Could have
- Won't have

## PHẦN 4: KIẾN TRÚC TỔNG THỂ (High-Level Architecture)

### 4.1 Động lực kiến trúc (DOC 4.1-A: Architectural Drivers)
Bảng các yếu tố kiến trúc với:
- Yếu tố (đơn giản / dễ deploy / mở rộng / hiệu năng)
- Yêu cầu cụ thể
- Cách giải quyết (kiến trúc, pattern, công nghệ)

### 4.2 Lựa chọn Technology Stack (DOC 4.2-A)
Bảng công nghệ với:
- Thành phần (Backend, Frontend, DB...)
- Công nghệ được chọn
- Lý do chọn

### 4.3 Kiến trúc hệ thống
- DOC 4.3-A: System Architecture Diagram (`06-architecture.drawio`)
  - Phân tier: Client / Gateway / Service / Data
  - Bảng mô tả: tier, thành phần, vai trò
- DOC 4.3-B: ADRs (Architecture Decision Records) — **Design Rationale (IEEE 1016, BẮT BUỘC)**
  - 3-5 quyết định kiến trúc quan trọng
  - Format: Context / Decision / Consequences (vì sao chọn, đánh đổi, phương án loại bỏ)

### 4.4 Tài nguyên & hiệu năng (DOC 4.4-A: Resource viewpoint — IEEE 1016)
Bảng ngân sách tài nguyên (giúp đánh giá khả thi vận hành):
- Bộ nhớ (RAM cho model/cache), CPU/GPU
- Luồng/đồng thời (thread, worker, connection pool)
- Ngân sách thời gian/độ trễ mỗi thao tác chính
- Giới hạn ngoài (quota API, rate limit, kích thước file)

## PHẦN 5: KIẾN TRÚC COMPONENT & DỮ LIỆU (Component & Data Architecture)

### 5.1 Thiết kế Component
- DOC 5.1-A: Component Diagram (`07b-component-diagram.drawio`)
  - 4 layers: Frontend / Gateway / Service / Data
  - Provided / Required interfaces giữa components
- DOC 5.1-B: Component Responsibility Matrix
  - Bảng module: Controller / Service / Interface / Repository

### 5.2 Thiết kế API (DOC 5.2-A: API Specification)
Bảng endpoints theo nhóm:
- Auth APIs (POST /auth/login, /auth/refresh...)
- Business APIs (POST /resource, GET /resource...)
- Admin APIs
Mỗi endpoint: Method, Path, Mô tả, Auth required?

Bảng status codes: 200, 201, 400, 401, 403, 404, 409, 500

### 5.3 Kiến trúc cơ sở dữ liệu vật lý
- DOC 5.3-A: Physical ERD (`08-erd-physical.drawio`)
  - Hiển thị FK columns, data types, constraints
  - Mũi tên 1:N với CASCADE/RESTRICT
- DOC 5.3-B: Database Schema Specification
  - Bảng tổng quan: tên bảng, mục đích, PK, ghi chú
  - Bảng chi tiết LichSuCapNhat hoặc bảng audit nếu có

### 5.4 Thiết kế Bảo mật (DOC 5.4-A: Security Design)
- Authentication (JWT, cookie session, OAuth...)
- Authorization (vai trò, RBAC)
- Password hashing (bcrypt, argon2)
- Rate limiting
- Input validation
- HTTPS, CORS

### 5.5 Mẫu thiết kế (DOC 5.5-A: Design Patterns — Patterns use viewpoint, IEEE 1016)
Bảng các mẫu thiết kế áp dụng:
- Tên mẫu (Strategy, Factory, Repository, Pipeline, Adapter...)
- Nơi áp dụng trong hệ thống
- Vấn đề mẫu giải quyết

## PHẦN 6: THIẾT KẾ CHI TIẾT (Detailed Design - LLD)

### 6.1 Thiết kế Lớp (DOC 6.1-A: Detailed Class Diagrams)
- **Diagram chính**: `07a-class-diagram-<main>.drawio` (module quan trọng nhất, full chi tiết)
  - Controller, Service, Interfaces, Repositories
  - Domain entities (data models)
  - Error hierarchy
  - Quan hệ: uses, depends on, implements, extends, throws
- **Diagram phụ**: `07-class-diagram.drawio` (5 module còn lại, compact)

### 6.2 Sơ đồ Tuần tự (DOC 6.2-A: Sequence Diagrams)
3 sequence diagrams:
- `09-sequence-<flow1>.drawio` — luồng chính (tạo entity)
- `10-sequence-<auth>.drawio` — luồng auth/refresh token (có alt cases)
- `11-sequence-<flow2>.drawio` — luồng phụ (cập nhật + audit)

Mỗi diagram có bảng mô tả messages: từ ai → đến ai → message → ghi chú

### 6.3 Thiết kế UI High-Fidelity — TÙY CHỌN
Bỏ qua nếu không có Figma mockups

### 6.4 Chi tiết CSDL (DOC 6.4-A: Complete Data Dictionary)
BẮT BUỘC đặc tả TẤT CẢ bảng trong CSDL (không bỏ sót, không rút gọn "vài bảng tiêu biểu"); số bảng đúng theo lược đồ thực tế. Cho MỖI bảng:
- Bảng cột với: tên cột, kiểu dữ liệu, ràng buộc (PK, FK, UNIQUE, NOT NULL, CHECK), mô tả nghiệp vụ

### State Diagram (nếu có entity với lifecycle)
- `12-state-<entity>.drawio` — sơ đồ trạng thái cho entity chính (HoSo, Order, Ticket...)
- Bảng mô tả trạng thái: tên, ý nghĩa, transitions

### 6.5 Thiết kế thuật toán (DOC 6.5-A: Algorithm viewpoint — IEEE 1016)
Cho các xử lý cốt lõi (không hiển nhiên) — mô tả bằng pseudocode/các bước + độ phức tạp:
- Thuật toán chính (vd xếp hạng/tìm kiếm, hợp nhất, tính toán nghiệp vụ)
- Tham số + điều kiện biên
- Độ phức tạp / lưu ý hiệu năng

## PHẦN 7: TRIỂN KHAI & TEST (Implementation & Testing)

### 7.1 Phân chia công việc (WBS)
Bảng sprints:
- Sprint 1-N
- Nội dung mỗi sprint
- Kết quả/output cuối sprint

### 7.2 Xử lý lỗi (DOC 7.2-A: Error Handling)
- Lớp validation backend
- DomainError hierarchy
- Try-catch tổng ở controller
- Frontend Axios interceptor

### 7.3 Rủi ro và xử lý (Risk Register)
Bảng rủi ro với:
- Mô tả rủi ro
- Mức độ (Cao / Trung bình / Thấp)
- Cách xử lý

### 7.4 Tiêu chuẩn lập trình (Coding Standards) — TÙY CHỌN
- Quy ước tên file, biến
- Code style (Prettier, ESLint config)

### 7.5 Kết luận
- Đã hoàn thành các chức năng
- Hạn chế còn tồn tại
- Hướng phát triển tương lai
