# 🚀 Hướng dẫn nhanh - JWT RSA256 API

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy server
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

## 📚 Swagger Documentation

Truy cập: `http://localhost:3000/api-docs`

## 🔑 Các bước sử dụng cơ bản

### Bước 1: Tạo khóa RSA

```bash
curl -X POST http://localhost:3000/api/keys/generate \
  -H "Content-Type: application/json" \
  -d '{"keySize": 2048}'
```

### Bước 2: Tạo JWT Token

```bash
curl -X POST http://localhost:3000/api/jwt/create \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {
      "user_id": 123,
      "role": "admin",
      "username": "Tkon"
    }
  }'
```

### Bước 3: Xác thực Token

```bash
curl -X POST http://localhost:3000/api/jwt/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_JWT_TOKEN_HERE"
  }'
```

## 🧪 Chạy test

```bash
# Đảm bảo server đang chạy trước
npm run dev

# Trong terminal khác, chạy test
npm test
```

## 📋 API Endpoints

| Method | Endpoint                    | Mô tả                    |
| ------ | --------------------------- | ------------------------ |
| GET    | `/`                         | Trang chủ API            |
| GET    | `/health`                   | Kiểm tra trạng thái      |
| POST   | `/api/keys/generate`        | Tạo khóa RSA             |
| GET    | `/api/keys/status`          | Kiểm tra trạng thái khóa |
| GET    | `/api/keys/public`          | Lấy khóa public          |
| DELETE | `/api/keys/delete`          | Xóa khóa                 |
| POST   | `/api/jwt/create`           | Tạo JWT token            |
| POST   | `/api/jwt/verify`           | Xác thực token           |
| POST   | `/api/jwt/decode`           | Giải mã token            |
| POST   | `/api/jwt/check-expiration` | Kiểm tra hết hạn         |

## 🔧 Cấu hình nhanh

### Environment Variables

```bash
PORT=3000  # Port để chạy server
```

### Tùy chọn JWT mặc định

- `expiresIn`: "24h"
- `issuer`: "jwt-rsa256-api"

## 🛡️ Bảo mật

- Khóa private được lưu trong thư mục `keys/`
- Sử dụng thuật toán RSA256
- Middleware Helmet và CORS được cấu hình
- Khóa private không bao giờ được gửi qua API

## 📞 Hỗ trợ

- Xem README.md để biết thêm chi tiết
- Truy cập Swagger UI để test API
- Chạy `npm test` để kiểm tra tất cả endpoints
