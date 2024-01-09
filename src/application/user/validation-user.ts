import RepositoryFactory from "@/domain/factory/repository-factory";
import UserRepository from "@/domain/repository/user-repository"
import ValidationCodeNotExistsError from "@/infra/http/errors/validation-code-error";

type WhereInput = {
  id?: string
}

type DataInput = {
  email?: string
  validationCode?: number
  status?: string
}

export default class ValidationUser {
  userRepository: UserRepository

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository()
  }

  async execute(params: {
    where: WhereInput,
    data: DataInput
  }): Promise<void> {
    const { id } = params.where
    const { email, validationCode } = params.data
    const userFound = await this.userRepository.get({ id, email, validationCode })
    if (!userFound) throw new ValidationCodeNotExistsError()
    const validationStatus = { status: "active" }
    await this.userRepository.validationUser({ where: params.where, data: validationStatus })
  }
}