import {UserRepository} from "../infrastructure/datastore/repositoryImpl/UserRepository";
import {SignUpUseCase} from "../application/useCase/authUseCase/signUpUseCase";
import {SecurityExternal} from "../infrastructure/external/jwtTokenExternal/jwtToken";
import {AllUserUseCase} from "../application/useCase/userUseCase/allUser";
import {UserController} from "../presentation/api/server/controller/userController";
import {IWebHooks, WebHooks} from "../presentation/api/server/router";
import {ServerMiddleware} from "../presentation/api/server/middleware";
import {LoginUseCase} from "../application/useCase/authUseCase/loginUseCase";
import {LineWebHookController} from "../presentation/api/server/controller/lineWebHookController";
import {FollowUseCase} from "../application/useCase/line/followUseCase/followUseCase";
import {PostBackUseCase} from "../application/useCase/line/postBackUseCase/postBackUseCase";
import {MessageUseCase} from "../application/useCase/line/messageUseCase/messageUseCase";
import {IEnvSetUp} from "../envs/config";
import {LineBotExternal} from "../infrastructure/external/line/lineBotExternal";
import {ImageUseCase} from "../application/useCase/line/imageUseCase/imageUseCase";
import {GoogleCalenderExternal} from "../infrastructure/external/google/calender/googleCalenderExternal";
import {ChatGptExternal} from "../infrastructure/external/llm/gpt/chatGptExternal";
import {AudioUseCase} from "../application/useCase/line/audioUseCase/audioUseCase";
import {CalenderRepository} from "../infrastructure/datastore/repositoryImpl/dynamodb/CalenderRepository";
import {DynamoDBConfig} from "../infrastructure/datastore/dynamoDbPlugin";

export const injection = (envLib: IEnvSetUp): IWebHooks => {

  const userRepository = UserRepository.builder()

  // db
  const db = new DynamoDBConfig(envLib)
  const calenderRepository = CalenderRepository.builder(db)

  const middleware = ServerMiddleware.builder(userRepository)

  const securityExternal = SecurityExternal.builder()

  const signUpUseCase = SignUpUseCase.builder(userRepository, securityExternal)

  const allUserUseCase = AllUserUseCase.builder(userRepository)

  const loginUseCase = LoginUseCase.builder(userRepository, securityExternal)

  const userHandler = UserController.builder(signUpUseCase, allUserUseCase, loginUseCase)

  // Google Calender
  const googleCalenderExt = GoogleCalenderExternal.builder(envLib)

  // line 関連
  const lineBotExternal = LineBotExternal.builder(envLib)

  // gpt
  const gptExternal = ChatGptExternal.builder(envLib)

  // フォローイベント
  const followUseCase = FollowUseCase.builder(lineBotExternal, calenderRepository)

  // ポストバックイベント
  const postBackUseCase = PostBackUseCase.builder(lineBotExternal, calenderRepository)

  // メッセージイベント
  const messageUseCase = MessageUseCase.builder(lineBotExternal, googleCalenderExt, gptExternal, calenderRepository)

  // 画像送信イベント
  const imageUseCase = ImageUseCase.builder(lineBotExternal, googleCalenderExt, gptExternal, calenderRepository)

  // 音声送信イベント
  const audioUseCase = AudioUseCase.builder(lineBotExternal, gptExternal, googleCalenderExt, calenderRepository)

  const lineHandler = LineWebHookController.builder(followUseCase, postBackUseCase, messageUseCase, imageUseCase, audioUseCase)
  // ここでルーティングの設定
  return WebHooks.builder( userHandler, lineHandler )
}