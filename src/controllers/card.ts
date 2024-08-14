import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import RequestError from '../errors/request-err';
import AuthError from '../errors/auth-err';
import NotFoundError from '../errors/not-found-err';
import { successfulResponse } from '../utils/const';

export const createCard = (req:Request, res:Response, next:NextFunction) => {
  const {
    name, link, user,
  } = req.body;
  return Card.create({
    name, link, owner: user._id,
  })
    .then((card) => {
      if (!card) throw new RequestError('Переданы некорректные данные');
      return res.status(successfulResponse).send(card);
    })
    .catch(next);
};

export const getCards = (req:Request, res:Response, next:NextFunction) => Card.find({})
  .then((card) => {
    if (!card) throw new RequestError('Переданы некорректные данные');
    return res.send({ cards: card });
  })
  .catch(next);

export const deleteCard = (req:Request, res:Response, next:NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const user = card?.owner.toString();
      if (!card) throw new AuthError('Карточка с указанным _id не найдена');

      if (user !== req.body.user._id) throw new AuthError('У пользователя отсутствуют права на совершение этого действия');
      else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((deletedCard) => res.send(deletedCard));
      }
    })
    .catch(next);
};

export const likeCard = (req:Request, res:Response, next:NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.body.user._id } }, // добавить _id в массив, если его там нет
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) throw new NotFoundError('Карточка с указанным _id не найден');
    else res.send(card);
  })
  .catch(next);

export const dislikeCard = (req:Request, res:Response, next:NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.body.user._id } }, // убрать _id из массива
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) throw new NotFoundError('Карточка с указанным _id не найден');
    else res.send(card);
  })
  .catch(next);
