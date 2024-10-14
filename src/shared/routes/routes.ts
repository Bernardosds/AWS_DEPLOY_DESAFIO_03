import {Router} from 'express'
import orderRouter from '../../modules/Order/routes/OrderRoutes'
import carRoutes from '../../modules/cars/routes/routes'
import customerRouter from '../../modules/customers/routes/CustomerRoute';
import userRouter from '../../modules/users/routes/UsersRoutes';

const routes = Router();

routes.use('/order', orderRouter)
routes.use('/car', carRoutes)
routes.use('/customer', customerRouter)
routes.use('/user', userRouter)

export default routes