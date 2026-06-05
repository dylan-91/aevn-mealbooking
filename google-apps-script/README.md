# Google Apps Script Setup

## 1) Create Google Sheet
- Create one Google Spreadsheet.
- Create sheets with exact names:
  - employees
  - udc
  - shifts
  - meals
  - menus
  - ordered
  - orders
- Use the same column structure you already have in db.xlsx/orders.xlsx.

## 2) Create Apps Script project
- Open https://script.new
- Replace default code with content from Code.gs
- Save project

## 3) Add Script Property
- In Apps Script: Project Settings -> Script Properties
- Add key: SPREADSHEET_ID
- Value: the Spreadsheet ID from your Google Sheet URL

## 4) Deploy Web App
- Deploy -> New deployment -> Web app
- Execute as: Me
- Who has access: Anyone
- Deploy and copy Web App URL

## 5) Update frontend config
- Open index.html
- Set API_BASE_URL to your Web App URL
- Example:
  const API_BASE_URL = "https://script.google.com/macros/s/xxxx/exec";

## 6) Notes
- API_BASE_URL is required. If missing, login is blocked.
- This setup is designed for multi-user use on GitHub Pages.
- Re-deploy Apps Script after code changes.

## 7) Deploy Website to GitHub

Tại thư mục dự án:

`d:\MyProjects\SQL STATEMENTS\HR\MealBooking\mael-booking-github`

Chạy lần đầu:

```bat
cd /d "d:\MyProjects\SQL STATEMENTS\HR\MealBooking\mael-booking-github"
git init
git branch -M main
git add .
git commit -m "Initial meal booking site"
git remote add origin https://github.com/aevndyeing/mealbooking.git
git push -u origin main
```

Nếu repository đã có sẵn và chỉ cần cập nhật:

```bat
cd /d "d:\MyProjects\SQL STATEMENTS\HR\MealBooking\mael-booking-github"
git add .
git commit -m "Update meal booking site"
git push origin main
```

## 8) Publish with GitHub Pages

Sau khi push code lên GitHub:

1. Mở repository trên GitHub.
2. Chọn `Settings`.
3. Chọn `Pages`.
4. Trong `Source`, chọn `Deploy from a branch`.
5. Chọn branch `main`.
6. Chọn folder `/ (root)`.
7. Bấm `Save`.

Sau vài phút, web public thường có dạng:

```text
https://aevndyeing.github.io/mealbooking/
```

Neu ban muon dung URL mac dinh cua GitHub Pages:
- Xoa custom domain trong `Settings -> Pages -> Custom domain`.
- Dam bao file `CNAME` khong ton tai trong repository.

## 9) Checklist Before Public Release

Kiểm tra các mục sau:

1. `index.html` đã có `API_BASE_URL` đúng.
2. Apps Script đã deploy bản mới nhất.
3. Script Property `SPREADSHEET_ID` đã đúng.
4. Web App cho phép `Anyone` truy cập.
5. Google Sheet có đủ các sheet:
  `employees`, `udc`, `shifts`, `meals`, `menus`, `ordered`, `orders`.

## 10) Update Flow After Changes

Khi sửa giao diện frontend:

```bat
cd /d "d:\MyProjects\SQL STATEMENTS\HR\MealBooking\mael-booking-github"
git add .
git commit -m "Update UI or logic"
git push origin main
```

Khi sửa Apps Script:

1. Save code trong Apps Script.
2. Deploy lại Web App nếu code backend thay đổi.

## 11) Quick Troubleshooting

Nếu user không đăng nhập được hoặc không ghi đơn được:

1. Kiểm tra `API_BASE_URL`.
2. Kiểm tra Web App URL còn hoạt động.
3. Kiểm tra `SPREADSHEET_ID`.
4. Kiểm tra Apps Script đã redeploy chưa.
5. Kiểm tra cấu trúc cột trong Google Sheet có đúng như thiết kế không.

## 12) Cannot Access Page After Deploy (404)

Nếu URL GitHub Pages không truy cập được sau deploy, kiểm tra theo thứ tự sau:

1. Xác nhận repository tồn tại và truy cập được:
  - Mở `https://github.com/YOUR_USERNAME/YOUR_REPO`
  - Nếu báo `404`, repo chưa tồn tại, sai tên repo, hoặc tài khoản hiện tại không có quyền.

2. Xác nhận đã push code thành công lên đúng repo:

```bash
cd "/d/MyProjects/SQL STATEMENTS/HR/MealBooking/mael-booking-github"
git remote -v
git push -u origin main
```

Lưu ý khi dùng terminal `bash` trên Windows:
- Không dùng: `cd D:\...`
- Dùng: `cd "/d/..."`

3. Vào `Settings -> Pages` của repo và kiểm tra:
  - Source: `Deploy from a branch`
  - Branch: `main`
  - Folder: `/ (root)`
  - Bấm `Save`

4. Chờ GitHub build xong (1-5 phút), kiểm tra tab `Actions` nếu build fail.

5. Dùng đúng URL theo tên repo:

```text
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

Ví dụ:
- repo `meal-booking` -> `https://YOUR_USERNAME.github.io/meal-booking/`
- repo `mael-booking-github` -> `https://YOUR_USERNAME.github.io/mael-booking-github/`
