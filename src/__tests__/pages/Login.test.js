import { render, screen } from "@testing-library/react"
import Login from "../../pages/Login"
import userEvent from "@testing-library/user-event"
import { server } from "../../msw/server"
import { HttpResponse, http } from "msw"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Login', () => {
    describe('Layout', () => {
        test('Display h1 heading', () => {
            render(<Login />)

            const h1 = screen.getByRole('heading', { level: 1 })
            expect(h1).toBeInTheDocument()
            expect(h1.textContent).toBe("Connexion")
        })

        test("Display email input", () => {
            render(<Login />)

            const emailInput = screen.getByLabelText("Email")
            expect(emailInput).toBeInTheDocument()
            expect(emailInput.type).toBe("email")
        })

        test("Display password input", () => {
            render(<Login />)

            const passwordInput = screen.getByLabelText("Mot de passe")
            expect(passwordInput).toBeInTheDocument()
        })

        test("Display submit button", () => {
            render(<Login />)

            const submitBtn = screen.getByRole("button", { name: "Se connecter" })
            expect(submitBtn).toBeInTheDocument()
        })
    })

    describe('Interactions', () => {
        test('Email field updates its value when user enter an email', async () => {
            render(<Login />)

            const emailInput = screen.getByLabelText("Email")

            expect(emailInput.value).toBe('')

            await userEvent.type(emailInput, "mail@mail.com")

            expect(emailInput.value).toBe("mail@mail.com")
        })
        test('Password field updates its value when user enter an email', async () => {
            render(<Login />)

            const passwordInput = screen.getByLabelText("Mot de passe")

            expect(passwordInput.value).toBe('')

            await userEvent.type(passwordInput, "123")

            expect(passwordInput.value).toBe("123")
        })
    })

    describe("Handling backend errors", () => {
        test("Returns 401 status and error messages when email and password are empty", async () => {

            render(<Login />)
            let requestBody
            let response
            server.use(
                http.post('http://localhost:3000/auth/login', async ({ request }) => {
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

            const emailInput = screen.getByLabelText("Email")
            const passwordInput = screen.getByLabelText("Mot de passe")
            const submitBtn = screen.getByRole("button")

            await userEvent.type(emailInput, " ")
            await userEvent.type(passwordInput, " ")
            await userEvent.click(submitBtn)

            expect(requestBody).toEqual({ email: '', password: ' ' })
            expect(response.status).toBe(401)
        })

        test("Returns 200 status and success message when email and password are valid", async () => {

            render(<Login />)
            let requestBody
            let response
            server.use(
                http.post('http://localhost:3000/auth/login', async ({ request }) => {
                    requestBody = await request.json()
                    response = HttpResponse.json({
                        token: "someToken"
                    },
                        { status: 200 })
                    return response
                })
            )

            const emailInput = screen.getByLabelText("Email")
            const passwordInput = screen.getByLabelText("Mot de passe")
            const submitBtn = screen.getByRole("button")

            await userEvent.type(emailInput, "mail@mail.com")
            await userEvent.type(passwordInput, "123")
            await userEvent.click(submitBtn)

            expect(requestBody).toEqual({ email: 'mail@mail.com', password: '123' })
            expect(response.status).toBe(200)

            const successMsg = await screen.findByText("Vous êtes connecté")

            expect(successMsg).toBeInTheDocument()
        })



    })

    describe('Handling frontend Errors', () => {
        test('Displays email error when form is submitted with empty email', async () => {
            render(<Login />)


            const emailInput = screen.getByLabelText('Email')
            const passwordInput = screen.getByLabelText("Mot de passe")
            const submitBtn = screen.queryByRole('button', { name: "Se connecter" })


            await userEvent.type(emailInput, " ")
            await userEvent.type(passwordInput, "123")
            await userEvent.click(submitBtn)

            const emailError = await screen.findByText("L'email est requis")
            expect(emailError).toBeInTheDocument()
        })
        test('Displays password error when form is submitted with empty password', async () => {
            render(<Login />)

            const emailInput = screen.getByLabelText('Email')
            const submitBtn = screen.queryByRole('button', { name: "Se connecter" })


            await userEvent.type(emailInput, "mail@mail.com")
            await userEvent.click(submitBtn)

            const passwordError = await screen.findByText("Le mot de passe est requis")
            expect(passwordError).toBeInTheDocument()
        })
    })
})