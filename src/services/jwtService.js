const jwt = require('jsonwebtoken');
const keyService = require('./keyService');

class JWTService {
    /**
     * Tạo JWT token sử dụng RSA256
     * @param {Object} payload - Dữ liệu payload của token
     * @param {Object} options - Tùy chọn cho token (expiresIn, issuer, etc.)
     * @returns {string} - JWT token
     */
    createToken(payload, options = {}) {
        try {
            const privateKey = keyService.getPrivateKey();
            
            const defaultOptions = {
                algorithm: 'RS256',
                expiresIn: '24h',
                issuer: 'jwt-rsa256-api',
            };

            const tokenOptions = { ...defaultOptions, ...options };
            const token = jwt.sign(payload, privateKey, tokenOptions);
            return {
                success: true,
                token: token,
                payload: payload,
                options: tokenOptions
            };
        } catch (error) {
            throw new Error(`Lỗi khi tạo token: ${error.message}`);
        }
    }

    /**
     * Xác thực JWT token
     * @param {string} token - JWT token cần xác thực
     * @param {Object} options - Tùy chọn xác thực
     * @returns {Object} - Dữ liệu đã giải mã
     */
    verifyToken(token, options = {}) {
        try {
            const publicKey = keyService.getPublicKey();
            
            const defaultOptions = {
                algorithms: ['RS256'],
                issuer: 'jwt-rsa256-api',
                ignoreExpiration: false
            };

            const verifyOptions = { ...defaultOptions, ...options };
            
            const decoded = jwt.verify(token, publicKey, verifyOptions);
            
            return {
                success: true,
                valid: true,
                decoded: decoded,
                header: jwt.decode(token, { complete: true })?.header
            };
        } catch (error) {
            return {
                success: false,
                valid: false,
                error: error.message,
                name: error.name
            };
        }
    }

    /**
     * Giải mã token mà không xác thực (chỉ để xem thông tin)
     * @param {string} token - JWT token
     * @returns {Object} - Thông tin token
     */
    decodeToken(token) {
        try {
            const decoded = jwt.decode(token, { complete: true });
            
            if (!decoded) {
                throw new Error('Token không hợp lệ');
            }

            return {
                success: true,
                header: decoded.header,
                payload: decoded.payload,
                signature: decoded.signature
            };
        } catch (error) {
            throw new Error(`Lỗi khi giải mã token: ${error.message}`);
        }
    }

    /**
     * Kiểm tra token có hết hạn chưa
     * @param {string} token - JWT token
     * @returns {Object} - Thông tin về thời gian hết hạn
     */
    checkTokenExpiration(token) {
        try {
            const decoded = jwt.decode(token);
            
            if (!decoded || !decoded.exp) {
                throw new Error('Token không có thời gian hết hạn');
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const expirationTime = decoded.exp;
            const isExpired = currentTime >= expirationTime;
            const timeRemaining = isExpired ? 0 : expirationTime - currentTime;

            return {
                success: true,
                isExpired: isExpired,
                expirationTime: new Date(expirationTime * 1000),
                timeRemaining: timeRemaining,
                timeRemainingFormatted: this.formatTimeRemaining(timeRemaining)
            };
        } catch (error) {
            throw new Error(`Lỗi khi kiểm tra thời gian hết hạn: ${error.message}`);
        }
    }

    /**
     * Format thời gian còn lại thành chuỗi dễ đọc
     * @param {number} seconds - Số giây còn lại
     * @returns {string} - Chuỗi thời gian đã format
     */
    formatTimeRemaining(seconds) {
        if (seconds <= 0) return 'Đã hết hạn';
        
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts = [];
        if (days > 0) parts.push(`${days} ngày`);
        if (hours > 0) parts.push(`${hours} giờ`);
        if (minutes > 0) parts.push(`${minutes} phút`);
        if (secs > 0) parts.push(`${secs} giây`);

        return parts.join(', ');
    }
}

module.exports = new JWTService(); 