import { Configuration, Value } from "@itgorillaz/configify";
import z from "zod";

@Configuration()
export class AuthConfig {
  @Value("JWT_SECRET", {
    parse: (val) => z.base64().parse(val),
  })
  jwtSecret: string;
}
