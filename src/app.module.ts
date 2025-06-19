import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { deletion, listController, todoController, session, logout } from './app.controller';
import { AppService } from './app.service';
import { createSession, LoggerMiddleware, terminateSession } from './middleware';

@Module({
  imports: [],
  controllers: [listController, todoController, deletion, session, logout],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("*");
    consumer
      .apply(createSession)
      .forRoutes("/user")
    consumer
      .apply(terminateSession)
      .forRoutes("/deleteUser")
  }
}
