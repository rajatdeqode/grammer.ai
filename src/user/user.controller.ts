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
  async userRegister(@Body() registerUser: RegisterUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { email } = registerUser;

    const userExist = await this.userService.findUserByEmail(email);

    if (userExist) {
      throw new ConflictException(USER_ALREADY_REGISTER);
    }

    const user = await this.userService.registerUser(registerUser);

    const accessToken = await this.authService.generateAccessToken({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

    const refreshToken = await this.authService.generateRefreshToken({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

    return { accessToken, refreshToken };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUser: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = loginUser;

    const userExist = await this.userService.findUserByEmail(email);

    if (!userExist) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const validPassword = await this.authService.comparePassword(
      password,
      userExist.password
    );

    if (!validPassword) {
      throw new BadRequestException(INVALID_EMAIL_PASSWORD);
    }
    const accessToken = await this.authService.generateAccessToken(userExist);

    const refreshToken = await this.authService.generateRefreshToken(userExist);

    return { accessToken, refreshToken };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async protectedRoute(@Req() req): Promise<string> {
    console.log(req.user);
    return 'This is a protected route';
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async generateAccessToken(@Body() refreshTokenDTO: RefreshTokenDTO): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.authService.verifyRefreshToken(
      refreshTokenDTO.refreshToken
    );

    if (!user) {
      throw new BadRequestException(INVALID_TOKEN);
    }
    const accessToken = await this.authService.generateAccessToken(user);

    const tokenRefresh = await this.authService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken: tokenRefresh,
    };
  }
  @Get('google-redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const { email, firstName, lastName } = req.user;
    const name = `${firstName}${' '}${lastName}`;

    const user = await this.userService.registerUserGoogle({ name, email });

    return user;
  }
}
