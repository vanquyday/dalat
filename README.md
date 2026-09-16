# Đà Lạt 3N2Đ — website lịch trình động

Trang tĩnh, không cần build. Mở `index.html` là chạy.

## Đưa lên GitHub Pages

1. Tạo repo mới trên GitHub (ví dụ `dalat-3n2d`), để **Public**.
2. Upload toàn bộ các file/thư mục trong gói này vào repo (giữ nguyên cấu trúc):
   ```
   index.html
   app.js
   data.js
   anh/...            (ảnh 4 người + ảnh địa điểm — PHẢI upload cả thư mục này)
   ```
   > Nếu chữ bị mất font / ảnh hiện chữ cái thay vì hình → tức là chưa upload đủ thư mục `anh/`,
   > hoặc đường dẫn ảnh trong `data.js` không khớp tên file (phân biệt chữ hoa/chữ thường trên GitHub).
3. Repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → Save.
4. Đợi 1–2 phút, link sẽ là `https://<tên-github>.github.io/dalat-3n2d/`.

Hoặc bằng dòng lệnh:
```bash
git init
git add .
git commit -m "Lịch trình Đà Lạt 3N2Đ"
git branch -M main
git remote add origin https://github.com/<tên-github>/dalat-3n2d.git
git push -u origin main
```

## Sửa nội dung — chỉ cần `data.js`

- `PEOPLE` — tên, giới tính, màu và ảnh của 4 người.
- `STOPS` — từng mốc trong lịch trình: giờ `t`, tên, mô tả, danh sách việc `items`,
  toạ độ `ll: [vĩ độ, kinh độ]`, và `photos: ['anh/ten-anh.jpg']`.
- `FOODS` — bộ ảnh món ăn (lọc theo ngày / bữa).
- `COSTS`, `NOTES`, `PACKING` — chi phí, lưu ý, đồ mang theo.

Thêm ảnh: copy ảnh vào thư mục `anh/`, rồi ghi đường dẫn vào `photos` hoặc `photo`.
Ảnh nào đang là link internet thì cứ thay bằng `anh/...` của bạn.

Lấy toạ độ chính xác hơn: mở Google Maps → click phải vào điểm → copy cặp số
(ví dụ `11.9430, 108.4525`) → dán vào `ll`.

## Điều khiển trên trang

- **▶ Chạy lịch** (hoặc phím `Space`): cả nhóm tự di chuyển theo giờ.
- **1× / 2× / 4×**: tốc độ chạy.
- Kéo thanh thời gian, bấm **Ngày 1/2/3**, hoặc bấm vào bất kỳ mốc nào trong danh sách / ghim trên bản đồ để nhảy tới.
- **♪ Nhạc nền**: bật/tắt nhạc ambient.
- Bản đồ: kéo để tự xem, bấm 1 lần vào bản đồ rồi lăn chuột để zoom. Sau ~6 giây không kéo, bản đồ tự bám theo nhóm lại.

## Cần internet cho

- Bản đồ nền (Esri — Đường phố / Vệ tinh / Địa hình, miễn phí, **không cần API key**) và bộ icon Lucide (CDN).
- Các ảnh còn đang để link internet trong `data.js`.

Ảnh và chữ của bạn thì chạy offline bình thường.
