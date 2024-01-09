import User from "../entities/user"

type WhereInput = {
  id?: string
  email?: string
  username?: string
  countryCode?: string
  phoneNumber?: string
  validationCode?: number
  status?: string
}

type ValidationUserType = {
  status?: string
}

type Output = {
  countryCode: string
  phoneNumber: string
  validationCode: number
}

type UpdateInput = {
  email?: string
  username?: string
  password?: string
  countryCode?: string
  phoneNumber?: string
  validationCode?: number
  status?: string
}

export default interface UserRepository {
  save(data: User): Promise<Output>
  list(): Promise<User[]>
  get(where: WhereInput): Promise<User | null>
  check(where: WhereInput): Promise<boolean>
  update(params: { where: WhereInput, data: UpdateInput }): Promise<void>
  delete(where: WhereInput): Promise<void>
  validationUser(params: { where: WhereInput, data: ValidationUserType }): Promise<void>
}
