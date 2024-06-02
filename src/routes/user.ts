import { postUser, getUsers, getUserId, changingUser, changingAvatar } from "../controllers/user";
import { Router } from "express";

const routerUser = Router();
routerUser.post('/', postUser);
routerUser.get('/', getUsers);
routerUser.get('/:userId', getUserId);
routerUser.patch('/me', changingUser);
routerUser.patch('/me/avatar', changingAvatar);


export default routerUser