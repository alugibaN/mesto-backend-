import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/card';

const routerCard = Router();

routerCard.post('/', celebrate({
  body: Joi.object().keys({
    user: Joi.object().required(),
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().min(2).max(200).uri()
      .required(),
  }),
}), createCard);

routerCard.get('/', getCards);

routerCard.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCard);

routerCard.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);

routerCard.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

export default routerCard;
