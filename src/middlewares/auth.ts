import { NextFunction, Request, Response } from 'express';
// middlewares/auth.ts
import jwt from 'jsonwebtoken';
import { errorAuth } from '../utils/const';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res
      .status(errorAuth)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer =', '');
  console.log(token);
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(errorAuth)
      .send({ message: 'Необходима авторизация' });
  }

  req.body.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
