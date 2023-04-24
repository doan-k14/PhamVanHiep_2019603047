import { Router } from 'express'
import manufacturerController from '../controllers/manufacturerController.js'
import { body } from 'express-validator'

const validators = [
  body('name').trim().isLength({ min: 1 }).withMessage('Bắt buộc nhập tên nhà sản xuất').escape(),
]

const manufacturerRouter = Router()

manufacturerRouter.get('/query', manufacturerController.getPaging)

manufacturerRouter.get('/newCode', manufacturerController.getNewCode)

manufacturerRouter.get('/total', manufacturerController.getTotal)

manufacturerRouter.get('/:id', manufacturerController.get)

manufacturerRouter.get('/', manufacturerController.getAll)

manufacturerRouter.post('/', validators, manufacturerController.create)

manufacturerRouter.put('/:id', validators, manufacturerController.update)

manufacturerRouter.delete('/:id', manufacturerController.delete)

export default manufacturerRouter
