// src/controllers/students.js

import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from '../services/students.js';
import createHttpError from 'http-errors';

//Контролер для отримання колекції всіх студентів
export const getStudentsController = async (req, res, next) => {
  const students = await getAllStudents();

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

//Контролер для отримання студента за його id
export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);
  // Відповідь, якщо контакт не знайдено
  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  // Відповідь, якщо контакт знайдено
  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};

//Контролер роута POST запиту
export const createStudentController = async (req, res) => {
  const student = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a student!`,
    data: student,
  });
};

//Контролер роута DELETE /students/:studentId
export const deleteStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const student = await deleteStudent(studentId);

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(204).send();
};

//Контроллер маршрута PUT /students/:studentId, за допомогою якого користувачі зможуть оновлювати дані студентів в базі даних.
export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await updateStudent(studentId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a student!`,
    data: result.student,
  });
};

//Контроллер маршрута PACTH /students/:studentId, за допомогою якого користувачі зможуть оновити одне поле про студента, а не весь об'єкт в базі даних.
export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const result = await updateStudent(studentId, req.body);

  if (!result) {
    next(createHttpError(404, `Student not fount`));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a student`,
    data: result.student,
  });
};
