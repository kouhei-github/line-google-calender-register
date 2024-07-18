import 'reflect-metadata'
import express from "express"
import cors from "cors"
import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda'  //
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import {injection} from './di'
import {EnvSetUp} from "./envs/config";

// 環境変数の読み込み
const envLib = EnvSetUp.builder()
envLib.setUp()

const app = express()
app.use(cors({
  credentials: true
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

// Dependency Injection
const router = injection(envLib)

app.use("/api/", router.register())

// Lambda handler
export const handler = async (event: APIGatewayEvent, context: Context) => {
  const server = app.listen(8080, () => {
    console.log("Server running on Lambda!")
  })

  return new Promise((resolve, reject) => {
    server.on('error', reject)
    server.on('listening', () => {
      console.log('Listening on port 8080')
      resolve(server)
    })
  })
}

// ローカルでの開発用
if (require.main === module) {
  app.listen(8080, () => {
    console.log("Server running locally on port 8080!")
  })
}