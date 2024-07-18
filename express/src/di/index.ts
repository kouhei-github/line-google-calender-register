import {UserRepository} from "../infrastructure/datastore/repositoryImpl/UserRepository";
import {SignUpUseCase} from "../application/useCase/authUseCase/signUpUseCase";
import {SecurityExternal} from "../infrastructure/external/jwtTokenExternal/jwtToken";
import {AllUserUseCase} from "../application/useCase/userUseCase/allUser";
import {UserController} from "../presentation/api/server/controller/userController";
import {IWebHooks, WebHooks} from "../presentation/api/server/router";
import {ServerMiddleware} from "../presentation/api/server/middleware";
import {LoginUseCase} from "../application/useCase/authUseCase/loginUseCase";
import {LineWebHookController} from "../presentation/api/server/controller/lineWebHookController";
import {FollowUseCase} from "../application/useCase/Line/followUseCase/followUseCase";
import {PostBackUseCase} from "../application/useCase/Line/postBackUseCase/postBackUseCase";
import {MessageUseCase} from "../application/useCase/Line/messageUseCase/messageUseCase";
import {IEnvSetUp} from "../envs/config";

export const injection = (envLib: IEnvSetUp): IWebHooks => {

  const userRepository = UserRepository.builder()

  const middleware = ServerMiddleware.builder(userRepository)

  const securityExternal = SecurityExternal.builder()

  const signUpUseCase = SignUpUseCase.builder(userRepository, securityExternal)

  const allUserUseCase = AllUserUseCase.builder(userRepository)

  const loginUseCase = LoginUseCase.builder(userRepository, securityExternal)

  const userHandler = UserController.builder(signUpUseCase, allUserUseCase, loginUseCase)

  // line 関連
  // フォローイベント
  const followUseCase = FollowUseCase.builder()

  // ポストバックイベント
  const postBackUseCase = PostBackUseCase.builder()

  // メッセージ
  const messageUseCase = MessageUseCase.builder()

  const lineHandler = LineWebHookController.builder(followUseCase, postBackUseCase, messageUseCase)
  // ここでルーティングの設定
  return WebHooks.builder( userHandler, lineHandler )
}