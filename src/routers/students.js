// src/routers/students.js

import { Router } from 'express';
import {
  getStudentsController,
  getStudentByIdController,
  createStudentController,
  deleteStudentController,
  upsertStudentController,
  patchStudentController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createStudentSchema,
  updateStudentSchema,
} from '../validation/students.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

//Маршрут для отримання колекції всіх студентів
router.get('/students', ctrlWrapper(getStudentsController));

//Маршрут для отримання студента за його id
router.get(
  '/students/:studentId',
  isValidId,
  ctrlWrapper(getStudentByIdController),
);

//Маршрут для додавання студента
router.post(
  '/students',
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController),
);

//Маршрут для видалення студента
router.delete(
  '/students/:studentId',
  isValidId,
  ctrlWrapper(deleteStudentController),
);

//Маршрут для оновлення студента (існуючий запис), або його додаваня, якщо він не існує
router.put(
  '/students/:studentId',
  validateBody(createStudentSchema),
  isValidId,
  ctrlWrapper(upsertStudentController),
);

//Маршрут для оновлення одного поля у студента
router.patch(
  `/students/:studentId`,
  validateBody(updateStudentSchema),
  isValidId,
  ctrlWrapper(patchStudentController),
);

export default router;
