import path from 'path'
import express from 'express'
import axios from 'axios'
import cors from 'cors'
import fs from 'fs'

let imageBase64 = ''

const QUESTDB_HOST = process.env.QUESTDB_HOST || '52.78.68.176'
const QUESTDB_PORT = Number(process.env.QUESTDB_PORT) || 9000

axios.defaults.baseURL = `http://${QUESTDB_HOST}:${QUESTDB_PORT}`

const app = express()

app.use(cors())

app.use(express.json())

// Serve app production bundle
app.use(express.static(path.resolve('dist')))

app.get('/data', async (req, res) => {
  const query = `select * from sensors WHERE datediff('h', timestamp, now()) < 12`
  const queryResponse = await axios.get('/exec', { params: { query } })

  res.json(queryResponse.data)
})

app.get('/image', async (req, res) => {
  res.json({ base64: imageBase64 })
})

app.post('/upload', async (req, res) => {
  const data = []

  req.on('data', chunk => {
    data.push(chunk)
  })

  req.on("end", () => {
    const image = Buffer.concat(data)
    imageBase64 = image.toString('base64')
    res.status(200).send()
  })
})

app.get('*', (_req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})

const start = async () => {
  app.listen(3000, '0.0.0.0', () => {
    console.log(`Server listening at http://localhost:${3000}`)
  })
}

start()