import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import Login from './Login'

const Register = () => {

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
    })
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)
    const [globalMsg, setGlobalMsg] = useState({ type: '', text: '' })

    const onChange = (e) => {
        setNewUser(() => {
            return {
                ...newUser,
                [e.target.name]: e.target.value
            }
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setUsernameError('')
        setEmailError('')
        if (newUser.username === '') setUsernameError("Le nom est requis")
        if (newUser.email === '') setEmailError("L'email est requis")

        const response = await fetch('http://localhost:3000/auth/register', {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(newUser)
        })
        if (response.ok) {
            setGlobalMsg({ type: 'success', text: "Inscription validé" })
            setTimeout(() => {
                return <Navigate to={Login} />
            }, 3000)
        }
        if (response.status === 401) {
            const data = await response.json()
            if (data.errors.username) setUsernameError(data.errors.username)
            if (data.errors.email) setEmailError(data.errors.email)
        }
    }

    const { username, email, password, passwordConfirm } = newUser
    useEffect(() => {
        setIsDisabled(() => {
            return newUser.password === '' || newUser.password !== newUser.passwordConfirm
        })
    }, [password, passwordConfirm])

    return (
        <div className='container'>
            <div className="col-md-6 mx-auto">
                <h1>Inscription</h1>
                {
                    globalMsg.text
                    && <p className={`alert alert-${globalMsg.type}`}>{globalMsg.text} </p>
                }
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label" >Nom</label>
                        <input
                            type="text"
                            className="form-control"
                            name='username'
                            id='username'
                            value={username}
                            onChange={onChange}
                        />
                    </div>
                    {usernameError && <p className='text-danger'>{usernameError} </p>}

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" >Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            value={email}
                            onChange={onChange}
                        />
                    </div>
                    {emailError && <p className='text-danger'>{emailError} </p>}

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label" >Mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            id="password"
                            value={password}
                            onChange={onChange}
                            autoComplete='password'
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordConfirm" className="form-label" >Confirmer le mot de passe</label>
                        <input
                            type="password" className="form-control" name="passwordConfirm"
                            id="passwordConfirm"
                            value={passwordConfirm}
                            onChange={onChange}
                            autoComplete='passwordConfirm'
                        />
                    </div>
                    <button className='btn btn-primary' disabled={isDisabled}>S'inscrire</button>
                </form>
            </div>

        </div>
    )
}

export default Register