import supertest from "supertest"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import config from 'config'
import UserModel from "../../src/models/UserModel"
import app from '../../src/app.js'



describe('Login', () => {

    test('Returns 401 status when no data are received', async () => {

        const response = await supertest(app).post('/auth/login')
        const receivedData = JSON.parse(response.text)

        expect(response.status).toBe(401)
        expect(receivedData.errors.body).toBe("Aucune données reçues")
    })

    test('Returns 401 status when email and password are empty', async () => {

        const response = await supertest(app).post('/auth/login').send({
            email: "",
            password: ""
        })
        const receivedData = JSON.parse(response.text)

        expect(response.status).toBe(401)
        expect(receivedData).toEqual({
            errors: {
                email: "L'email est requis",
                password: "Le mot de passe est requis"
            }
        })
    })

    test('Returns 401 status when user is not found by its email', async () => {

        const response = await supertest(app).post('/auth/login').send({
            email: "mail@mail.com",
            password: "123"
        })
        const receivedData = JSON.parse(response.text)

        expect(response.status).toBe(401)
        expect(receivedData).toEqual({
            errors: {
                credentials: "Les identifiants ne sont pas valides"
            }
        })
    })

    test('Returns 401 status when user is found but password received do not match with stored password', async () => {
        const hashedPassword = await bcryptjs.hash("123", 13)
        const savedUser = await UserModel.create({
            username: "username",
            email: "mail@mail.com",
            password: hashedPassword
        })

        const response = await supertest(app).post('/auth/login').send({
            email: "mail@mail.com",
            password: "1234"
        })
        const receivedData = JSON.parse(response.text)

        expect(response.status).toBe(401)
        expect(receivedData).toEqual({
            errors: {
                credentials: "Les identifiants ne sont pas valides"
            }
        })
    })

    test('Returns 200 status with jwt token when user is found and password received match with stored password', async () => {
        const hashedPassword = await bcryptjs.hash("123", 13)
        await UserModel.create({
            username: "username",
            email: "mail@mail.com",
            password: hashedPassword
        })

        const response = await supertest(app).post('/auth/login').send({
            email: "mail@mail.com",
            password: "123"
        })
        const receivedData = JSON.parse(response.text)

        expect(response.status).toBe(200)

        const jwtSecret = config.get('jwtSecret')
        const decodedData = jwt.verify(receivedData.token, jwtSecret)

        expect(decodedData.email).toBe("mail@mail.com")
    })


})