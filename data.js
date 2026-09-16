/* ======================================================================
   DỮ LIỆU CHUYẾN ĐI — sửa file này là đủ, không cần đụng tới app.js
   - photo: '' nghĩa là chưa có ảnh (sẽ hiện ô trống chờ ảnh).
   - Thay link ảnh bằng đường dẫn ảnh bạn upload, ví dụ: 'anh/ga-da-lat.jpg'
   ====================================================================== */

/* 4 thành viên — thay name + photo của bạn vào đây */
const PEOPLE = [
  { name: 'Quý', gender: 'nam', color: '#c67139', photo: 'anh/quy.png' },
  { name: 'Long', gender: 'nam', color: '#8c491a', photo: 'anh/long.png' },
  { name: 'Lệ',  gender: 'nữ',  color: '#8fa073', photo: 'anh/le.png' },
  { name: 'Nhi', gender: 'nữ',  color: '#56633f', photo: 'anh/nhi.png' }
];

const TRIP = {
  title: 'Đà Lạt 3 ngày 2 đêm',
  concept: 'Ăn ngon · Cafe đẹp · Check-in · Chill — không chạy quá nhiều điểm',
  days: [
    { d: 1, name: 'Trung tâm Đà Lạt + Chợ đêm' },
    { d: 2, name: 'Cầu Đất — săn mây + Datanla' },
    { d: 3, name: 'Ăn sáng, cafe, check-in nhẹ & về' }
  ]
};

/* zone: 'center' (nội thành) | 'caudat' | 'south' (sân bay)
   kind: place | food | cafe | hotel | market | nature | shop
   ll: [vĩ độ, kinh độ] — toạ độ thực, gần đúng ở mức khu vực */
