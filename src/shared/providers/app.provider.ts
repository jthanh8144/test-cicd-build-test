import express, { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import http from 'http'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import hpp from 'hpp'
import path from 'path'
import { serve, setup } from 'swagger-ui-express'

import { errorMiddleware } from '../../app/middlewares'
import { logger } from '.'
import { environment } from '../constants'
import * as routers from '../../app/routers'
import swaggerDocument from '../../../swagger.json'

class AppProvider {
  public app: express.Application
  public server: http.Server

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)

    this.initializeMiddlewares()
    this.initializeApiDocs()
    this.initializeRoutes()
    this.initializeNotfoundHandling()
    this.initializeErrorHandling()
  }

  public listen() {
    this.server.listen(environment.port, () => {
      logger.log(`App listening on the port: ${environment.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(hpp())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      )
      next()
    })
    this.app.use(express.static(path.join(__dirname, '../../../public')))
  }

  private initializeRoutes() {
    const routeList = Object.values(routers)

    routeList.forEach((route) => {
      this.app.use(route.path, route.router)
    })
  }

  private initializeNotfoundHandling() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(createHttpError(404))
    })
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeApiDocs() {
    this.app.use('/docs', serve, setup(swaggerDocument))
  }
}

export const appProvider = new AppProvider()
