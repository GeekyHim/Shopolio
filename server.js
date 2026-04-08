require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const db_config = require('./configs/db.config');
const swaggerConfig = require('./configs/swagger');
const user_model = require('./models/user.model');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

app.get('/ping', (req, res) => res.status(200).json({ status: 'active' }));

require("./routes/auth")(app);
require("./routes/category.routes")(app);
require("./routes/products")(app);
require("./routes/orders")(app);

if (swaggerConfig.swaggerEnabled && swaggerConfig.swaggerSpec) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig.swaggerSpec));
}

async function initAdmin() {
  const user = await user_model.findOne({ userId: "ADMIN" });
  if (user) return;

  await user_model.create({
    name: "Himanshu",
    userId: "ADMIN",
    email: "university.himanshu@gmail.com",
    userType: "ADMIN",
    password: bcrypt.hashSync("Welcome1", 8),
  });
}

async function start() {
  const port = Number(process.env.PORT) || 5000;
  const mongoUri = process.env.MONGO_URI || db_config.DB_URL;

  if (
    !mongoUri ||
    mongoUri.includes('<') ||
    mongoUri.includes('>') ||
    !/^mongodb(\+srv)?:\/\//.test(mongoUri)
  ) {
    throw new Error(
      'Invalid MONGO_URI. Set a valid MongoDB connection string (mongodb://... or mongodb+srv://...) in .env'
    );
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected`);
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }

  try {
    await initAdmin();
  } catch (err) {
    console.error('Admin init failed', err);
  }

  const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  server.on('error', (err) => {
    console.error('Server startup failed', err);
    process.exit(1);
  });
}

start().catch((err) => {
  console.error('Fatal startup error', err);
  process.exit(1);
});
