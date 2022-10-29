import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { UserCredentialProvider } from '@prisma/client';
import { Base } from 'src/common/models/base.model';

@ObjectType()
export class UserThirdPartyCredential extends Base {
  @HideField()
  userId!: number;

  @HideField()
  sub!: string;

  @Field(() => String, {
    description: 'IDプロバイダー名',
  })
  provider!: ScalaredCredentialProvider;
}

type ScalaredCredentialProvider = UserCredentialProvider;
