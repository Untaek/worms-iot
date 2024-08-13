import mqtt from 'mqtt'
import { destr } from "destr"
import { Sender } from "@questdb/nodejs-client"

const MQTT_HOST = process.env.MQTT_HOST || '192.168.0.26'
const MQTT_PORT = Number(process.env.MQTT_PORT) || 1883
const QUESTDB_HOST = process.env.QUESTDB_HOST || 'localhost'
const QUESTDB_PORT = Number(process.env.QUESTDB_PORT) || 9000

const start = async () => {
    const client = await mqtt.connectAsync(`mqtt://${MQTT_HOST}`, { port: MQTT_PORT })
    const sender = Sender.fromConfig(`http::addr=${QUESTDB_HOST}:${QUESTDB_PORT}`)

    console.log('mqtt broker connected')
    client.subscribe('temp:hum', (err) => {
        if (err) {
            console.warn(err)
        } else {
            console.log('subscribing', 'temp:hum')
        }
    })

    client.on('message', async (topic, message) => {
        const jsonString = message.toString()
        const jsonObject = destr<{ temp: number, hum: number }>(jsonString)
        console.log(topic, jsonObject)

        await sender.table('sensors').floatColumn('temperature', jsonObject.temp).floatColumn('humidity', jsonObject.hum).atNow()
        await sender.flush()
    })
}

start()