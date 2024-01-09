import RepositoryFactory from "@/domain/factory/repository-factory";
import UserRepository from "@/domain/repository/user-repository";
import PrismaClientAdapter from "../database/prisma-client-adapter";
import UserRepositoryDatabase from "../repository/database/user-repository-database";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

	constructor(private readonly prismaClientAdapter: PrismaClientAdapter) { }

	createUserRepository(): UserRepository {
		return new UserRepositoryDatabase(this.prismaClientAdapter);
	}
}