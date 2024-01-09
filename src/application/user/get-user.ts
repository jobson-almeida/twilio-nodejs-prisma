import User from "@/domain/entities/user";
import RepositoryFactory from "@/domain/factory/repository-factory";
import UserRepository from "@/domain/repository/user-repository"
import NotFoundError from "@/infra/http/errors/not-found-error";

type Output = {
  id: string
  email: string
  username: string
  countryCode: string
  phoneNumber: string
  validationCode: number
  status: string
  createdAt: Date
  updatedAt: Date
}

type WhereUniqueInput = {
  id?: string
  email?: string
  username?: string
}

export default class GetUser {
  userRepository: UserRepository

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository()
  }

  async execute(where: WhereUniqueInput): Promise<Output | null> {
    const userFound = await this.userRepository.get(where)

    if (!userFound) throw new NotFoundError("User not found")
    const user: User = new User(
      userFound.id,
      userFound.email,
      userFound.username,
      userFound.password,
      userFound.countryCode,
      userFound.phoneNumber,
      userFound.validationCode,
      userFound.status,
      userFound.createdAt,
      userFound.updatedAt
    )

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
      validationCode: user.validationCode,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
}
