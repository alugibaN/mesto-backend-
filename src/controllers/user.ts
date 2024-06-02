import {Request, Response} from 'express';
import  User from '../models/user'

export const  postUser =(req:Request, res:Response)=>{
  const {name, about,avatar} = req.body 
  return User.create({name,about, avatar})
  .then((users)=>res.send({dat:users}))
  .catch(()=> res.status(400).send({ message: 'Переданы некорректные данные' }));
};

export const getUsers = (req:Request, res:Response)=>{
  return User.find({})
  .then((user)=> res.send({users:user}))
  .catch(() => res.status(404).send({ message: 'Переданы некорректные данные' }));
};

export const getUserId = (req: Request, res: Response) => {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const changingUser = (req:Request, res:Response)=>{
  const {name, about}= req.body
  return User.findByIdAndUpdate(req.body.user._id, {name:name, about:about},{new:true})
  .then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    } else {
      res.send(user);
    }
  })  
  .catch(()=> res.status(400).send({message:'Переданы некорректные данные при обновлении профиля'}))
}

export const changingAvatar =(req:Request, res:Response)=>{
  const {avatar} = req.body;
  return User.findByIdAndUpdate(req.body.user._id, {avatar:avatar}, {new:true})
  .then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    } else {
      res.send(user);
    }
  })  
  .catch(()=>res.status(400).send({messages: 'Переданы некорректные данные при обновлении профиля'}))
  
};