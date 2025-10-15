import { Configuration, Value } from "@itgorillaz/configify";
import z from "zod";

@Configuration()
export class DbConfig {
  @Value("MONGODB_URI", {
    parse: (val) =>
      z
        .string()
        .regex(/^mongodb(?:\+srv)?:\/\//)
        .parse(val),
  })
  uri: string;

  @Value("MONGODB_DB_NAME")
  dbName: string;
}
