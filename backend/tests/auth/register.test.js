import supertest from "supertest"
import { beforeEach, describe, expect, test } from "vitest"
import app from "../../src/app.js"
import UserModel from "../../src/models/UserModel.js"
import bcrypt from "bcryptjs"

const validUser = {
    username: 'username',
    email: 'mail@mail.com',
    password: '123',
    passwordConfirm: '123'
}
const registerRequest = (user = validUser) => {
    return supertest(app).post('/auth/register').send(user)
}
beforeEach(async () => {
    await UserModel.destroy({ truncate: true })
})

describe('Auth/Register', () => {

    test('Returns status 401 along with error message when no data are sent', async () => {
        const response = await supertest(app).post('/auth/register').send().set('Accept', 'application/json')
        const receivedData = JSON.parse(response.text)

        expect(response.status).toEqual(401)
        expect(receivedData).toEqual({
            errors: {
                body: "Aucune données reçues"
            }
        })
    })

    test('Returns status 401 along with error messages when username, email,password and passwordConfirm are empty', async () => {

        const response = await registerRequest({
            username: '',
            email: '',
            password: '',
            passwordConfirm: ''
        })
        const receivedData = await JSON.parse(response.text)

        expect(receivedData).toEqual({
            errors: {
                username: 'Le nom est requis',
                email: "L'email est requis",
                password: "Le mot de passe est requis",
                passwordConfirm: "La confirmation du mot de passe est requise"
            }
        })
    })

    test('Returns status 401 along with error message when email is already taken', async () => {

        await UserModel.create(validUser)

        const response = await registerRequest()
        const receivedData = await JSON.parse(response.text)

        expect(response.status).toBe(401)
        expect(receivedData.errors.email).toBe("L'email est déjà utilisé")

    })

    test('Returns status 401 along with error message when password and passwordConfirm do not match', async () => {
        const response = await registerRequest({
            username: 'username',
            email: 'mail@email.com',
            password: '123',
            passwordConfirm: '1234'
        })
        const receivedData = await JSON.parse(response.text)

        expect(response.status).toBe(401)
        expect(receivedData.errors.passwordConfirm).toBe("Les mots de passe ne correspondent pas")

    })

    test('Returns status 201 when username, email,password and passwordConfirm are valid', async () => {

        const response = await registerRequest()

        expect(response.status).toBe(201)
    })

    test('Saved user data are properly saved and password is hashed', async () => {

        await registerRequest()

        const savedUser = await UserModel.findOne({ where: { email: 'mail@mail.com' } })
        const passwordMatch = bcrypt.compare('123', savedUser.password)

        expect(savedUser.username).toBe("username")
        expect(savedUser.email).toBe("mail@mail.com")
        expect(passwordMatch).toBeTruthy()
    })
})