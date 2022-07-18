import { Field, InputType } from '@nestjs/graphql';
import { SortDirection } from './order-direction.model';

@InputType({ isAbstract: true })
export abstract class SortInput {
  @Field(() => SortDirection, { nullable: true, description: 'ソートする方向' })
  direction: SortDirection = SortDirection.ASC;
}
