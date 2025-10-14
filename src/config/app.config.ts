import { Configuration, Value } from '@itgorillaz/configify';
import { Type } from 'class-transformer';
import { IsPort } from 'class-validator';

@Configuration()
export class AppConfig {
  @Value('PORT', {
    default: 3000,
  })
  @IsPort()
  @Type(() => Number)
  port: number;
}
