import { Router } from 'express'
import AuthController from './controller/AuthController.js'
import validateRegister from './middleware/validators/validateRegister.js'
import validateLogin from './middleware/validators/validateLogin.js'

const router = Router()

router.post('/auth/register', validateRegister, AuthController.register)
router.post('/auth/login', validateLogin, AuthController.login)

export default router