import { Router } from 'express'
import {ILineWebHookController, IUserController} from "./implument";

const router = Router()

export interface IWebHooks {
  register(): Router
}

export class WebHooks implements IWebHooks {
  constructor(
      private userController: IUserController,
      private lineController: ILineWebHookController
  ) {
  }

  register(): Router
  {
    router.post("/v1/login", (req, res) => this.userController.login(req, res))
    router.get("/v1/users", (req, res) => this.userController.getUsers(req, res))
    router.post("/v1/signup", (req, res) => this.userController.signup(req, res))

    // LINE
    router.post("/v1/webhook", (req, res) => this.lineController.hooks(req, res))
    return router
  }


  static builder(
      userController: IUserController,
      lineController: ILineWebHookController
  ): IWebHooks
  {
    return new this(userController, lineController);
  }
}