const express = require('express');
const router = express.Router();
const jwtService = require('../services/jwtService');

/**
 * @swagger
 * /api/jwt/create:
 *   post:
 *     summary: Tạo JWT token mới
 *     description: Tạo JWT token sử dụng thuật toán RSA256 với payload và tùy chọn tùy chỉnh
 *     tags: [JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payload
 *             properties:
 *               payload:
 *                 type: object
 *                 description: Dữ liệu payload của token
 *                 example:
 *                   user_id: 123
 *                   role: "admin"
 *                   username: "Tkon"
 *               options:
 *                 type: object
 *                 description: Tùy chọn cho token
 *                 properties:
 *                   expiresIn:
 *                     type: string
 *                     description: Thời gian hết hạn (mặc định 24h)
 *                     example: "24h"
 *                   issuer:
 *                     type: string
 *                     description: Người phát hành token
 *                     example: "jwt-rsa256-api"
 *                  
 *     responses:
 *       200:
 *         description: Tạo token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 payload:
 *                   type: object
 *                   example:
 *                     user_id: 123
 *                     role: "admin"
 *                     username: "Tkon"
 *                 options:
 *                   type: object
 *                   example:
 *                     algorithm: "RS256"
 *                     expiresIn: "24h"
 *       400:
 *         description: Lỗi khi tạo token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi tạo token"
 */
router.post('/create', (req, res) => {
    try {
        const { payload, options = {} } = req.body;
        
        if (!payload) {
            return res.status(400).json({
                success: false,
                error: 'Payload là bắt buộc'
            });
        }

        const result = jwtService.createToken(payload, options);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/jwt/verify:
 *   post:
 *     summary: Xác thực JWT token
 *     description: Xác thực JWT token và trả về dữ liệu đã giải mã
 *     tags: [JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token cần xác thực
 *                 example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               options:
 *                 type: object
 *                 description: Tùy chọn xác thực
 *                 properties:
 *                   ignoreExpiration:
 *                     type: boolean
 *                     description: Bỏ qua kiểm tra thời gian hết hạn
 *                     example: false
 *     responses:
 *       200:
 *         description: Xác thực token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 decoded:
 *                   type: object
 *                   example:
 *                     user_id: 123
 *                     role: "admin"
 *                     username: "Tkon"
 *                     iat: 1752738511
 *                     exp: 1752742111
 *                 header:
 *                   type: object
 *                   example:
 *                     alg: "RS256"
 *                     typ: "JWT"
 *       400:
 *         description: Token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Token đã hết hạn"
 */
router.post('/verify', (req, res) => {
    try {
        const { token, options = {} } = req.body;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token là bắt buộc'
            });
        }

        const result = jwtService.verifyToken(token, options);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/jwt/decode:
 *   post:
 *     summary: Giải mã JWT token
 *     description: Giải mã JWT token mà không xác thực (chỉ để xem thông tin)
 *     tags: [JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token cần giải mã
 *                 example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Giải mã token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 header:
 *                   type: object
 *                   example:
 *                     alg: "RS256"
 *                     typ: "JWT"
 *                 payload:
 *                   type: object
 *                   example:
 *                     user_id: 123
 *                     role: "admin"
 *                     username: "Tkon"
 *       400:
 *         description: Token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Token không hợp lệ"
 */
router.post('/decode', (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token là bắt buộc'
            });
        }

        const result = jwtService.decodeToken(token);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/jwt/check-expiration:
 *   post:
 *     summary: Kiểm tra thời gian hết hạn của token
 *     description: Kiểm tra xem token có hết hạn chưa và thời gian còn lại
 *     tags: [JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token cần kiểm tra
 *                 example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Kiểm tra thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isExpired:
 *                   type: boolean
 *                   example: false
 *                 expirationTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-15T10:30:00.000Z"
 *                 timeRemaining:
 *                   type: integer
 *                   example: 3600
 *                 timeRemainingFormatted:
 *                   type: string
 *                   example: "1 giờ"
 *       400:
 *         description: Token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Token không có thời gian hết hạn"
 */
router.post('/check-expiration', (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token là bắt buộc'
            });
        }

        const result = jwtService.checkTokenExpiration(token);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 