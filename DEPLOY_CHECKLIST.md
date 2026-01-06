# 🚀 DEPLOY CHECKLIST - PEAK COFFEE

**Quick checklist trước khi đưa vào sử dụng thực tế**

---

## ✅ PRE-DEPLOYMENT (BẮT BUỘC)

### 1. 🔐 Security
- [ ] **Thay đổi Firebase Rules** (xem PRODUCTION_READY_REPORT.md)
- [ ] **Đổi ADMIN_PHONE** thành số điện thoại thật
- [ ] **Setup Environment Variables** cho production
- [ ] **Kiểm tra .gitignore** có `.env` và `.env.local`

### 2. 🗄️ Database
- [ ] **Xóa test data** trong Firestore (chạy `npm run reset:firestore`)
- [ ] **Tạo admin user** với số điện thoại thật
- [ ] **Seed menu items** (nếu cần)
- [ ] **Setup backup tự động** (Firebase console)

### 3. 📱 Firebase Config
- [ ] **Kiểm tra API keys** trong `firebase/config.js`
- [ ] **Setup FCM** (Cloud Messaging) đúng domain
- [ ] **Deploy Firestore Rules:** `firebase deploy --only firestore:rules`
- [ ] **Test notifications** trên thiết bị thật

### 4. 🎨 Content
- [ ] **Đổi tên quán** (hiện tại: COFFEE VIETHOA)
- [ ] **Cập nhật logo** (nếu có)
- [ ] **Thêm địa chỉ chính xác** trong Header
- [ ] **Cập nhật số điện thoại liên hệ**

---

## 🧪 TESTING (RECOMMENDED)

### Device Testing
- [ ] iPhone + Safari
- [ ] Android + Chrome
- [ ] Tablet landscape mode
- [ ] Desktop (admin dashboard)

### Feature Testing
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập lại
- [ ] Thêm món vào giỏ
- [ ] Áp dụng voucher
- [ ] Thanh toán (COD + Chuyển khoản)
- [ ] Admin duyệt đơn
- [ ] Notification đơn hàng mới

### Edge Cases
- [ ] Giỏ hàng rỗng → checkout
- [ ] Không có mạng → offline mode
- [ ] SĐT sai định dạng
- [ ] Admin logout → không thấy dashboard

---

## 🚀 DEPLOYMENT

### Build & Deploy
```bash
# 1. Clean install
npm ci

# 2. Build production
npm run build

# 3. Test local
npm run preview

# 4. Deploy Firebase (nếu dùng Firebase Hosting)
firebase deploy

# 5. Hoặc deploy lên Vercel
vercel deploy --prod
```

### Post-Deploy Verification
- [ ] Truy cập URL production
- [ ] Kiểm tra console không có errors
- [ ] Test một flow hoàn chỉnh: Đăng ký → Order → Admin duyệt
- [ ] Kiểm tra notification
- [ ] Test trên mobile thật

---

## 📊 MONITORING (POST-LAUNCH)

### Week 1
- [ ] Check Firebase Usage (reads/writes)
- [ ] Monitor errors trong Firebase Crashlytics
- [ ] Thu thập feedback từ users
- [ ] Fix critical bugs (nếu có)

### Daily (Admin)
- [ ] Check đơn hàng pending
- [ ] Duyệt feedback
- [ ] Theo dõi revenue

---

## ⚠️ ROLLBACK PLAN

Nếu có vấn đề nghiêm trọng:

```bash
# Rollback Firebase Hosting
firebase hosting:rollback

# Rollback Vercel
vercel rollback [deployment-url]

# Hoặc tạm dừng app
# → Hiển thị maintenance page
```

---

## 🎉 GO-LIVE!

Sau khi hoàn thành tất cả checklist:

1. ✅ **Announce:** Thông báo cho khách hàng (poster, Facebook, Zalo)
2. ✅ **Train:** Hướng dẫn nhân viên sử dụng admin dashboard
3. ✅ **Support:** Sẵn sàng hỗ trợ users (Zalo/Phone)
4. ✅ **Monitor:** Theo dõi app trong 24h đầu

---

## 📞 EMERGENCY CONTACTS

| Issue | Contact |
|-------|---------|
| Firebase down | https://status.firebase.google.com |
| Hosting issues | Support team/DevOps |
| Critical bugs | Developer (you!) |

---

**Last Updated:** 6/1/2026  
**Version:** 2.6 Production Ready
