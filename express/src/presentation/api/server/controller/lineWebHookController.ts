import {Request, Response} from "express";
import {ILineWebHookController} from "../router/implument";
import {FollowUseCase} from "../../../../application/useCase/line/followUseCase/followUseCase";
import {WebhookRequestBody} from "@line/bot-sdk";
import {PostBackUseCase} from "../../../../application/useCase/line/postBackUseCase/postBackUseCase";
import {MessageUseCase} from "../../../../application/useCase/line/messageUseCase/messageUseCase";
import {ImageUseCase} from "../../../../application/useCase/line/imageUseCase/imageUseCase";

export class LineWebHookController implements ILineWebHookController {
  constructor(
    private followUseCae: FollowUseCase,
    private postBackUseCase: PostBackUseCase,
    private messageUseCase: MessageUseCase,
    private imageUseCase: ImageUseCase,
  ) {
  }
  async hooks(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>
  {
    const lineWebHookBody: WebhookRequestBody = req.body;
    const event = lineWebHookBody.events[0]
    console.log(event.type)
    switch (event.type) {
      case "follow":
        const followResponse = await this.followUseCae.execute(event)
        return res.status(200).json(followResponse)
      case "postback":
        const postbackResponse = await this.postBackUseCase.execute(event)
        return res.status(200).json(postbackResponse)
      case "message":
        // 画像が送信されたかどうか
        if (event.type === 'message' && event.message.type === 'image'){
          const imageResponse = await this.imageUseCase.execute(event)
          return res.status(200).json(imageResponse)
        } else if (event.type === 'message' && event.message.type === 'text') {
          const messageResponse = await this.messageUseCase.execute(event)
          return res.status(200).json(messageResponse)
        }

    }
    return res.json("test");
  }

  static builder(
    followUseCae: FollowUseCase,
    postBackUseCase: PostBackUseCase,
    messageUseCase: MessageUseCase,
    imageUseCase: ImageUseCase
  ): ILineWebHookController
  {
    return new this(followUseCae, postBackUseCase, messageUseCase, imageUseCase)
  }
}