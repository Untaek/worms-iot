import path from 'path'
import express from 'express'
import axios from 'axios'

const QUESTDB_HOST = process.env.QUESTDB_HOST || '52.78.68.176'
const QUESTDB_PORT = Number(process.env.QUESTDB_PORT) || 9000

axios.defaults.baseURL = `http://${QUESTDB_HOST}:${QUESTDB_PORT}`

const app = express()

app.use(express.json())

// Serve app production bundle
app.use(express.static(path.resolve('dist')))

app.get('/data', async (req, res) => {
  const query = `select * from sensors WHERE datediff('h', timestamp, now()) < 24`
  const queryResponse = await axios.get('/exec', { params: { query } })

  res.json(queryResponse.data)
})

app.get('*', (_req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})

const start = async () => {
  app.listen(3000, () => {
    console.log(`Server listening at http://localhost:${3000}`)
  })
}

start()