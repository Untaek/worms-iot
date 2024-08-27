import path from 'path'
import express from 'express'
import axios from 'axios'
import cors from 'cors'
import fs from 'fs'
import mqtt from 'mqtt'

let control = { light: false }

const MQTT_HOST = process.env.MQTT_HOST || '192.168.0.26'
const MQTT_PORT = Number(process.env.MQTT_PORT) || 1883
const QUESTDB_HOST = process.env.QUESTDB_HOST || '52.78.68.176'
const QUESTDB_PORT = Number(process.env.QUESTDB_PORT) || 9000

let imageBuffer
let imageBase64 = ''

axios.defaults.baseURL = `http://${QUESTDB_HOST}:${QUESTDB_PORT}`

const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`)
client.subscribe('control-status')
client.on('message', async (topic, message) => {
  const jsonString = message.toString()
  const jsonObject = JSON.parse(jsonString)

  console.log(topic, jsonObject)
  if (topic === 'control-status') {
    control = jsonObject
  }
})

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

app.get('/stream', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'multipart/x-mixed-replace; boundary=--frame' })
  const interval = setInterval(() => {
    if (imageBuffer) {
      res.write(`--frame\nContent-Type: image/jpeg\nContent-length: ${imageBuffer.length}\n\n`)
      res.write(imageBuffer)
    }
  }, 66)

  req.on('close', () => {
    console.log('close')
    clearInterval(interval)
  })
})

app.get('/control', async (req, res) => {
  res.json(control)
})

app.post('/control', async (req, res) => {
  const body = req.body
  client.publish('control', JSON.stringify(body))
  console.log(body)
  res.json(body)
})

app.post('/upload', async (req, res) => {
  const data = []

  req.on('data', chunk => {
    data.push(chunk)
  })

  req.on("end", () => {
    imageBuffer = Buffer.concat(data)
    imageBase64 = imageBuffer.toString('base64')
    // fs.writeFileSync('example.jpeg', imageBuffer)
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
