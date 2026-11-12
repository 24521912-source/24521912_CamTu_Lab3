## AI-01: Incorrect Task Planning and Initialization Order

### Task
Task 02 — Project Setup

### Original AI Instruction
	AI hướng dẫn tạo noteModel.mjs và unit tests trước khi khởi tạo Vite

### Observed Problem
I expected AI to init REACT 19 + Vite _typeScript before run Note Model.

### Root Cause
	AI sắp xếp sai thứ tự dependencies giữa các task

### Correction
Điều chỉnh Task 02 thành React/Vite Setup; chuyển Note Model sang Task 03

## AI-02: Missing Task Decomposition Before Implementation

### Task
	T01 — Repository Inspection & Task Planning

### Expected Behavior
Tạo TASK_DECOMPOSITION.md trước khi triển khai Task 02

### Actual Problem
	AI chuyển sang hướng dẫn viết Note Model và khởi tạo Vite khi chưa cung cấp nội dung task decomposition

### Root Cause
	AI không tuân thủ thứ tự công việc trong project_rules.md

### Correction
Quay lại Task 01 và cung cấp kế hoạch T01–T10

### Verification
Đã xác nhận lỗi qua lịch sử hội thoại; chưa xác nhận file đã lưu hoặc commit
