import {Request, Response} from 'express';
import Card from '../models/card'


export const createCard = (req:Request, res:Response) => {
  const {name, link, owner, likes} = req.body
return Card.create({name, link, owner, likes})
.then(card => res.send(card))
.catch(()=> res.status(400).send({ message: 'Переданы некорректные данные' }));
};

export const getCards =(req:Request, res:Response)=>{
  return Card.find({})
  .then(card=>res.send({cards:card}))
  .catch(()=> res.status(400).send({message:'Переданы некорректные данные'}))
};

export const deleteCard =(req:Request, res:Response)=>{
  return Card.findByIdAndDelete(req.params.cardId)
  .then(card => res.send({cards:card}))
  .catch(()=> res.status(404).send({message:'Карточка с указанным _id не найдена.'}))
};

export const likeCard = (req:Request, res:Response) => Card.findByIdAndUpdate(
  req.params.cardId,
   { $addToSet: { likes: req.body.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
.then((card) => {
  if (!card) {
    res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
  } else {
    res.send(card);
  }
}) 
.catch(()=>res.status(500).send({message:'Переданы некорректные данные'}))

export const dislikeCard = (req:Request, res:Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.body.user._id } }, // убрать _id из массива
  { new: true },
)
.then((card) => {
  if (!card) {
    res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
  } else {
    res.send(card);
  }
}) 
.catch(()=>res.status(500).send({message:'Переданы некорректные данные'}))
