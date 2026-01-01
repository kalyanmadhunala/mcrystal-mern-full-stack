import express from 'express'
import { googleSigin, setPassword } from '../controllers/googleController.js';

const googleRouter = express.Router();

googleRouter.post('/auth', googleSigin)
googleRouter.post('/set-password', setPassword)

export default googleRouter;
