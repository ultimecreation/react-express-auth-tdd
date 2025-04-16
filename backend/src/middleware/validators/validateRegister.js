import { body } from "express-validator";
import validateLogin from "./validateLogin.js";
import UserModel from "../../models/UserModel.js";


const validateRegister = [
    ...validateLogin,
    body('username').notEmpty().withMessage("Le nom est requis"),
    body('passwordConfirm')
        .notEmpty()
        .withMessage("La confirmation du mot de passe est requise")
        .bail()
        .custom((passwordConfirm, { req }) => {
            return passwordConfirm === req.body.password
        }).withMessage("Les mots de passe ne correspondent pas"),
    body('email').custom(async email => {
        const emailExists = await UserModel.findOne({ where: { email } })
        if (emailExists) throw new Error("L'email est déjà utilisé")
    })
]

export default validateRegister