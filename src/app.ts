import mongoose from 'mongoose';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { Joi, celebrate, errors } from 'celebrate';
import { errorFind, errorUnknown, errorUserExists } from './utils/const';
import routerUser from './routes/user';
import { requestLogger, errorLogger } from './middlewares/logger';
import routerCard from './routes/card';
import auth from './middlewares/auth';
import { login, postUser } from './controllers/user';

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), postUser);

app.use(auth);

app.use('/cards', routerCard);
app.use('/users', routerUser);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(errorFind).send({ message: 'Запрашиваемый ресурс не найден' });
  next();
});

app.use(errorLogger);

app.use(errors());

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  const { statusCode = 500, message, code } = err;
  let textMessage;

  if (statusCode === errorUnknown) {
    textMessage = 'На сервере произошла ошибка';
  } else if (code === errorUserExists) {
    textMessage = 'Данный "email" уже зарегестрирован';
  } else {
    textMessage = message;
  }

  res.status(err.statusCode).send({ message: textMessage });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`Connect: ${PORT}`);
});
