import React, { useState } from 'react'
import { Navigate } from 'react-router'
import Home from './Home'

const Login = () => {

    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [globalMsg, setGlobalMsg] = useState({ type: '', text: '' })

    const onChange = (e) => {
        setUser(() => {
            return {
                ...user,
                [e.target.name]: e.target.value
            }
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setEmailError('')
        setPasswordError('')
        if (user.email === '') setEmailError("L'email est requis")
        if (user.password === '') setPasswordError("Le mot de passe est requis")

        if (emailError || passwordError) return

        const response = await fetch('http://localhost:3000/auth/login', {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(user)
        })
        if (response.ok) {
            setGlobalMsg({ type: 'success', text: "Vous êtes connecté" })
            setTimeout(() => {
                return <Navigate to={Home} />
            }, 3000)
        }
        if (response.status === 401) {
            const data = await response.json()
            if (data.errors.email) setEmailError(data.errors.email)
            if (data.errors.password) setPasswordError(data.errors.password)
        }
    }
    const { email, password } = user

    return (
        <div className='container'>
            <div className="col-md-6 mx-auto">

                <h1>Connexion</h1>
                {
                    globalMsg.text
                    && <p className={`alert alert-${globalMsg.type}`}>{globalMsg.text} </p>
                }
                <form onSubmit={onSubmit} >

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
                    {passwordError && <p className='text-danger'>{passwordError} </p>}

                    <button className='btn btn-primary' >Se  connecter</button>
                </form>
            </div>

        </div>
    )
}

export default Login