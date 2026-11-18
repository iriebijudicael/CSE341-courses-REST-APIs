// app.js
import express from 'express'; //week01
import router from './src/router.js'; //week01
import swaggerUi from 'swagger-ui-express'; //week02
import YAML from 'yamljs'; //week02

const app = express();

app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});

// Week02
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;