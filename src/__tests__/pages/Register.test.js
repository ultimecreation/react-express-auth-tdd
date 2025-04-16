import { render, screen } from "@testing-library/react"
import Register from "../../pages/Register"
import userEvent from "@testing-library/user-event"
import { server } from "../../msw/server"
import { HttpResponse, http } from "msw"
import { act } from "react"
import { BrowserRouter, Route, Routes } from "react-router"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe('Signup', () => {
    describe('Layout', () => {
        test('Displays Register Heading', () => {
            render(<Register />)
            const h1 = screen.getByRole('heading', { level: 1, name: "Inscription" })

            expect(h1).toBeInTheDocument()
        })

        test('Displays username label and input', () => {
            render(<Register />)
            const usernameInput = screen.getByLabelText("Nom")

            expect(usernameInput).toBeInTheDocument()
            expect(usernameInput.type).toBe('text')
        })

        test('Displays email label and input', () => {
            render(<Register />)
            const emailInput = screen.getByLabelText("Email")

            expect(emailInput).toBeInTheDocument()
            expect(emailInput.type).toBe('email')
        })

        test('Displays password label and input', () => {
            render(<Register />)
            const passwordInput = screen.getByLabelText("Mot de passe")

            expect(passwordInput).toBeInTheDocument()
            expect(passwordInput.type).toBe('password')
        })

        test('Displays password repeat label and input', () => {
            render(<Register />)
            const passwordConfirmInput = screen.getByLabelText("Confirmer le mot de passe")

            expect(passwordConfirmInput).toBeInTheDocument()
            expect(passwordConfirmInput.type).toBe('password')
        })

        test('Displays the submit button', () => {
            render(<Register />)
            const submitBtn = screen.queryByRole('button', { name: "S'inscrire" })

            expect(submitBtn).toBeInTheDocument()
            expect(submitBtn).toBeDisabled()
        })
    })

    describe('Interactions', () => {
        test('Update username field value when user type a username', async () => {
            render(<Register />)
            const usernameInput = screen.getByLabelText('Nom')
            expect(usernameInput.value).toBe('')

            await userEvent.type(usernameInput, "Username")
            expect(usernameInput.value).toBe('Username')
        })

        test('Update email field value when user type an email', async () => {
            render(<Register />)
            const emailInput = screen.getByLabelText('Email')
            expect(emailInput.value).toBe('')

            await userEvent.type(emailInput, "username@mail.com")
            expect(emailInput.value).toBe('username@mail.com')
        })

        test('Update password field value when user type a password', async () => {
            render(<Register />)
            const passwordlInput = screen.getByLabelText('Mot de passe')
            expect(passwordlInput.value).toBe('')

            await userEvent.type(passwordlInput, "Test1234!")
            expect(passwordlInput.value).toBe('Test1234!')
        })

        test('Update password confirmation field value when user type apassword confirmation', async () => {
            render(<Register />)
            const passwordConfirmlInput = screen.getByLabelText('Confirmer le mot de passe')
            expect(passwordConfirmlInput.value).toBe('')

            await userEvent.type(passwordConfirmlInput, "Test1234!")
            expect(passwordConfirmlInput.value).toBe('Test1234!')
        })

        test('Enable submit button when password and password confirm are filled', async () => {
            render(<Register />)
            const passwordInput = screen.getByLabelText("Mot de passe")
            const passwordConfirmInput = screen.getByLabelText("Confirmer le mot de passe")
            const submitBtn = screen.queryByRole('button', { name: "S'inscrire" })

            expect(submitBtn).toBeDisabled()

            await userEvent.type(passwordInput, "Test1234!")
            await userEvent.type(passwordConfirmInput, "Test1234!")

            expect(submitBtn).toBeEnabled()
        })
    })

    describe('Handling Errors', () => {
        test('Displays username error when form is submitted with empty username', async () => {
            render(<Register />)


            const emailInput = screen.getByLabelText('Email')
            const passwordInput = screen.getByLabelText("Mot de passe")
            const passwordConfirmInput = screen.getByLabelText("Confirmer le mot de passe")
            const submitBtn = screen.queryByRole('button', { name: "S'inscrire" })


            await userEvent.type(emailInput, "username@mail.com")
            await userEvent.type(passwordInput, "Test1234!")
            await userEvent.type(passwordConfirmInput, "Test1234!")
            await userEvent.click(submitBtn)

            const usernameError = await screen.findByText('Le nom est requis')
            expect(usernameError).toBeInTheDocument()
        })
        test('Displays email error when form is submitted with empty email', async () => {
            render(<Register />)
            const usernameInput = screen.getByLabelText('Nom')
            const passwordInput = screen.getByLabelText("Mot de passe")
            const passwordConfirmInput = screen.getByLabelText("Confirmer le mot de passe")
            const submitBtn = screen.queryByRole('button', { name: "S'inscrire" })


            await userEvent.type(usernameInput, "Username")
            await userEvent.type(passwordInput, "Test1234!")
            await userEvent.type(passwordConfirmInput, "Test1234!")
            await userEvent.click(submitBtn)

            const emailError = await screen.findByText("L'email est requis")
            expect(emailError).toBeInTheDocument()
        })
    })

    describe('Http requests', () => {


        test('receive status code 201 when valid username,email,password and password confirm are send to the server', async () => {
            render(<Register />)
            let requestBody
            let response
            server.use(
                http.post('http://localhost:3000/auth/register', async ({ request }) => {

                    requestBody = await request.json()
                    response = HttpResponse.json(null, { status: 201 })
                    return response
                })
            )


            const usernameInput = screen.getByLabelText('Nom')
            const emailInput = screen.getByLabelText('Email')
            const passwordInput = screen.getByLabelText("Mot de passe")
            const passwordConfirmInput = screen.getByLabelText("Confirmer le mot de passe")
            const submitBtn = screen.queryByRole('button', { name: "S'inscrire" })


            await userEvent.type(usernameInput, "Username")
            await userEvent.type(emailInput, "username@mail.com")
            await userEvent.type(passwordInput, "Test1234!")
            await userEvent.type(passwordConfirmInput, "Test1234!")
            await userEvent.click(submitBtn)

            // await new Promise(resolve => setTimeout(resolve, 500))
            expect(requestBody).toEqual({ username: "Username", email: "username@mail.com", password: "Test1234!", passwordConfirm: "Test1234!" })
            expect(response.ok).toBe(true)
            expect(response.status).toBe(201)

            const successMsg = await screen.findByText("Inscription validé")
            expect(successMsg).toBeInTheDocument()

            // const data = await response.json()
            // expect(data.token).toBe('someToken')
        })

        test('receive status code 401 when empty username,email are send to the server', async () => {
            render(<Register />)
            let requestBody
            let response
            server.use(
                http.post('http://localhost:3000/auth/register', async ({ request }) => {
                    requestBody = await request.json()
                    response = HttpResponse.json({
                        errors: {
                            username: "Le Nom est requis",
                            email: "L'Email est requis",
                        }
                    }, { status: 401 })
                    return response
                })
            )



            const usernameInput = screen.getByLabelText('Nom')
            const emailInput = screen.getByLabelText('Email')
            const passwordInput = screen.getByLabelText("Mot de passe")
            const passwordConfirmInput = screen.getByLabelText("Confirmer le mot de passe")
            const submitBtn = screen.queryByRole('button', { name: "S'inscrire" })


            await userEvent.type(usernameInput, " ")
            await userEvent.type(emailInput, " ")
            await userEvent.type(passwordInput, "Test1234!")
            await userEvent.type(passwordConfirmInput, "Test1234!")
            await userEvent.click(submitBtn)

            // await new Promise(resolve => setTimeout(resolve, 500))
            expect(requestBody).toEqual({ username: " ", email: "", password: "Test1234!", passwordConfirm: "Test1234!" })
            // console.log("RES", response)
            expect(response.status).toBe(401)

            const usernameError = await screen.findByText('Le Nom est requis')
            const emailError = await screen.findByText("L'Email est requis")

            expect(usernameError).toBeInTheDocument()
            expect(emailError).toBeInTheDocument()
        })
    })
})
