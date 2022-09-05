import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/paginated.model';
import { Role } from './role.model';

@ObjectType()
export class RoleConnection extends Paginated(Role) {}
