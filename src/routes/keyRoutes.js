const express = require('express');
const router = express.Router();
const keyService = require('../services/keyService');

/**
 * @swagger
 * /api/keys/generate:
 *   post:
 *     summary: Tạo cặp khóa RSA mới
 *     description: Tạo cặp khóa RSA private và public mới với kích thước tùy chọn
 *     tags: [Keys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keySize:
 *                 type: integer
 *                 description: Kích thước khóa (mặc định 2048)
 *                 example: 2048
 *     responses:
 *       200:
 *         description: Tạo khóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã tạo thành công cặp khóa RSA 2048 bit"
 *                 privateKeyPath:
 *                   type: string
 *                   example: "/path/to/private.pem"
 *                 publicKeyPath:
 *                   type: string
 *                   example: "/path/to/public.pem"
 *                 publicKey:
 *                   type: string
 *                   example: "-----BEGIN PUBLIC KEY-----..."
 *       400:
 *         description: Lỗi khi tạo khóa
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
 *                   example: "Lỗi khi tạo khóa"
 */
router.post('/generate', (req, res) => {
    try {
        const { keySize = 2048 } = req.body;
        
        if (keySize < 1024 || keySize > 4096) {
            return res.status(400).json({
                success: false,
                error: 'Kích thước khóa phải từ 1024 đến 4096 bit'
            });
        }

        const result = keyService.generateKeys(keySize);
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
 * /api/keys/status:
 *   get:
 *     summary: Kiểm tra trạng thái khóa
 *     description: Kiểm tra xem khóa đã được tạo chưa
 *     tags: [Keys]
 *     responses:
 *       200:
 *         description: Trạng thái khóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Khóa đã tồn tại"
 */
router.get('/status', (req, res) => {
    const exists = keyService.keysExist();
    res.json({
        exists: exists,
        message: exists ? 'Khóa đã tồn tại' : 'Khóa chưa được tạo'
    });
});

/**
 * @swagger
 * /api/keys/public:
 *   get:
 *     summary: Lấy khóa public
 *     description: Lấy nội dung khóa public để sử dụng
 *     tags: [Keys]
 *     responses:
 *       200:
 *         description: Khóa public
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 publicKey:
 *                   type: string
 *                   example: "-----BEGIN PUBLIC KEY-----..."
 *       404:
 *         description: Khóa chưa được tạo
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
 *                   example: "Khóa chưa được tạo"
 */
router.get('/public', (req, res) => {
    try {
        const publicKey = keyService.getPublicKey();
        res.json({
            success: true,
            publicKey: publicKey
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/keys/delete:
 *   delete:
 *     summary: Xóa cặp khóa hiện tại
 *     description: Xóa cả khóa private và public hiện tại
 *     tags: [Keys]
 *     responses:
 *       200:
 *         description: Xóa khóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã xóa thành công cặp khóa"
 *       400:
 *         description: Lỗi khi xóa khóa
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
 *                   example: "Lỗi khi xóa khóa"
 */
router.delete('/delete', (req, res) => {
    try {
        const result = keyService.deleteKeys();
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 