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

## 13) API Integration for .NET

Muc nay dung cho he thong .NET goi API Apps Script de:
- Lay du lieu master cho web
- Dang nhap nhan vien
- Ghi dang ky suat an
- Dong bo master data tu he thong chinh ve Google Sheets

### 13.1 Base URL

```text
https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

Dat trong .NET:

```csharp
var baseUrl = "https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec";
```

### 13.1.1 Cach lay DEPLOYMENT_ID

Trong Google Apps Script:
1. Vao `Deploy` -> `Manage deployments`.
2. Mo deployment dang dung (Web app).
3. Copy `Web app URL`, vi du:

```text
https://script.google.com/macros/s/AKfycbw_Cowr316pDaXXm7yRNTR4587UDM8-RmayDiiyjxjFavlYt1fa3DZ7ubqbc8jxwLGDlA/exec
```

`DEPLOYMENT_ID` la doan nam giua `/s/` va `/exec`, vi du:

```text
AKfycbw_Cowr316pDaXXm7yRNTR4587UDM8-RmayDiiyjxjFavlYt1fa3DZ7ubqbc8jxwLGDlA
```

Luu y:
- Dung URL ket thuc bang `/exec` cho he thong that.
- URL `/dev` chi dung test trong editor (khong dung cho production).

### 13.2 GET bootstrap

Muc dich: lay shifts, meals, menus, udc va registrationWindow.

```http
GET {baseUrl}?action=bootstrap
```

Response mau:

```json
{
  "success": true,
  "registrationWindow": {
    "startDate": "2026-06-08",
    "endDate": "2026-06-14",
    "week": 24,
    "year": 2026
  },
  "shifts": [],
  "meals": [],
  "menus": [],
  "udc": []
}
```

### 13.3 GET login

Muc dich: kiem tra ma nhan vien + mat khau (`eppasswd`) va trang thai da dang ky tuan ke tiep.

```http
GET {baseUrl}?action=login&epcode=AE0001&eppasswd=123456
```

Response mau:

```json
{
  "success": true,
  "employee": {
    "code": "AE0001",
    "password": "123456",
    "name": "Nguyen Van A",
    "dpcode": "D01",
    "dpname": "Dyeing"
  },
  "alreadyRegistered": false,
  "registrationWindow": {
    "startDate": "2026-06-08",
    "endDate": "2026-06-14",
    "week": 24,
    "year": 2026
  }
}
```

### 13.4 POST submit

Muc dich: ghi dang ky suat an. `week/year` gui len se bi backend bo qua; backend tu tinh tuan ke tiep theo thoi diem hien tai.

```http
POST {baseUrl}
Content-Type: application/json
```

Body mau:

```json
{
  "action": "submit",
  "epcode": "AE0001",
  "week": 24,
  "year": 2026,
  "entries": [
    {
      "orderDate": "2026-06-08",
      "shiftCode": "C1",
      "mealCode": "ML01",
      "menuCode": "MN01",
      "overtime": "N",
      "overtimeMealCode": "",
      "dayOff": "N"
    }
  ]
}
```

### 13.5 POST syncMasterData

Muc dich: dong bo du lieu master ve 5 sheet:
- employees
- udc
- shifts
- meals
- menus

Yeu cau bao mat:
- Tao Script Property `SYNC_API_KEY` trong Apps Script.
- Client phai gui dung `apiKey`.

### 13.5.1 Cach lay YOUR_SYNC_API_KEY

Trong Google Apps Script:
1. Mo project Apps Script dang deploy Web App.
2. Vao `Project Settings`.
3. Tim phan `Script properties`.
4. Tao hoac sua key:
  - Property: `SYNC_API_KEY`
  - Value: chuoi bi mat do ban tu dat (vi du 32-64 ky tu ngau nhien)
5. Bam `Save script properties`.

Gia tri trong cot `Value` chinh la `YOUR_SYNC_API_KEY` de truyen trong payload .NET.

Khuyen nghi:
- Khong hard-code key trong source code .NET.
- Luu key trong `appsettings.<Environment>.json`, Secret Manager, hoac bien moi truong.
- Khi can rotate key: doi `SYNC_API_KEY` trong Apps Script va cap nhat cau hinh he thong .NET.

```http
POST {baseUrl}
Content-Type: application/json
```

Body mau (kieu DataTable: `columns` + `rows`):

```json
{
  "action": "syncMasterData",
  "apiKey": "YOUR_SYNC_API_KEY",
  "tables": {
    "employees": {
      "columns": ["epuid", "eppasswd", "epfullname", "dpcode", "dpname"],
      "rows": [
        ["AE0001", "123456", "Nguyen Van A", "D01", "Dyeing"],
        ["AE0002", "abcdef", "Tran Thi B", "D02", "Lab"]
      ]
    },
    "udc": {
      "columns": ["udcode", "shcode", "mlcode", "mncode"],
      "rows": []
    },
    "shifts": { "columns": ["shcode", "shname"], "rows": [] },
    "meals": { "columns": ["mlcode", "mlname", "mlev04", "mnev04"], "rows": [] },
    "menus": { "columns": ["mncode", "mnname"], "rows": [] }
  }
}
```

Ghi chu:
- Co the gui theo 3 dang: `array<object>`, `{columns, rows}`, hoac `{data:[...]}`.
- Neu mot bang khong gui trong `tables`, API se bo qua bang do.

### 13.6 C# HttpClient sample

```csharp
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Web;

var baseUrl = "https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec";
using var http = new HttpClient();

// 1) bootstrap
var bootstrapUrl = baseUrl + "?action=bootstrap";
var bootstrapJson = await http.GetStringAsync(bootstrapUrl);

// 2) login
var loginQuery = HttpUtility.ParseQueryString(string.Empty);
loginQuery["action"] = "login";
loginQuery["epcode"] = "AE0001";
loginQuery["eppasswd"] = "123456";
var loginUrl = baseUrl + "?" + loginQuery;
var loginJson = await http.GetStringAsync(loginUrl);

// 3) submit
var submitPayload = new
{
    action = "submit",
    epcode = "AE0001",
    week = 24,
    year = 2026,
    entries = new[]
    {
        new {
            orderDate = "2026-06-08",
            shiftCode = "C1",
            mealCode = "ML01",
            menuCode = "MN01",
            overtime = "N",
            overtimeMealCode = "",
            dayOff = "N"
        }
    }
};
var submitResp = await http.PostAsJsonAsync(baseUrl, submitPayload);
var submitJson = await submitResp.Content.ReadAsStringAsync();

// 4) sync master data
var syncPayload = new
{
    action = "syncMasterData",
    apiKey = "YOUR_SYNC_API_KEY",
    tables = new
    {
        employees = new {
            columns = new[] { "epuid", "eppasswd", "epfullname", "dpcode", "dpname" },
            rows = new object[][]
            {
                new object[] { "AE0001", "123456", "Nguyen Van A", "D01", "Dyeing" }
            }
        }
    }
};
var syncResp = await http.PostAsJsonAsync(baseUrl, syncPayload);
var syncJson = await syncResp.Content.ReadAsStringAsync();
```

### 13.7 Checklist for .NET integration

1. Apps Script da deploy ban moi nhat.
2. Script Property `SPREADSHEET_ID` da dung.
3. Neu goi `syncMasterData`, da tao `SYNC_API_KEY`.
4. He thong .NET dang goi URL `/exec` (khong phai `/dev`).
5. Log response JSON de de debug khi `success = false`.
