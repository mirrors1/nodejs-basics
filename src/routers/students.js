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
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

//Перевіряє аутентифікацію кориристувача для використання маршрутів, що нижче
router.use(authenticate);

//Маршрут для отримання колекції всіх студентів
router.get('/', checkRoles(ROLES.TEACHER), ctrlWrapper(getStudentsController));

//Маршрут для отримання студента за його id
router.get(
  '/:studentId',
  isValidId,
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  ctrlWrapper(getStudentByIdController),
);

//Маршрут для додавання студента
router.post(
  '/',
  checkRoles(ROLES.TEACHER),
  upload.single('photo'),
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController),
);

//Маршрут для видалення студента
router.delete(
  '/:studentId',
  isValidId,
  checkRoles(ROLES.TEACHER),
  ctrlWrapper(deleteStudentController),
);

//Маршрут для оновлення студента (існуючий запис), або його додаваня, якщо він не існує
router.put(
  '/:studentId',
  isValidId,
  checkRoles(ROLES.TEACHER),
  upload.single('photo'),
  validateBody(createStudentSchema),
  ctrlWrapper(upsertStudentController),
);

//Маршрут для оновлення одного поля у студента
router.patch(
  `/:studentId`,
  isValidId,
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  upload.single('photo'),
  validateBody(updateStudentSchema),
  ctrlWrapper(patchStudentController),
);

export default router;
