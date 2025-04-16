

import { http, HttpResponse } from 'msw';

export const handlers = [

    http.post('http://localhost:3000/auth/login', () => {
        return HttpResponse.json(null, { status: 200 })
    }),
    http.post('http://localhost:3000/auth/register', () => {
        return HttpResponse.json(null, { status: 200 })
    }),
]

