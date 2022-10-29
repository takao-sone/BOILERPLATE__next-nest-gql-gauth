import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/paginated.model';
import { GoogleUser } from './google-user.model';

@ObjectType()
export class GoogleUserConnection extends Paginated(GoogleUser) {}
