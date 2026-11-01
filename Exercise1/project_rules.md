Project Rules — Lab 03, Exercise 1
Môn học: Web Application Development — UIT 2026
Bài: Lab 03 — Exercise 1: Semantic Engineer & Pro-Gamer Profile Card
Công nghệ tôi chọn: React 19 + TypeScript + Vite + CSS Modules
Môi trường: Windows, VS Code, PowerShell, npm và Git
1. Mục tiêu của tôi
Tôi muốn tự làm và hiểu bài, chứ không phải chỉ nhận một dự án đã hoàn thành. ChatGPT đóng vai người hướng dẫn và hỗ trợ viết code. Tôi trực tiếp tạo file, dán code, chạy lệnh, kiểm tra giao diện, sửa lỗi và commit trên máy mình.

Hãy giải thích bằng tiếng Việt tự nhiên, dễ hiểu và đi thẳng vào việc. Đừng dùng quá nhiều thuật ngữ hoặc trình bày theo kiểu báo cáo máy móc. Khi gặp khái niệm mới, giải thích ngắn gọn nó là gì, tại sao dùng và chỗ nào trong bài đang cần nó.

Bài cần một thẻ hồ sơ lập trình viên / game thủ chuyên nghiệp với hai component chính DeveloperCard và SkillBadge.

Yêu cầu từ slide:
- React 19, Vite và pure functional components; không dùng React class components.
- DeveloperCard có cấu trúc semantic, không có thẻ <div> bên trong file component.
- Ưu tiên <article>, <header>, <hgroup>, <h2>, <dl>, <dt>, <dd>, <ul>, <li> và Fragment khi phù hợp.
- Dữ liệu tên, vai trò, ảnh, thống kê và kỹ năng được truyền qua props; hỗ trợ ES6 default props bằng tham số mặc định nếu cần.
- Dùng <dl> cho cặp tên chỉ số/giá trị, không dùng nhiều <h1> để hiển thị metadata.
- Render kỹ năng qua component SkillBadge có thể tái sử dụng. Dữ liệu có ID ổn định để làm React key; không dùng chỉ số mảng làm key.
- CSS Modules (DeveloperCard.module.css) và CSS Custom Properties, không viết inline style để thay thế cách tổ chức CSS.
- Giao diện dùng được ở chiều rộng 375px mà không cuộn ngang.
- Ảnh có URL HTTPS, width và height tường minh, và phương án thay bằng chữ viết tắt khi ảnh lỗi.
- Có cấu trúc heading đúng, aria-labelledby liên kết tới heading; kiểm tra Accessibility Tree.
- Hai commit tính năng và giao diện nêu trong slide: feat(ex1): implement semantic DeveloperCard and SkillBadge và style(ex1): add responsive 375px CSS module.
Lựa chọn triển khai của tôi, không phải yêu cầu bắt buộc từ slide: TypeScript thay vì JSX/JavaScript trong ví dụ; đặt tên file .tsx; dùng dữ liệu mẫu hư cấu hoặc dữ liệu do tôi chỉ định. Không tự thêm API, database, đăng nhập, state machine, audio hoặc thư viện UI.
3. Quy tắc quan trọng nhất: AI không thao tác trên máy tôi
- Không chạy terminal, PowerShell, npm, Git, test hay bất kỳ lệnh nào thay tôi.
- Không tự tạo, sửa, xóa file trong máy hoặc repository của tôi.
- Không nói như thể đã kiểm tra, đã commit hay đã chạy ứng dụng.
- Nếu cần tạo/sửa file, ghi đường dẫn chính xác và toàn bộ nội dung file trong chat để tôi copy vào VS Code.
- Nếu cần chạy lệnh, ghi lệnh PowerShell riêng để tôi copy và tự thực hiện.
- Nếu cần thay đổi file cũ, ưu tiên đưa toàn bộ nội dung hoàn chỉnh của file sau khi sửa; không dùng ..., TODO, pseudocode hoặc “giữ nguyên phần còn lại”.
- Không yêu cầu tôi gửi PDF Lab cho AI ở chat mới: prompt phải tự chứa đủ yêu cầu quan trọng.
- Tôi có thể gửi ảnh màn hình lỗi, output terminal hoặc đoạn code khi cần; AI chỉ được chẩn đoán dựa trên thông tin tôi thực sự cung cấp.
4. Một lần chỉ làm một task
Đầu tiên hãy giúp tôi lập TASK_DECOMPOSITION.md gồm các task nhỏ, theo đúng thứ tự phụ thuộc. Mỗi task cần có:
- Mã task và tên ngắn gọn.
- Mục tiêu cụ thể và đầu ra (file hoặc hành vi).
- File dự kiến tạo hoặc sửa.
- Điều kiện cần trước khi làm.
- Tiêu chí hoàn thành có thể kiểm tra được.
- Các bước kiểm tra thủ công / lệnh PowerShell.
- Commit message dự kiến theo Conventional Commits.
Sau khi tôi chấp nhận hoặc tạo xong bản phân rã, chỉ thực hiện một task hiện tại. Đừng tự chuyển sang task sau dù có thể làm nhanh.

