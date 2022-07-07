import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'メールアドレス' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(128)
  email!: string;

  @Field(() => String, { description: 'パスワード（8~64文字）' })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password!: string;

  @Field(() => String, { description: '確認用パスワード' })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @Match('password', {
    message: `The value of "confirmationPassword" must match the value of "password".`,
  })
  confirmationPassword!: string;

  @Field(() => String, { description: 'ユーザーに付与する権限のdisplayedId' })
  @IsNotEmpty()
  @IsUUID()
  roleDisplayedId!: string;
}
