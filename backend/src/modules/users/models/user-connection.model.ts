import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/paginated.model';
import { User } from './user.model';

@ObjectType()
export class UserConnection extends Paginated(User) {}