const STOPS = [
  /* ---------------- NGÀY 1 ---------------- */
  { d:1, t:'08:00', zone:'center', kind:'hotel', ll:[11.9435,108.4370],
    title:'Đến Đà Lạt', sub:'Khách sạn trung tâm',
    items:['Gửi hành lý ở khách sạn','Thuê xe máy nếu cần'], photos:[] },
  { d:1, t:'08:30', zone:'center', kind:'food', ll:[11.9440,108.4382],
    title:'Ăn sáng', sub:'Bánh căn + xíu mại',
    items:['Bánh căn + xíu mại','Cafe sáng'],
    photos:['https://datviettour.com.vn/uploads/images/dalat/dac-san/b__nh_c__n_chung.jpeg'] },
  { d:1, t:'09:30', zone:'center', kind:'place', ll:[11.9483,108.4444],
    title:'Vườn hoa thành phố', sub:'Tham quan, chụp ảnh',
    items:['Khoảng 1 tiếng','Nhiều góc chụp hoa'], photos:['anh/vuon-hoa.png'] },
  { d:1, t:'11:00', zone:'center', kind:'place', ll:[11.9430,108.4525],
    title:'Ga Đà Lạt', sub:'Check-in ga cổ',
    items:['Chụp ảnh 45–60 phút','Toa tàu cổ, sân ga'],
    photos:['https://vietnamtimes.thoidai.com.vn/stores/news_dataimages/2026/052026/08/20/cd56784da29f0aeec24d56b5c8970061.jpg?rt=20260508203426'] },
  { d:1, t:'12:30', zone:'center', kind:'food', ll:[11.9457,108.4325],
    title:'Ăn trưa', sub:'Nem nướng',
    items:['Nem nướng','Hoặc bánh ướt lòng gà','Hoặc cơm gia đình'],
    photos:['https://static.vinwonders.com/production/quan-an-ngon-da-lat-12.jpg',
            'https://www.vietfuntravel.com.vn/image/data/Da-Lat/quan-an-gan-cho-da-lat/banh-uot-long-ga-da-lat.jpg'] },
  { d:1, t:'14:00', zone:'center', kind:'hotel', ll:[11.9435,108.4370],
    title:'Về khách sạn', sub:'Nhận phòng, nghỉ ngơi', items:['Nhận phòng','Nghỉ ~1 tiếng'], photos:[] },
  { d:1, t:'15:30', zone:'center', kind:'cafe', ll:[11.9300,108.4500],
    title:'Đi cafe', sub:'Quán view đồi / view thành phố',
    items:['Ngồi chill 1–1,5 tiếng'], photos:['anh/cafe-doi.png'] },
  { d:1, t:'17:00', zone:'center', kind:'place', ll:[11.9400,108.4396],
    title:'Hồ Xuân Hương + Quảng trường Lâm Viên', sub:'Đi dạo, ngắm hoàng hôn',
    items:['Đi dạo quanh hồ','Chụp ảnh','Ngắm hoàng hôn nếu trời đẹp'],
    photos:['https://statics.vinpearl.com/da-lat-thuoc-mien-nao-3_1701342243.jpeg',
            'https://benthanhtourist.com/resize/1060x0/tour/trong-nuoc/da-lat/quang-truong-lam-vien.webp'] },
  { d:1, t:'18:30', zone:'center', kind:'food', ll:[11.9366,108.4290],
    title:'Ăn tối', sub:'Lẩu gà lá é',
    items:['Lẩu gà lá é','Hoặc lẩu bò'],
    photos:['https://phetravel.com/uploads/lau-ga-la-e.jpg'] },
  { d:1, t:'20:00', zone:'center', kind:'market', ll:[11.9424,108.4363],
    title:'Chợ đêm Đà Lạt', sub:'Ăn vặt & đi bộ',
    items:['Bánh tráng nướng','Khoai nướng, bắp nướng','Xắp xắp','Sữa đậu nành nóng'],
    photos:['anh/khoai-bap-nuong.png',
            'https://galatourist.com/pic/blog/images/vietnam-travel-guide/dalat-travel-guide/what-to-eat-in-dalat/740-banh-trang-nuong.jpg'] },
  { d:1, t:'22:00', zone:'center', kind:'hotel', ll:[11.9435,108.4370],
    title:'Về khách sạn nghỉ', sub:'Kết thúc ngày 1', items:['Ngủ sớm để mai 5h đi săn mây'], photos:[] },

  /* ---------------- NGÀY 2 ---------------- */
  { d:2, t:'05:00', zone:'center', kind:'hotel', ll:[11.9435,108.4370],
    title:'Xuất phát đi Cầu Đất', sub:'Đi sớm để săn mây',
    items:['Mang áo khoác — sáng khá lạnh','Đường đi ~25 km'], photos:[] },
  { d:2, t:'06:00', zone:'caudat', kind:'nature', fog:true, ll:[11.8045,108.5510],
    title:'Săn mây + bình minh', sub:'Cầu Đất Farm',
    items:['Ngắm biển mây','Bình minh trên đồi chè','Chụp ảnh'],
    photos:['https://img.360dalat.com/resize/730x-/2022/12/06/khung-canh-cau-go-san-may-cau-dat-c96f.jpg'] },
  { d:2, t:'07:30', zone:'caudat', kind:'cafe', fog:true, ll:[11.8080,108.5470],
    title:'Ăn sáng + cafe Cầu Đất', sub:'Cafe ngắm đồi',
    items:['Ăn sáng nhẹ','Cafe view đồi chè'], photos:[] },
  { d:2, t:'09:00', zone:'caudat', kind:'nature', ll:[11.8103,108.5490],
    title:'Đồi chè Cầu Đất', sub:'Đi dạo & chụp ảnh',
    items:['Khoảng 1–1,5 tiếng','Đồi chè, thung lũng'],
    photos:['https://dalattrongtim.com/wp-content/uploads/2020/11/20170104091915-doi-che-cau-dat-gody-5.jpg'] },
  { d:2, t:'12:00', zone:'center', kind:'food', ll:[11.9380,108.4335],
    title:'Ăn trưa', sub:'Gà nướng cơm lam',
    items:['Gà nướng cơm lam','Hoặc cơm gia đình'],
    photos:['https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc2inz9bbt2e%40resize_ss640x400'] },
  { d:2, t:'13:30', zone:'center', kind:'hotel', ll:[11.9435,108.4370],
    title:'Nghỉ ngơi', sub:'Về khách sạn', items:['Nghỉ trưa ~1 tiếng'], photos:[] },
  { d:2, t:'15:00', zone:'center', kind:'nature', ll:[11.9013,108.4265],
    title:'Thác Datanla', sub:'Tham quan thác',
    items:['Có thể chơi máng trượt','Không cần quá nhiều thời gian'],
    photos:['https://dalathappytours.com/images/uploads/nice_wiew_from_datanla_water_fall.jpg'] },
  { d:2, t:'17:00', zone:'center', kind:'cafe', ll:[11.9180,108.4310],
    title:'Cafe chill', sub:'View đồi / rừng',
    items:['Ngồi nghỉ','Ngắm hoàng hôn'], photos:['anh/cafe-doi.png'] },
  { d:2, t:'18:30', zone:'center', kind:'food', ll:[11.9420,108.4300],
    title:'Ăn tối', sub:'Sân vườn hoặc kiểu Âu',
    items:['Option 1: nhà hàng sân vườn, món đặc sản','Option 2: nhà hàng Âu — steak/pasta/pizza'],
    photos:['https://img.tripi.vn/cdn-cgi/image/width%3D700%2Cheight%3D700/https%3A/gcs.tripi.vn/public-tripi/tripi-feed/img/485952bOo/anh-mo-ta.png'] },
  { d:2, t:'20:30', zone:'center', kind:'place', ll:[11.9430,108.4375],
    title:'Tự do', sub:'Trung tâm Đà Lạt',
    items:['Cafe acoustic','Bar / lounge','Đi dạo trung tâm','Mua đồ ăn vặt về homestay'], photos:[] },
  { d:2, t:'22:30', zone:'center', kind:'hotel', ll:[11.9435,108.4370],
    title:'Về nghỉ', sub:'Kết thúc ngày 2', items:[], photos:[] },

  /* ---------------- NGÀY 3 ---------------- */
  { d:3, t:'07:30', zone:'center', kind:'food', ll:[11.9448,108.4390],
    title:'Ăn sáng', sub:'Bánh mì xíu mại',
    items:['Bánh mì xíu mại','Hoặc bánh căn','Hoặc phở / bún bò'],
    photos:['https://kenh14cdn.com/203336854389633024/2022/6/14/4-1655193265679759427317.jpg'] },
  { d:3, t:'08:30', zone:'center', kind:'cafe', ll:[11.9412,108.4340],
    title:'Cafe sáng', sub:'Quán đẹp gần trung tâm', items:['Chill khoảng 1 tiếng'], photos:['anh/cafe-doi.png'] },
  { d:3, t:'09:30', zone:'center', kind:'place', ll:[11.9257,108.4553],
    title:'Check-in nhẹ', sub:'Dinh I Bảo Đại / Vườn hoa',
    items:['Chọn 1 trong 2: Dinh I hoặc Vườn hoa thành phố'],
    photos:['https://static.vinwonders.com/production/dinh-bao-dai-da-lat-2.jpg'] },
  { d:3, t:'11:00', zone:'center', kind:'shop', ll:[11.9430,108.4368],
    title:'Cafe / đi dạo trung tâm', sub:'Mua quà', items:['Mua quà','Nghỉ ngơi'], photos:[] },
  { d:3, t:'12:30', zone:'center', kind:'food', ll:[11.9457,108.4325],
    title:'Ăn trưa', sub:'Nem nướng / lẩu',
    items:['Nem nướng','Lẩu gà lá é','Lẩu bò','Cơm gia đình'],
    photos:['https://static.vinwonders.com/production/quan-an-ngon-da-lat-12.jpg'] },
  { d:3, t:'14:00', zone:'center', kind:'shop', ll:[11.9424,108.4363],
    title:'Mua đặc sản', sub:'Chợ Đà Lạt',
    items:['Dâu tây, hồng sấy','Atiso, trà, cafe','Khoai lang mật, mứt Đà Lạt'], photos:[] },
  { d:3, t:'15:00', zone:'south', kind:'place', ll:[11.7503,108.3752],
    title:'Lấy hành lý & ra sân bay', sub:'Check-out — Liên Khương',
    items:['Check-out khách sạn','Di chuyển ra sân bay / điểm xe'], photos:[] }
];

