# Hệ thống Đặt Cơm A&E

Web app đặt suất ăn cho nhân viên A&E, tối ưu thao tác nhanh trên điện thoại và dễ triển khai công khai qua GitHub Pages.

## Tổng quan

Dự án giúp nhân viên đăng nhập bằng mã nhân viên, chọn suất ăn theo từng ngày trong tuần kế tiếp, rồi gửi đăng ký lên Google Sheets thông qua Google Apps Script API.

- Frontend: HTML/CSS/JavaScript thuần, responsive, tải nhanh
- Backend: Google Apps Script (Web App API)
- Dữ liệu: Google Sheets (dễ vận hành, dễ kiểm tra)
- Hosting: GitHub Pages

## Điểm hấp dẫn

- Truy cập trực tiếp bằng trình duyệt, không cần cài app
- Giao diện mobile-first, thao tác rõ ràng theo từng ngày
- Luồng nhập liệu có ràng buộc thông minh (ca -> bữa -> món)
- UX tối giản: đăng nhập nhanh, thông báo toast, trạng thái xử lý rõ ràng
- Có thể mở rộng cho quản trị, báo cáo, thống kê

## Chức năng chính

1. Đăng nhập bằng mã nhân viên
2. Hiển thị khung đăng ký cho tuần kế tiếp
3. Chọn ngày nghỉ Có/Không cho từng ngày
4. Chọn:
   - Ca làm việc
   - Bữa ăn chính
   - Món ăn
   - Đăng ký bữa làm thêm (tùy chọn)
5. Kiểm tra dữ liệu trước khi gửi đăng ký
6. Chặn đăng ký trùng (đã đăng ký thì không cho đăng ký lại)
7. Ghi dữ liệu đơn hàng vào Google Sheets

## Lợi ích mang lại

- Giảm thao tác thủ công trên file rời rạc
- Chuẩn hóa dữ liệu đăng ký suất ăn theo tuần
- Dễ truy vết, dễ đối soát, dễ tổng hợp
- Triển khai nhanh, chi phí thấp, dễ bảo trì
- Phù hợp môi trường vận hành sản xuất (cần ổn định, dễ dùng)

## Giao diện

- Màn hình Login gọn gàng, tập trung vào một hành động chính
- Màn hình Đặt cơm theo thẻ (card) cho từng ngày
- Màu sắc thân thiện, nhận diện rõ trạng thái
- Thích ứng tốt trên mobile và desktop

## Cấu trúc dự án

- index.html: giao diện + logic frontend
- google-apps-script/Code.gs: API backend cho bootstrap/login/submit
- google-apps-script/README.md: hướng dẫn setup Apps Script và deploy chi tiết

## Cách chạy nhanh

1. Mở file index hoặc deploy lên GitHub Pages
2. Cấu hình API_BASE_URL trong index.html trỏ đến Web App URL của Apps Script
3. Đảm bảo Google Sheet đủ các sheet dữ liệu: employees, udc, shifts, meals, menus, ordered, orders

## Deploy

- GitHub Pages URL mặc định:
  - https://aevndyeing.github.io/mealbooking/

Thông tin setup backend xem tại:
- google-apps-script/README.md

## Đối tượng sử dụng

- Nhân viên đăng ký suất ăn
- Người vận hành/quản trị theo dõi kết quả đăng ký

## Định hướng mở rộng

- Thêm màn hình admin quản trị menu/ca
- Báo cáo tổng hợp theo ngày, bộ phận, ca
- Tích hợp thông báo nhắc hạn đăng ký
- Phân quyền theo vai trò

## AI Assistance

README này được soạn thảo với sự hỗ trợ của AI (GitHub Copilot), sau đó được rà soát và chỉnh sửa theo nhu cầu thực tế của dự án.
