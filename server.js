const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const { ErmisChat } = require('ermis-chat-js-sdk');
const fs = require('fs')
const {transformSync} = require('esbuild');

// Import routes
const keyRoutes = require('./src/routes/keyRoutes');
const jwtRoutes = require('./src/routes/jwtRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const options = {
    timeout: 6000,
    baseURL: 'https://api-test.ermis.network',
    allowServerSideConnect: true,
}

const API_KEY = "iVbOQYXpP3RPF72mTzMyaC0ACfha6tma";
const PROJECT_ID = "8531690b-11a7-4568-acc0-7180c2e0f774";

const chatClient = ErmisChat.getInstance(API_KEY, PROJECT_ID, options);

app.use(express.static('public'));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JWT RSA256 API',
            version: '1.0.0',
            description: 'API để tạo và xác thực JWT tokens sử dụng thuật toán RSA256',
            contact: {
                name: 'API Support',
            },
            license: {
                name: 'Ermis Team',
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            example: 'Error message'
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operation successful'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'JWT RSA256 API Documentation'
}));

// Routes
app.use('/api/keys', keyRoutes);
app.use('/api/jwt', jwtRoutes);
// app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat/connect', async (req, res) => {
    const { user_id, token } = req.body;
    if (!user_id || !token) {
        return res.status(400).json({
          success: false,
          error: 'Missing user_id or token',
        });
    }
    try {
        const user = await chatClient.connectUser(
          {
            id: user_id,
            name: user_id,
            api_key: API_KEY,
          },
          token,
          true
        );
    
        res.json({
          success: true,
          message: 'User connected to Ermis Chat',
          user,
        });
      } catch (error) {
        console.error('Error connecting user to Ermis Chat:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to connect user',
          message: error.message,
        });
      }
});

app.get('/ermis-chat-sdk', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'ermis-chat-sdk.bundle.js');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File không tồn tại',
        message: 'Không tìm thấy file ermis-chat-sdk.bundle.js',
      });
    }
  
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Lỗi khi phục vụ file SDK:', err);
        res.status(500).json({
          success: false,
          error: 'Không thể tải SDK',
          message: err.message,
        });
      }
    });
  });

/**
 * @swagger
 * /:
 *   get:
 *     summary: Trang chủ API
 *     description: Thông tin về API JWT RSA256
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Thông tin API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "JWT RSA256 API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     keys:
 *                       type: string
 *                       example: "/api/keys"
 *                     jwt:
 *                       type: string
 *                       example: "/api/jwt"
 *                     docs:
 *                       type: string
 *                       example: "/api-docs"
 */
app.get('/', (req, res) => {
    res.json({
        message: 'JWT RSA256 API',
        version: '1.0.0',
        description: 'API để tạo và xác thực JWT tokens sử dụng thuật toán RSA256',
        endpoints: {
            keys: '/api/keys',
            jwt: '/api/jwt',
            docs: '/api-docs'
        },
        features: [
            'Tạo cặp khóa RSA',
            'Tạo JWT token với RSA256',
            'Xác thực JWT token',
            'Giải mã token',
            'Kiểm tra thời gian hết hạn'
        ]
    });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Kiểm tra trạng thái API
 *     description: Endpoint để kiểm tra xem API có hoạt động không
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API hoạt động bình thường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-15T10:30:00.000Z"
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `Route ${req.originalUrl} does not exist`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📚 Swagger Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔑 Keys API: http://localhost:${PORT}/api/keys`);
    console.log(`🎫 JWT API: http://localhost:${PORT}/api/jwt`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app; 