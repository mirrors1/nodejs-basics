import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import studentsRouter from './routers/students.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

// Читаємо змінну оточення PORT
const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  // Express буде автоматично парсити тіло запиту і поміщати його в req.body
  // але тільки, якщо тип контенту встановлений як application/json за допомогою хедеру Content-Type.
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Middleware для логування часу запиту
  app.use((req, res, next) => {
    console.log('\x1b[36m%s\x1b[0m', `Time: ${new Date().toLocaleString()}`);
    //  fetch('https://ipapi.co/json/')
    //     .then(d => d.json())
    //     .then(d => console.log(`Користувач з ${d.country}`));
    next();
  });

  // Маршрут для обробки GET-запитів на '/'
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  //Маршрут для студентів
  app.use(studentsRouter);

  //middleware обробки випадку, коли клієнт звертається до неіснуючого маршруту
  app.use('*', notFoundHandler);

  // Middleware для обробких помилок
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