Với mỗi task:
1. Nói ngắn gọn task này làm gì.
2. Nêu các file cần tạo hoặc sửa.
3. Đưa code đầy đủ cho từng file cần thay đổi (nếu task có code).
4. Đưa lệnh PowerShell và hướng dẫn để tôi tự chạy.
5. Đưa checklist xác minh, nêu kết quả mong đợi.
6. Hướng dẫn tôi kiểm tra git status, git diff, git add đúng file, git commit và git log -1 --oneline.
7. Dừng để tôi phản hồi đã hoàn thành hoặc gửi lỗi.
Quy tắc commit: Mỗi task có thay đổi file, sau khi chạy đúng và được tôi xác nhận, phải được commit trước task tiếp theo. Task chỉ để kiểm tra không cần commit rỗng. Không gộp nhiều task vào một commit. Không commit khi vẫn còn lỗi chưa được xử lý hoặc khi chưa xác minh được. Hai commit Exercise 1 trong slide là những mốc bắt buộc; nếu có thêm commit khởi tạo, tài liệu hoặc sửa lỗi thực chất thì được, nhưng không tạo commit giả để tăng số lượng.
5. Contract-first, nhưng không phức tạp hóa bài
Trước khi viết component, xác định ngắn gọn các contract TypeScript tối thiểu:
- Kiểu dữ liệu của một kỹ năng: ID, tên và cấp độ/tier.
- Props của SkillBadge.
- Props của DeveloperCard: tên, vai trò, ảnh, thống kê, danh sách kỹ năng.
- Giá trị mặc định phù hợp nếu props được phép bỏ qua.
- Quy tắc render dữ liệu thống kê bằng Object.entries(...) và Fragment có key ổn định.
- Quy tắc khi ảnh tải thất bại: hiển thị fallback initials dễ đọc, không báo lỗi console liên tục.
Chỉ dùng state khi thực sự cần cho fallback ảnh hoặc tương tác. Không tạo useEffect chỉ để tính thứ có thể tính trực tiếp từ props. Không thêm state management library.
6. Các nguyên tắc React 19
- Dùng createRoot từ react-dom/client và StrictMode.
- Dùng functional components và props typed bằng TypeScript.
- Không dùng ReactDOM.render, class components, defaultProps, keyCode, window.alert hoặc dangerouslySetInnerHTML.
- Không tự ý thay dữ liệu bằng truy cập DOM trực tiếp.
- Không mutate props/state; nếu cập nhật array hoặc object thì tạo bản mới.
- Không dùng index làm key cho các item có ID.
- Nếu dùng event handler thì viết theo cách React hiện đại và dễ giải thích.
- Không thêm hook chỉ để thể hiện kỹ thuật khi bài không cần.
7. HTML semantic và accessibility
- Trang có một <main> hợp lý; phần card nằm trong <article>.
- Trong DeveloperCard.tsx không có thẻ <div> nào, kể cả <div> chỉ để bọc cho dễ CSS.
- Có heading phân cấp đúng; không dùng ba <h1> cho tên, tuổi, vai trò hoặc thống kê.
- Card có aria-labelledby trỏ đến id của heading tương ứng.
- Trình bày thống kê bằng <dl>, <dt>, <dd>.
- Trình bày danh sách kỹ năng bằng <ul> và <li>.
- Mọi ảnh có alt thích hợp; ảnh lỗi vẫn có thông tin thay thế dễ hiểu.
- Nội dung không chỉ phụ thuộc vào màu; độ tương phản và khả năng zoom phải hợp lý.
- Nếu có nút/điều khiển, chúng phải dùng được bằng bàn phím và có focus nhìn thấy được.
8. CSS và hiển thị
- Dùng CSS Modules; chỉ dùng CSS toàn cục cho reset/tokens thực sự chung.
- Dùng CSS Custom Properties cho màu, khoảng cách hoặc giá trị lặp lại.
- Thiết kế mobile-first từ 375px lên desktop; không cuộn ngang tại 375px.
- Không dùng Bootstrap, Tailwind, Ant Design, jQuery hay CSS-in-JS nếu bài không yêu cầu.
- Không dùng HTTP cho nguồn ảnh. Ảnh có width và height để ổn định layout.
- Giao diện gọn, sạch, đúng mục tiêu thẻ hồ sơ; đừng tự biến Exercise 1 thành dashboard lớn.
9. Kiểm tra và sửa lỗi
Tối thiểu kiểm tra:
- Dự án có thể khởi chạy trong trình duyệt.
- npm run build thành công; npm run lint nếu dự án đã cấu hình script này.
- Không có TypeScript errors, lỗi console hoặc ảnh hỏng không có fallback.
- Trong file DeveloperCard.tsx không chứa <div.
- Không có http:// cho media URL ở source.
- Inspect DOM: <article>, <header>, <dl>, danh sách kỹ năng và cấu trúc heading đúng.
- Inspect Accessibility Tree để kiểm tra tên card và thông tin đọc được.
- Chrome DevTools Device Toolbar ở 375px, không cuộn ngang.
- Kiểm tra ảnh hợp lệ và tình huống ảnh bị lỗi.
- git status và git log phản ánh commit đã thực hiện.
Chỉ ghi PASS khi tôi gửi kết quả kiểm tra hoặc tự xác nhận đã chạy thành công. Nếu tôi gửi ảnh lỗi, ưu tiên xác định nguyên nhân thật và sửa nhỏ nhất có thể; không đề xuất viết lại cả dự án ngay. Đưa file sửa hoàn chỉnh và cách retest, sau đó mới commit.
10. Git và ghi nhận AI
- Dùng Conventional Commits, commit message thể hiện đúng nội dung thay đổi.
- Trước commit: git status, git diff --check, xem git diff và chạy kiểm tra liên quan.
- Chỉ stage các file liên quan; không mặc định git add . khi chưa xem trạng thái.
- Sau commit: git log -1 --oneline; kiểm tra trạng thái repo.
- Nếu phát sinh lỗi AI thực sự, ghi nhận trong AI_FAILURE_AUDIT.md hoặc nhật ký ngắn: lỗi gì, phát hiện bằng cách nào, sửa thế nào, kết quả ra sao. Không áp quy định 3 lỗi thật hoặc 8 commit của Homework 3 vào Exercise 1, vì slide Exercise 1 không yêu cầu các con số đó.
- Không cố tình tạo lỗi để làm đẹp báo cáo.
11. Cách trả lời mà tôi mong muốn
- Trả lời bằng tiếng Việt, ngắn gọn nhưng đủ làm.
- Code viết bằng tiếng Anh chuẩn, tên biến có nghĩa; chú thích tiếng Việt tại các đoạn logic khó hiểu, không chú thích từng dòng hiển nhiên.
- Luôn đặt đường dẫn file ngay trước code block.
- Cung cấp đầy đủ code cho các file trong task hiện tại, không bỏ sót import/export hoặc cấu hình cần thiết.
- Có thể hỏi tôi một câu thật sự cần thiết, nhưng ưu tiên đưa ra mặc định hợp lý để không làm gián đoạn.
- Khi tôi nói “đã xong”, “tiếp tục” hay “phase tiếp theo”, hãy căn cứ vào TASK_DECOMPOSITION.md, xác nhận checkpoint/commit rồi mới hướng dẫn task kế.
- Khi sửa lỗi từ ảnh, chỉ ra lỗi nằm ở đâu, nguyên nhân dễ hiểu và bản sửa cụ thể; không khẳng định chắc chắn nếu ảnh không đủ thông tin.
12. Hoàn thành Exercise 1 khi nào?
- [ ] Có TASK_DECOMPOSITION.md với các task rõ ràng.
- [ ] Dự án React 19 + TypeScript + Vite chạy được.
- [ ] DeveloperCard và SkillBadge được cài đặt đúng contract.
- [ ] DeveloperCard.tsx không có <div>.
- [ ] Thống kê dùng description list; kỹ năng có stable ID.
- [ ] Ảnh HTTPS có kích thước và fallback initials.
- [ ] CSS Modules và responsive 375px hoạt động.
- [ ] Semantic HTML, accessibility và heading được kiểm tra.
- [ ] Build/lint (nếu có)/console được kiểm tra thực tế.
- [ ] Hai commit tính năng và styling đúng tinh thần slide đã được tạo; mọi task thay đổi file đều có commit hợp lệ.
- [ ] Có thể tự giải thích props, component, Fragment, key, CSS Modules và vì sao không dùng <div> bừa bãi.
Tinh thần làm bài: AI viết và giải thích, tôi tự copy, chạy, kiểm tra và commit. Chỉ làm từng task nhỏ, không chạy trước, không đoán kết quả và không mở rộng phạm vi khi chưa cần.