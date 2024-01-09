import RepositoryFactory from "@/domain/factory/repository-factory";
import UserRepository from "@/domain/repository/user-repository"
import User from "@/domain/entities/user";
import EmailExistsError from "@/infra/http/errors/email-exists";
import UsernameExistsError from "@/infra/http/errors/username-exists";

type Input = {
  email: string
  username: string
  password: string
  countryCode: string
  phoneNumber: string
}

type Output = {
  countryCode: string
  phoneNumber: string
  validationCode: number
}

export default class SaveUser {
  userRepository: UserRepository

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository();
  }

  async execute(data: Input): Promise<Output> {
    const { email, username, password, countryCode, phoneNumber } = data
    const existsEmail = await this.userRepository.check({ email })
    if (existsEmail) throw new EmailExistsError()
    const existsUsername = await this.userRepository.check({ username })
    if (existsUsername) throw new UsernameExistsError()
    const user = User.create(email, username, password, countryCode, phoneNumber)
    const result = await this.userRepository.save(user)

    return result && {
      countryCode: result.countryCode,
      phoneNumber: result.phoneNumber,
      validationCode: result.validationCode
    }
  }
} 
