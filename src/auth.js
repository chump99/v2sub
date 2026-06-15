import express from 'express'
const auth = express.Router()

import { getenv } from './cfenv.js'
const env = getenv()

import jwt from 'jsonwebtoken'
const jwt_expire = 24 * 60 * 60
const cookie_name = 'auth_token'

auth.post('/login', (req, res) => {
    const { password } = req.body
    if (typeof password !== 'string' || password === '') {
        return res.status(401).send('请求错误')
    }

    const true_password = env.password
    if (password !== true_password) {
        return res.status(401).send('密码错误')
    }

    const jwt_secret = env.jwt_secret
    const token = jwt.sign({}, jwt_secret, { expiresIn: jwt_expire })
    res.cookie(cookie_name, token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: jwt_expire * 1000
    })

    return res.status(200).send('登录成功')
})

export const needauth = (req, res, next) => {
    const token = req.cookies[cookie_name]
    if (!token) {
        return res.status(401).send('未授权')
    }

    try {
        const jwt_secret = env.jwt_secret
        jwt.verify(token, jwt_secret)
        return next()
    } catch {
        res.clearCookie(cookie_name)
        return res.status(401).send('验证失败')
    }
}

auth.get('/status', needauth, (req, res) => {
    return res.status(200).send('验证成功')
})

auth.get('/logout', needauth, (req, res) => {
    res.clearCookie(cookie_name)
    return res.status(200).send('已登出')
})

export default auth
