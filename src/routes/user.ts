import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import {
  getUsers, getUserId, changingUser, changingAvatar, getUserMe,
} from '../controllers/user';

const routerUser = Router();
routerUser.get('/', getUsers);
routerUser.get('/me', getUserMe);

routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserId);

routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    user: Joi.object().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), changingUser);

routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    user: Joi.object().required(),
    avatar: Joi.string().uri(),
  }),
}), changingAvatar);

export default routerUser;