/* Bộ ảnh món ăn — meal: sáng | trưa | tối | vặt */
const FOODS = [
  { name:'Bánh căn + xíu mại', days:[1], meal:'sáng',
    photo:'https://datviettour.com.vn/uploads/images/dalat/dac-san/b__nh_c__n_chung.jpeg' },
  { name:'Bánh mì xíu mại', days:[3], meal:'sáng',
    photo:'https://kenh14cdn.com/203336854389633024/2022/6/14/4-1655193265679759427317.jpg' },
  { name:'Nem nướng', days:[1,3], meal:'trưa',
    photo:'https://static.vinwonders.com/production/quan-an-ngon-da-lat-12.jpg' },
  { name:'Bánh ướt lòng gà', days:[1], meal:'trưa',
    photo:'https://www.vietfuntravel.com.vn/image/data/Da-Lat/quan-an-gan-cho-da-lat/banh-uot-long-ga-da-lat.jpg' },
  { name:'Gà nướng cơm lam', days:[2], meal:'trưa',
    photo:'https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc2inz9bbt2e%40resize_ss640x400' },
  { name:'Lẩu gà lá é', days:[1,3], meal:'tối',
    photo:'https://phetravel.com/uploads/lau-ga-la-e.jpg' },
  { name:'Lẩu bò', days:[2,3], meal:'tối',
    photo:'https://img.tripi.vn/cdn-cgi/image/width%3D700%2Cheight%3D700/https%3A/gcs.tripi.vn/public-tripi/tripi-feed/img/485952bOo/anh-mo-ta.png' },
  { name:'Bánh tráng nướng', days:[1], meal:'vặt',
    photo:'https://galatourist.com/pic/blog/images/vietnam-travel-guide/dalat-travel-guide/what-to-eat-in-dalat/740-banh-trang-nuong.jpg' },
  { name:'Xắp xắp', days:[1], meal:'vặt',
    photo:'https://bazantravel.com/cdn/medias/uploads/22/22224-xap-xap-5-e1510152030935.jpg' },
  { name:'Sữa đậu nành nóng', days:[1], meal:'vặt',
    photo:'https://file3.qdnd.vn/data/images/14/2024/07/24/upload_2217/suasau92135940pm.jpeg?dpi=150&quality=100&w=870' },
  { name:'Khoai nướng, bắp nướng', days:[1], meal:'vặt', photo:'anh/khoai-bap-nuong.png' }
];

const COSTS = [
  { label:'Khách sạn 2 đêm', min:500,  max:1200 },
  { label:'Ăn uống',         min:700,  max:1200 },
  { label:'Cafe',            min:200,  max:400  },
  { label:'Vé tham quan',    min:300,  max:600  },
  { label:'Thuê xe',         min:150,  max:250  },
  { label:'Xăng',            min:50,   max:100  },
  { label:'Ăn vặt & linh tinh', min:200, max:400 }
];

const NOTES = [
  'Ngày 2 nên kiểm tra thời tiết trước khi đi săn mây.',
  'Đi vào mùa lạnh nên mang áo khoác dày.',
  'Không xếp quá nhiều điểm trong một ngày — di chuyển giữa các khu ở Đà Lạt mất khá nhiều thời gian.',
  'Nếu chuyến bay/xe về sớm thì rút ngắn lịch ngày 3.'
];

const PACKING = ['Áo khoác dày', 'Khăn / mũ len', 'Giày đi bộ êm', 'Sạc dự phòng', 'Thuốc cá nhân', 'Kem chống nắng'];
