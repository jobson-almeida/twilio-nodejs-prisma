import User from "@/domain/entities/user"
import UserRepository from "@/domain/repository/user-repository"
import PrismaClientAdapter from "@/infra/database/prisma-client-adapter"

type Output = {
  countryCode: string
  phoneNumber: string
  validationCode: number
}

export default class UserRepositoryDatabase implements UserRepository {
  constructor(private readonly prismaClientAdapter: PrismaClientAdapter
  ) { }

  async save(data: { id: string, email: string, username: string, password: string, countryCode: string, phoneNumber: string, validationCode: number }): Promise<Output> {
    try {
      const user = await this.prismaClientAdapter.prismaClient.user.create({
        data: {
          id: data.id,
          email: data.email,
          username: data.username,
          password: data.password,
          countryCode: data.countryCode,
          phoneNumber: data.phoneNumber,
          validationCode: data.validationCode
        }
      })
      return user && {
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        validationCode: user.validationCode
      }
    } finally {
      this.prismaClientAdapter.close
    }
  }

  async list(): Promise<User[]> {
    try {
      const usersFound = await this.prismaClientAdapter.prismaClient.user.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          countryCode: true,
          phoneNumber: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
      })

      const users: User[] = [];
      for (const data of usersFound) {
        users.push(new User(
          data.id,
          data.email,
          data.username,
          data.password,
          data.countryCode,
          data.phoneNumber,
          undefined,
          data.status,
          data.createdAt,
          data.updatedAt
        ));
      }
      return users;
    } finally {
      this.prismaClientAdapter.close
    }
  }

  async get(where: {
    id: string, email: string, username: string, countryCode: string, phoneNumber: string, status: string, validationCode: number
  }): Promise<User | null> {
    try {
      const userFound = await this.prismaClientAdapter.prismaClient.user.findUnique({
        where
      })
      return userFound && new User(
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
    } finally {
      this.prismaClientAdapter.close
    }
  }

  async check(where: { id: string, email: string, username: string }): Promise<boolean> {
    try {
      const userFound = await this.prismaClientAdapter.prismaClient.user.findUnique({
        where
      })
      return userFound ? true : false
    } finally {
      this.prismaClientAdapter.close
    }
  }

  async update(params: {
    where: { id: string, email: string, username: string },
    data: { email?: string, username?: string, password?: string, countryCode?: string, phoneNumber?: string, validationCode?: number, status?: string }
  }): Promise<void> {
    const { where, data } = params
    try {
      await this.prismaClientAdapter.prismaClient.user.update({
        where,
        data
      })
    } finally {
      this.prismaClientAdapter.close
    }
  }

  async delete(where: { id: string, email: string, username: string }): Promise<void> {
    try {
      await this.prismaClientAdapter.prismaClient.user.delete({
        where
      })
    } finally {
      this.prismaClientAdapter.close
    }
  }

  async validationUser(params: {
    where: { id: string },
    data: { status: string }
  }): Promise<void> {
    try {
      const { where, data } = params
      await this.prismaClientAdapter.prismaClient.user.update({
        where,
        data
      })
    } finally {
      this.prismaClientAdapter.close
    }
  }

}