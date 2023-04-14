import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { RegisterUserDto, LoginUserDto, RefreshTokenDTO } from './user.dto';
import { UserService } from './user.service';
import { of } from 'await-of';
import { messages } from 'src/utils/constants';
const {
  USER_ALREADY_REGISTER,
  USER_NOT_FOUND,
  INVALID_EMAIL_PASSWORD,
  INVALID_TOKEN,
} = messages;

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async userRegister(@Body() registerUser: RegisterUserDto) {
    const { email } = registerUser;

    const [userExist, findUserByEmailError] = await of(
      this.userService.findUserByEmail(email)
    );

    if (findUserByEmailError) {
      throw new BadRequestException(` ${findUserByEmailError.message}`);
    }

    if (userExist) {
      throw new ConflictException(USER_ALREADY_REGISTER);
    }

    const [user, userRegisterError] = await of(
      this.userService.registerUser(registerUser)
    );

    if (userRegisterError) {
      throw new BadRequestException(` ${userRegisterError.message}`);
    }
    return {
      name: user.name,
      email: user.email,
      writingFor: user.writingFor,
    };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUser: LoginUserDto) {
    const { email, password } = loginUser;

    const [userExist, findUserByEmailError] = await of(
      this.userService.findUserByEmail(email)
    );

    if (findUserByEmailError) {
      throw new BadRequestException(` ${findUserByEmailError.message}`);
    }

    if (!userExist) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const [validPassword, comparePasswordError] = await of(
      this.authService.comparePassword(password, userExist.password)
    );

    if (comparePasswordError) {
      throw new BadRequestException(` ${comparePasswordError.message}`);
    }

    if (!validPassword) {
      throw new BadRequestException(INVALID_EMAIL_PASSWORD);
    }
    const [accessToken, generateAccessTokenError] = await of(
      this.authService.generateAccessToken(userExist)
    );
    if (generateAccessTokenError) {
      throw new BadRequestException(` ${generateAccessTokenError.message}`);
    }
    const [refreshToken, generateRefreshTokenError] = await of(
      this.authService.generateRefreshToken(userExist)
    );
    if (generateRefreshTokenError) {
      throw new BadRequestException(` ${generateRefreshTokenError.message}`);
    }
    return { accessToken, refreshToken };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async protectedRoute(@Req() req) {
    console.log(req.user);
    return 'This is a protected route';
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async generateAccessToken(@Body() refreshTokenDTO: RefreshTokenDTO) {
    const [user, verifyRefreshTokenError] = await of(
      this.authService.verifyRefreshToken(refreshTokenDTO.refreshToken)
    );

    if (verifyRefreshTokenError) {
      throw new BadRequestException(` ${verifyRefreshTokenError.message}`);
    }

    if (!user) {
      throw new BadRequestException(INVALID_TOKEN);
    }
    const [accessToken, generateAccessTokenError] = await of(
      this.authService.generateAccessToken(user)
    );

    if (generateAccessTokenError) {
      throw new BadRequestException(` ${generateAccessTokenError.message}`);
    }

    const [tokenRefresh, generateRefreshTokenError] = await of(
      this.authService.generateRefreshToken(user)
    );

    if (generateRefreshTokenError) {
      throw new BadRequestException(` ${generateRefreshTokenError.message}`);
    }
    return {
      accessToken,
      refreshToken: tokenRefresh,
    };
  }
}
