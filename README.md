# JWT RSA256 API

API để tạo và xác thực JWT tokens sử dụng thuật toán RSA256. API này cung cấp các chức năng quản lý khóa RSA và xử lý JWT tokens một cách an toàn và dễ sử dụng.

## 🚀 Tính năng

- **Quản lý khóa RSA**: Tạo, kiểm tra trạng thái, và xóa cặp khóa RSA
- **Tạo JWT token**: Tạo JWT token với thuật toán RSA256
- **Xác thực token**: Xác thực JWT token và trả về dữ liệu đã giải mã
- **Giải mã token**: Giải mã token mà không xác thực (chỉ để xem thông tin)
- **Kiểm tra hết hạn**: Kiểm tra thời gian hết hạn của token
- **Swagger Documentation**: Tài liệu API đầy đủ và tương tác

## 📋 Yêu cầu hệ thống

- Node.js (version 14 trở lên)
- npm hoặc yarn

## 🛠️ Cài đặt

1. **Clone repository**:

```bash
git clone <repository-url>
cd create-jwt-rsa256
```

2. **Cài đặt dependencies**:

```bash
npm install
```

3. **Khởi chạy server**:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## 📚 API Documentation

Truy cập Swagger UI tại: `http://localhost:3000/api-docs`

## 🔑 Cách sử dụng

### 1. Tạo khóa RSA

Đầu tiên, bạn cần tạo cặp khóa RSA:

```bash
curl -X POST http://localhost:3000/api/keys/generate \
  -H "Content-Type: application/json" \
  -d '{"keySize": 2048}'
```

Response:

```json
{
  "success": true,
  "message": "Đã tạo thành công cặp khóa RSA 2048 bit",
  "privateKeyPath": "/path/to/private.pem",
  "publicKeyPath": "/path/to/public.pem",
  "publicKey": "-----BEGIN PUBLIC KEY-----..."
}
```

### 2. Tạo JWT Token

Tạo JWT token với payload tùy chỉnh:

```bash
curl -X POST http://localhost:3000/api/jwt/create \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {
      "user_id": 123,
      "role": "admin",
      "username": "Tkon"
    },
    "options": {
      "expiresIn": "24h"
    }
  }'
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "payload": {
    "user_id": 123,
    "role": "admin",
    "username": "Tkon"
  },
  "options": {
    "algorithm": "RS256",
    "expiresIn": "24h"
  }
}
```

### 3. Xác thực Token

Xác thực JWT token:

```bash
curl -X POST http://localhost:3000/api/jwt/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

Response:

```json
{
  "success": true,
  "valid": true,
  "decoded": {
    "user_id": 123,
    "role": "admin",
    "username": "Tkon",
    "iat": 1752738511,
    "exp": 1752742111
  },
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  }
}
```

### 4. Giải mã Token

Giải mã token mà không xác thực:

```bash
curl -X POST http://localhost:3000/api/jwt/decode \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### 5. Kiểm tra thời gian hết hạn

Kiểm tra token có hết hạn chưa:

```bash
curl -X POST http://localhost:3000/api/jwt/check-expiration \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

## 🔧 Cấu hình

### Environment Variables

- `PORT`: Port để chạy server (mặc định: 3000)

### Tùy chọn JWT

- `expiresIn`: Thời gian hết hạn (mặc định: "24h")
- `issuer`: Người phát hành token (mặc định: "jwt-rsa256-api")

### Kích thước khóa RSA

- Hỗ trợ từ 1024 đến 4096 bit
- Mặc định: 2048 bit (khuyến nghị)

## 🛡️ Bảo mật

- Sử dụng thuật toán RSA256 cho chữ ký JWT
- Khóa private được lưu trữ an toàn trong file system
- Middleware Helmet để bảo vệ HTTP headers
- CORS được cấu hình để kiểm soát truy cập

## 📝 Ví dụ sử dụng với JavaScript

```javascript
// Tạo khóa
const createKeys = async () => {
  const response = await fetch("http://localhost:3000/api/keys/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keySize: 2048 }),
  });
  return response.json();
};

// Tạo token
const createToken = async (payload) => {
  const response = await fetch("http://localhost:3000/api/jwt/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });
  return response.json();
};

// Xác thực token
const verifyToken = async (token) => {
  const response = await fetch("http://localhost:3000/api/jwt/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return response.json();
};
```

## 🚨 Lưu ý quan trọng

1. **Bảo mật khóa private**: Khóa private không bao giờ được chia sẻ hoặc gửi qua API
2. **Thời gian hết hạn**: Luôn đặt thời gian hết hạn hợp lý cho tokens
3. **Kích thước khóa**: Sử dụng ít nhất 2048 bit cho khóa RSA
4. **Lưu trữ khóa**: Khóa được lưu trong thư mục `keys/` - đảm bảo bảo mật thư mục này

## 🌐 Luồng tích hợp với Ermis Team

Sau khi tạo cặp khóa RSA (public key và private key), bạn cần thực hiện các bước sau để tích hợp với hệ thống Ermis:

### 1. Gửi public key cho Ermis Team

- Sau khi tạo khóa bằng API `/api/keys/generate`, lấy nội dung public key bằng API:
  ```bash
  curl http://localhost:3000/api/keys/public
  ```
- Gửi public key này cho Ermis Team.

### 2. Nhận apikey và project_id từ Ermis Team

- Sau khi nhận được public key, Ermis Team sẽ cung cấp cho bạn một `apikey` và `project_id` để sử dụng các dịch vụ xác thực của Ermis.

### 3. Tạo JWT bằng private key

- Sử dụng API `/api/jwt/create` để tạo JWT:
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
- Lưu lại JWT vừa tạo để sử dụng ở bước tiếp theo.

### 4. Khởi tạo Ermis Chat

- Yêu cầu:

* Cài đặt ermis-chat-js-sdk

  - npm: $ npm install ermis-chat-js-sdk
  - yarn: $ yarn add ermis-chat-js-sdk

* Khởi tạo sdk
  import { ErmisChat } from 'ermis-chat-js-sdk';

  // Cấu hình tuỳ chọn
  const options = {
  timeout: 6000, // Thời gian chờ kết nối (ms)
  baseURL: 'https://your-api-domain.com', // Địa chỉ API server
  };

  // Tạo instance chat client
  const chatClient = ErmisChat.getInstance(API_KEY, PROJECT_ID, options);

* Kết nối người dùng
  // Sau khi có token generated by private key và user_id
  await chatClient.connectUser(
  {
  api_key: API_KEY,  
   id: user_id,  
   name: user_id
  },
  token // JWT token từ bước 3,
  true // external auth flag
  );

- **Response** trả về thông báo thành công, bạn có thể sử dụng các dịch vụ tiếp theo của Ermis.

---
