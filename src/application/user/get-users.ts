import User from "@/domain/entities/user";
import RepositoryFactory from "@/domain/factory/repository-factory";
import UserRepository from "@/domain/repository/user-repository";

type Output = {
  id: string,
  email: string
  username: string
  countryCode: string
  phoneNumber: string
  //validationCode: number
  status: string
  createdAt: Date
  updatedAt: Date
}

export default class GetUsers {
  userRepository: UserRepository

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository()
  }

  async execute(): Promise<Output[]> {
    const usersFound = await this.userRepository.list();

    const users: User[] = []
    for (const data of usersFound) {
      users.push(
        new User(
          data.id,
          data.email,
          data.username,
          data.password,
          data.countryCode,
          data.phoneNumber,
          //data.validationCode,
          undefined,
          data.status,
          data.createdAt,
          data.updatedAt
        )
      )
    }

    return users.map(user => (
      {
        id: user.id,
        email: user.email,
        username: user.username,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        //validationCode: user.validationCode,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    ))
  }
}