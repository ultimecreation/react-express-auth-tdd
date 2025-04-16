import { validationResult } from "express-validator"
import UserModel from "../models/UserModel.js"
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"
import config from 'config'
class AuthController {

    static async register(req, res) {
        const errors = {}
        if (!req.body) {
            errors.body = "Aucune données reçues"
            return res.status(401).json({ errors: errors })
        }

        validationResult(req).array().forEach(error => {
            errors[error.path] = error.msg
        })
        if (Object.keys(errors).length > 0) return res.status(401).json({ errors: errors })

        const { username, email, password } = req.body
        const hashedPassword = await bcryptjs.hash(password, 13)
        const savedUser = await UserModel.create({
            username, email, password: hashedPassword
        })
        if (savedUser) return res.status(201).json({})
    }
    static async login(req, res) {

        const errors = {}
        if (!req.body) {
            errors.body = "Aucune données reçues"
            return res.status(401).json({ errors: errors })
        }

        validationResult(req).array().forEach(error => {
            errors[error.path] = error.msg
        })
        if (Object.keys(errors).length > 0) return res.status(401).json({ errors: errors })

        const { email, password } = req.body
        const userFound = await UserModel.findOne({ where: { email: email } })
        if (!userFound) {
            errors.credentials = "Les identifiants ne sont pas valides"
            return res.status(401).json({ errors: errors })
        }

        const passwordsMatch = await bcryptjs.compare(password, userFound.password)
        if (!passwordsMatch) {
            errors.credentials = "Les identifiants ne sont pas valides"
            return res.status(401).json({ errors: errors })
        }

        const jwtSecret = config.get("jwtSecret")
        const jwtToken = jwt.sign({ email: userFound.email }, jwtSecret)
        console.log("TEST", jwtSecret, jwtToken)
        return res.status(200).json({ token: jwtToken })

    }
}
export default AuthController