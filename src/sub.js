import express from 'express'
const sub = express.Router()

import { getenv } from './cfenv.js'
const env = getenv()

import pLimit from 'p-limit'
const limit = pLimit(3)

sub.get('/get', async (req, res) => {
    const { secret } = req.query
    if (secret !== env.sub_secret) {
        return res.status(403).send('密钥错误')
    }

    const keys = (await env.data.list()).keys
    const subNames = keys.map(item => item.name)

    const values = await env.data.get(subNames)
    const subs = Object.fromEntries(values)

    const promises = Object.entries(subs).map(([key, value]) => {
        return limit(async () => {
            const obj = JSON.parse(value)
        })
    })

    const result = (await Promise.all(promises)).flat()
    return res.status(200).json(result)
})

export default sub
