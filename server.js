import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // <-- 1. Import cors
import dns from 'dns';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { connectToDb, getDb } from './src/db/connect.js';
import router from './src/router.js';

// Configure custom DNS servers for reliable MongoDB Atlas connectivity
dns.setServers(['8.8.8.8', '1.1.1.1']);


const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // <-- 2. Enable CORS for all origins (or pass configuration options if needed)
app.use(express.json());

// 1. Load the Swagger YAML file from the root directory
const swaggerDocument = YAML.load('./swagger.yaml');
// Point Swagger Try it out at this server. Set API_BASE_URL for deployments.
swaggerDocument.servers = [{ url: process.env.API_BASE_URL || `http://localhost:${PORT}`, description: 'Current API server' }];

// 2. Serve Swagger documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 3. Mount your app's API router
app.use('/', router);

// Start Server & Connect to Database
const startServer = async () => {
    try {
        await connectToDb();
        console.log('Database connection verified successfully.');

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

startServer();