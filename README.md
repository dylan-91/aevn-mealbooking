# He thong Dat Com A&E

Web app dat suat an cho nhan vien A&E, toi uu cho thao tac nhanh tren dien thoai va de trien khai cong khai qua GitHub Pages.

## Tong quan

Du an giup nhan vien dang nhap bang ma nhan vien, chon suat an theo tung ngay trong tuan tiep theo, gui dang ky len Google Sheets thong qua Google Apps Script API.

- Frontend: HTML/CSS/JavaScript thuần, responsive, tai nhanh
- Backend: Google Apps Script (Web App API)
- Du lieu: Google Sheets (de van hanh, de kiem tra)
- Hosting: GitHub Pages

## Diem hap dan

- Truy cap truc tiep bang trinh duyet, khong can cai app
- Giao dien mobile-first, thao tac ro rang theo tung ngay
- Luong nhap lieu co rang buoc thong minh (ca -> bua -> mon)
- UX toi gian: dang nhap nhanh, toast thong bao, trang thai xu ly ro rang
- Co the mo rong de quan tri, bao cao, thong ke

## Chuc nang chinh

1. Dang nhap bang ma nhan vien
2. Hien thi khung dang ky cho tuan tiep theo
3. Chon ngay nghi Co/Khong cho tung ngay
4. Chon:
   - Ca lam viec
   - Bua an chinh
   - Mon an
   - Dang ky bua lam them (tuy chon)
5. Kiem tra du lieu truoc khi gui dang ky
6. Chan dang ky trung (da dang ky thi khong cho dang ky lai)
7. Ghi du lieu don hang vao Google Sheets

## Loi ich mang lai

- Giam thao tac thu cong tren file roi rac
- Chuan hoa du lieu dang ky suat an theo tuan
- De truy vet, de doi soat, de tong hop
- Trien khai nhanh, chi phi thap, de bao tri
- Phu hop moi truong van hanh san xuat (can on dinh, de dung)

## Giao dien

- Man hinh Login gon gang, tap trung vao mot hanh dong chinh
- Man hinh Dat com theo the (card) cho tung ngay
- Mau sac than thien, nhan dien ro trang thai
- Thich ung tot tren mobile va desktop

## Cau truc du an

- index.html: giao dien + logic frontend
- google-apps-script/Code.gs: API backend cho bootstrap/login/submit
- google-apps-script/README.md: huong dan setup Apps Script va deploy chi tiet

## Cach chay nhanh

1. Mo file index hoac deploy len GitHub Pages
2. Cau hinh API_BASE_URL trong index.html tro den Web App URL cua Apps Script
3. Dam bao Google Sheet du cac sheet du lieu: employees, udc, shifts, meals, menus, ordered, orders

## Deploy

- GitHub Pages URL mac dinh:
  - https://aevndyeing.github.io/mealbooking/

Thong tin setup backend xem tai:
- google-apps-script/README.md

## Doi tuong su dung

- Nhan vien dang ky suat an
- Nguoi van hanh/quan tri theo doi ket qua dang ky

## Dinh huong mo rong

- Them man hinh admin quan tri menu/ca
- Bao cao tong hop theo ngay, bo phan, ca
- Tich hop thong bao nhac han dang ky
- Phan quyen theo vai tro

---

Neu ban muon, toi co the tiep tuc bo sung README theo huong "san pham doanh nghiep" voi anh giao dien, luong nghiep vu va roadmap theo quy.
