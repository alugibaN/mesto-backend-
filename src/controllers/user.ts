import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthError from '../errors/auth-err';
import RequestError from '../errors/request-err';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';

export const postUser = (req: Request, res: Response, next:NextFunction) => {
  const {
    name, about, avatar, email,
  } = req.body;
  User.findOne({ email }).then((emailCheck) => {
    if (emailCheck) {
      throw new RequestError('Пользователь с таким email уже существует');
    }
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }).then(
        (users) => res.send({ data: users }),
      ))
      .catch(next);
  });
};

export const getUsers = (req: Request, res: Response, next:NextFunction) => User.find({})
  .then((user) => {
    if (!user) throw new NotFoundError('Переданы некорректные данные');
    else res.send({ users: user });
  })
  .catch(next);

export const getUserId = (req: Request, res: Response, next:NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
      else res.send(user);
    })
    .catch(next);
};

export const changingUser = (req: Request, res: Response, next:NextFunction) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.body.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
      else res.send(user);
    })
    .catch(next);
};

export const changingAvatar = (req: Request, res: Response, next:NextFunction) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.body.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
      else res.send(user);
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next:NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new AuthError('Неправильные почта или пароль');
      return bcrypt.compare(password, user.password)

        .then((matched) => {
          if (!matched) throw new AuthError('Неправильные почта или пароль');
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          return res.cookie('Bearer ', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          }).send(user);
        });
    })
    .catch(next);
};

export const getUserMe = (req:Request, res:Response, next:NextFunction) => {
  User.findById(req.body.user._id)
    .then((user) => {
      if (!user) throw new RequestError('Не известная ошибка');
      return res.send(user);
    })
    .catch(next);
};
