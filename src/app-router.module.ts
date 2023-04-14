import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    RouterModule.register([
      {
        path: 'user',
        module: UserModule,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRouterModule {}
