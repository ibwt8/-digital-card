import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('ProfessionalLink')
export class ProfessionalLinkModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  label: string;

  @Field(() => String)
  url: string;
}
