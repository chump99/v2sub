import express from 'express'
const sub = express.Router()

import { getenv } from './cfenv.js'
const env = getenv()

sub.get('/get', async (req, res) => {})

export default sub
