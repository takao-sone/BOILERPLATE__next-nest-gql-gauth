import { Args, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { SamplesArgs } from './dtos/samples-args.args';
import { SamplesInput } from './dtos/samples-input.input';
import { Sample } from './models/sample.model';

@Resolver(() => Sample)
export class SampleResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => Sample)
  sample() {
    const sample: Sample = {
      name: 'sample_name',
      displayedId: 'sample_displayedId',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return sample;
  }

  @Query(() => [Sample])
  sampleArgs(@Args() samplesArgs: SamplesArgs) {
    const sample: Sample = {
      name: `${samplesArgs.name}_name`,
      displayedId: 'samples_displayedId',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return [sample];
  }

  @Query(() => [Sample])
  samplesInput(@Args('data') samplesInput: SamplesInput) {
    const sample: Sample = {
      name: `${samplesInput.name}_name`,
      displayedId: 'samples_displayedId',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return [sample];
  }

  @Query(() => [Sample])
  async prismaTest() {
    return await this.prismaService.sample.findMany();
  }
}
