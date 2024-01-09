import { randomInt } from "crypto"
import InvalidEmailError from "./errors/invalid-email"
import InvalidObjectError from "./errors/invalid-object"
import Util from "./util"

export default class User {
  email: string
  username: string
  password: string
  countryCode: string
  phoneNumber: string
  validationCode: number
  status: string
  createdAt: Date
  updatedAt: Date

  constructor(
    readonly id: string,
    email: string,
    username: string,
    password: string,
    countryCode: string,
    phoneNumber: string,
    validationCode?: number,
    status?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.email = email
    this.username = username
    this.password = password
    this.countryCode = countryCode
    this.phoneNumber = phoneNumber
    this.validationCode = validationCode!
    this.status = status!
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!

    if (!Util.validateEmail(this.email)) throw new InvalidEmailError()
    if (!Util.validateString(this.username)) throw new InvalidObjectError("Invalid user name field content: set a user name")
  }

  static create(email: string, username: string, password: string, countryCode: string, phoneNumber: string) {
    const userId = Util.generateID()
    const validationCode = Util.generateActivationCode()
    return new User(userId, email, username, password, countryCode, phoneNumber, validationCode);
  }

  public build(email?: string, username?: string, password?: string, countryCode?: string, phoneNumber?: string, validationCode?: number, status?: string) {
    this.email = email!
    this.username = username!
    this.password = password!
    this.countryCode = countryCode!
    this.phoneNumber = phoneNumber!
    this.validationCode = validationCode!
    this.status = status!
  }
}
