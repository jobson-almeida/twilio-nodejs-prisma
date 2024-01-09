import '../module-alias'
import 'dotenv/config';
import DeleteUser from './application/user/delete-user';
import GetUser from './application/user/get-user';
import GetUsers from './application/user/get-users';
import SaveUser from './application/user/save-user';
import UpdateUser from './application/user/update-user';
import UserController from './infra/controller/user-controller';
import PrismaClientAdapter from './infra/database/prisma-client-adapter';
import DatabaseRepositoryFactory from './infra/factory/database-repository-factory';
import ExpressAdapter from './infra/http/ExpressAdapter';
import Notifier from './infra/controller/notifier';
import ValidationUser from './application/user/validation-user';

const http = new ExpressAdapter();
const prismaClientAdapter = new PrismaClientAdapter();
const repositoryFactory = new DatabaseRepositoryFactory(prismaClientAdapter)

const saveUser = new SaveUser(repositoryFactory);
const getUser = new GetUser(repositoryFactory);
const getUsers = new GetUsers(repositoryFactory);
const updateUser = new UpdateUser(repositoryFactory);
const deleteUser = new DeleteUser(repositoryFactory);
const validationUser = new ValidationUser(repositoryFactory);
const notifierUser = new Notifier();

new UserController(http, saveUser, getUser, getUsers, updateUser, deleteUser, notifierUser, validationUser);

http.listen(3000);