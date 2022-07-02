import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SamplesArgs {
  @Field(() => String)
  name!: string;
}
