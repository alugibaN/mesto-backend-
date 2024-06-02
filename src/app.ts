import mongoose from "mongoose";
import routerUser from "./routes/user";
import express, { NextFunction, Request, Response } from 'express';
import routerCard from "./routes/card";

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use((req:Request, res:Response, next:NextFunction) => {

  req.body.user = {
    _id: '665c12d92b4b9f366311fd5a' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/cards', routerCard)

app.use("/users", routerUser);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`Connect: ${PORT}`);
});


