import { body } from "express-validator"

const validateLogin = [
    body('email').notEmpty().withMessage("L'email est requis"),
    body('password').notEmpty().withMessage("Le mot de passe est requis"),
]




export default validateLogin