// src/controllers/students.js

import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from '../services/students.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

//Контролер для отримання колекції всіх студентів
export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

//Контролер для отримання студента за його id
export const getStudentByIdController = async (req, res) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);
  // Відповідь, якщо контакт не знайдено
  if (!student) {
    throw createHttpError(404, `Student with id:${studentId} not found`);
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
export const deleteStudentController = async (req, res) => {
  const { studentId } = req.params;

  const student = await deleteStudent(studentId);

  if (!student) {
    throw createHttpError(404, `Student with id:${studentId} not found`);
  }

  res.status(204).send();
};

//Контроллер маршрута PUT /students/:studentId, за допомогою якого користувачі зможуть оновлювати дані студентів в базі даних, або додати якщо id відсутній в базі даних {upsert: true}.
export const upsertStudentController = async (req, res) => {
  const { studentId } = req.params;

  const result = await updateStudent(studentId, req.body, {
    upsert: true,
  });

  if (!result) {
    throw createHttpError(404, `Student with id:${studentId} not found`);
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a student!`,
    data: result.student,
  });
};

//Контроллер маршрута PACTH /students/:studentId, за допомогою якого користувачі зможуть оновити одне поле про студента, а не весь об'єкт в базі даних.
export const patchStudentController = async (req, res) => {
  const { studentId } = req.params;
  const result = await updateStudent(studentId, req.body);

  if (!result) {
    throw createHttpError(404, `Student with id:${studentId} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully patched a student`,
    data: result.student,
  });
};
