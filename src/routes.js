import { Router } from 'express';
import client from './libs/redis';
import UserController from './Controllers/User.Controller';
import PostController from './Controllers/Post.Controller';
import './Models/initdbConnect';
const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});

routes.use('/user/',UserController);
routes.use('/post',PostController);
export default routes;
