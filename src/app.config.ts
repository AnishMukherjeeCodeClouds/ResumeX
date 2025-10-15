import { Configuration, Value } from "@itgorillaz/configify";
import z from "zod";

@Configuration()
export class AppConfig {
  @Value("PORT", {
    parse: (val) => z.coerce.number().parse(val),
  })
  port: number;
}
