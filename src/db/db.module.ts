import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DbConfig } from "./db.config";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
  imports: [
    // For db connection
    MongooseModule.forRootAsync({
      inject: [DbConfig],
      useFactory: (config: DbConfig) => ({
        uri: config.uri,
        dbName: config.dbName,
      }),
    }),

    // For db schema registration
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class DbModule {}
