import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { PointTableModule } from 'src/point-table/point-table.module';

@Module({
  imports: [
    UsersModule, // Importing the UsersModule to access user-related functionality
    PointTableModule,
    JwtModule.register({ // Registering the JwtModule for JWT functionality
      global: true, // Indicates if the module is global-scoped
      secret: jwtConstants.secret, // Secret key used for signing tokens
      signOptions: { expiresIn: '300s' }, // Token expiration time set to 300 seconds (5 minutes)
    }),
  ],
  providers: [AuthService], // Providing the AuthService for dependency injection
  controllers: [AuthController], // Making the AuthController available within this module
  exports: [AuthService], // Exporting the AuthService to be used in other modules
})
export class AuthModule {}
