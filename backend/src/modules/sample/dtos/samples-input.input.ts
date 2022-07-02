import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SamplesInput {
  @Field(() => String)
  name!: string;
}
