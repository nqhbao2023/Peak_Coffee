# Peak Coffee — Lessons Learned

> Ghi lại những bài học từ quá trình phát triển để tránh lặp lại sai lầm.

---

## 📅 2026-02-28: Dọn dẹp AI governance

**Vấn đề**: Dùng Antigravity Toolkit (.agent/) với 212 files — Copilot KHÔNG tự đọc được các file này khi chat. Kết quả: tốn token cho instruction vô hiệu.

**Bài học**:
- Copilot chỉ tự đọc `.github/copilot-instructions.md` — mọi thứ khác cần attach thủ công
- Giữ instructions ngắn (≤ 120 dòng), trỏ tới docs/ cho chi tiết
- Generic toolkit (40 skills cho mọi ngôn ngữ) không có giá trị cho project cụ thể
- Root .md files (logs, reports) tạo nhiễu — gom vào docs/logs/

**Giải pháp**: Constitution ngắn + docs chi tiết (kiểu Spa Thu Hằng)

---

## Template

### 📅 YYYY-MM-DD: [Tiêu đề ngắn]

**Vấn đề**: ...

**Bài học**: ...

**Giải pháp**: ...
