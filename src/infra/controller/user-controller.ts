import DeleteUser from "@/application/user/delete-user";
import GetUser from "@/application/user/get-user";
import GetUsers from "@/application/user/get-users";
import SaveUser from "@/application/user/save-user";
import UpdateUser from "@/application/user/update-user";
import { Status as statusHttp } from "../http/errors/http-helper";
import { Http, Method } from "../http/Http";
import InvalidEmailError from "@/domain/entities/errors/invalid-email";
import EmailExistsError from "../http/errors/email-exists";
import NotFoundError from "../http/errors/not-found-error";
import InvalidUUIDError from "@/domain/entities/errors/invalid-uuid";
import CheckParams from "./check-params";
import UsernameExistsError from "../http/errors/username-exists";
import Notifier from "./notifier";
import ValidationUser from "@/application/user/validation-user";
import ValidationCodeNotExistsError from "../http/errors/validation-code-error";

type ParamsType = {
  unique?: string
  id?: string
  email?: string
  username?: string
}

type BodyType = {
  email: string
  username: string
  password: string,
  countryCode: string,
  phoneNumber: string,
  validationCode: number
  status: string
}

export default class UserController {
  constructor(
    readonly http: Http,
    readonly saveUser: SaveUser,
    readonly getUser: GetUser,
    readonly getUsers: GetUsers,
    readonly updateUser: UpdateUser,
    readonly deleteUser: DeleteUser,
    readonly notifierUser: Notifier,
    readonly validationUser: ValidationUser
  ) {

    http.build(Method.POST, "/users", async function (params: ParamsType, body: BodyType) {
      try {
        const user = await saveUser.execute(body);
        if (user) {
          await notifierUser.sendMessage({
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            validationCode: user.validationCode
          })
        };
        return statusHttp.created()
      } catch (error) {
        console.log('deu merda de novo')
        if (error instanceof InvalidEmailError) return statusHttp.badRequest(error)
        if (error instanceof InvalidUUIDError) return statusHttp.badRequest(error)
        if (error instanceof EmailExistsError) return statusHttp.conflict(error)
        if (error instanceof UsernameExistsError) return statusHttp.conflict(error)
        if (error instanceof NotFoundError) return statusHttp.notFound(error)
        if (error instanceof Error) return statusHttp.internalServerError()
      }
    });

    http.build(Method.GET, "/users", async function () {
      try {
        const usersFound = await getUsers.execute();
        return statusHttp.success(usersFound)
      } catch (error) {
        if (error instanceof Error) return statusHttp.internalServerError()
      }
    });

    http.build(Method.GET, "/users/:unique", async function (params: ParamsType) {
      let paramsChecked = {}

      try {
        if (params.unique) {
          paramsChecked = CheckParams.validade(params.unique)
        }

        const userFound = await getUser.execute(paramsChecked)
        return statusHttp.success(userFound)
      } catch (error) {
        if (error instanceof NotFoundError) return statusHttp.notFound(error)
        if (error instanceof Error) return statusHttp.internalServerError()
      }
    });

    http.build(Method.PUT, "/users/:id", async function (params: ParamsType, body: BodyType) {
      try {
        const { id } = params
        const { email, username, password, countryCode, phoneNumber, validationCode, status } = body

        await updateUser.execute({
          where: { id },
          data: {
            email, username, password, countryCode, phoneNumber, validationCode, status
          }
        })
        return statusHttp.noContent()
      } catch (error) {
        if (error instanceof InvalidEmailError) return statusHttp.badRequest(error)
        if (error instanceof InvalidUUIDError) return statusHttp.badRequest(error)
        if (error instanceof EmailExistsError) return statusHttp.badRequest(error)
        if (error instanceof UsernameExistsError) return statusHttp.badRequest(error)
        if (error instanceof NotFoundError) return statusHttp.notFound(error)
        if (error instanceof Error) return statusHttp.internalServerError()
      }
    });

    http.build(Method.DELETE, "/users/:id", async function (params: ParamsType, body: BodyType) {
      try {
        await deleteUser.execute(params)
        return statusHttp.noContent()
      } catch (error) {
        if (error instanceof NotFoundError) return statusHttp.notFound(error)
        if (error instanceof Error) return statusHttp.internalServerError()
      }
    });

    http.build(Method.PUT, "/users/:id/validation", async function (params: ParamsType,
      body: { email: string, validationCode: number, status: string }) {
      try {
        const { id } = params
        const { email, validationCode, status } = body

        await validationUser.execute({
          where: { id },
          data: { email, validationCode, status }
        })
        return statusHttp.noContent()
      } catch (error) {
        if (error instanceof InvalidEmailError) return statusHttp.badRequest(error)
        if (error instanceof InvalidUUIDError) return statusHttp.badRequest(error)
        if (error instanceof EmailExistsError) return statusHttp.badRequest(error)
        if (error instanceof UsernameExistsError) return statusHttp.badRequest(error)
        if (error instanceof ValidationCodeNotExistsError) return statusHttp.badRequest(error)
        if (error instanceof NotFoundError) return statusHttp.notFound(error)
        if (error instanceof Error) return statusHttp.internalServerError()
      }
    });
  }
}
