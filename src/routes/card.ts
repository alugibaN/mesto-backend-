import {Router} from "express"
import {createCard, deleteCard, dislikeCard, getCards, likeCard} from '../controllers/card'

const routerCard = Router();

routerCard.post('/', createCard);
routerCard.get('/', getCards);
routerCard.delete('/:cardId', deleteCard);
routerCard.put('/:cardId/likes', likeCard);
routerCard.delete('/:cardId/likes', dislikeCard)


export default routerCard
