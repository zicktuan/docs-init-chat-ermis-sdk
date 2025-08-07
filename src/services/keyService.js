const fs = require('fs');
const NodeRSA = require('node-rsa');
const path = require('path');

class KeyService {
    constructor() {
        this.privateKeyPath = path.join(__dirname, '../../keys/private.pem');
        this.publicKeyPath = path.join(__dirname, '../../keys/public.pem');
        this.ensureKeyDirectory();
    }

    /**
     * Đảm bảo thư mục keys tồn tại
     */
    ensureKeyDirectory() {
        const keyDir = path.dirname(this.privateKeyPath);
        if (!fs.existsSync(keyDir)) {
            fs.mkdirSync(keyDir, { recursive: true });
        }
    }

    /**
     * Tạo cặp khóa RSA mới
     * @param {number} keySize - Kích thước khóa (mặc định: 2048)
     * @returns {Object} - Thông tin về khóa đã tạo
     */
    generateKeys(keySize = 2048) {
        try {
            const key = new NodeRSA({ b: keySize });
            
            const privateKey = key.exportKey('pkcs8-private-pem');
            const publicKey = key.exportKey('pkcs8-public-pem');

            // Lưu khóa vào file
            fs.writeFileSync(this.privateKeyPath, privateKey);
            fs.writeFileSync(this.publicKeyPath, publicKey);

            return {
                success: true,
                message: `Đã tạo thành công cặp khóa RSA ${keySize} bit`,
                privateKeyPath: this.privateKeyPath,
                publicKeyPath: this.publicKeyPath,
                publicKey: publicKey
            };
        } catch (error) {
            throw new Error(`Lỗi khi tạo khóa: ${error.message}`);
        }
    }

    /**
     * Kiểm tra xem khóa đã tồn tại chưa
     * @returns {boolean}
     */
    keysExist() {
        return fs.existsSync(this.privateKeyPath) && fs.existsSync(this.publicKeyPath);
    }

    /**
     * Đọc khóa private từ file
     * @returns {string}
     */
    getPrivateKey() {
        if (!this.keysExist()) {
            throw new Error('Khóa chưa được tạo. Vui lòng tạo khóa trước.');
        }
        return fs.readFileSync(this.privateKeyPath, 'utf8');
    }

    /**
     * Đọc khóa public từ file
     * @returns {string}
     */
    getPublicKey() {
        if (!this.keysExist()) {
            throw new Error('Khóa chưa được tạo. Vui lòng tạo khóa trước.');
        }
        return fs.readFileSync(this.publicKeyPath, 'utf8');
    }

    /**
     * Xóa khóa hiện tại
     * @returns {Object}
     */
    deleteKeys() {
        try {
            if (fs.existsSync(this.privateKeyPath)) {
                fs.unlinkSync(this.privateKeyPath);
            }
            if (fs.existsSync(this.publicKeyPath)) {
                fs.unlinkSync(this.publicKeyPath);
            }
            return {
                success: true,
                message: 'Đã xóa thành công cặp khóa'
            };
        } catch (error) {
            throw new Error(`Lỗi khi xóa khóa: ${error.message}`);
        }
    }
}

module.exports = new KeyService(); 