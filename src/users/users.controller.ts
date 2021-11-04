import { Body, Controller, Post,Get,Patch,Param,Query,Delete,NotFoundException,UseGuards,Session} from '@nestjs/common';
import {UpdateUserDto} from './dtos/update-user.dto'
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import {AuthService} from './auth/auth.service'
import { currentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard'
import { serializeData } from '../interceptors/serialize.interceptor';
@Controller('auth')
@serializeData(UserDto)
export class UsersController {
  constructor(private usersService: UsersService,
        private authService: AuthService
    ) {}


    @Get('/colors/:color')
    setColor(@Param('color') color: string,@Session() session:any){
      session.color = color
    }


    @Get('/colors')
    getColor(@Session() session:any){
      return session.color
    }


  // @Get('/user/me')
  //  getUser(@Session()session:any) {
  //    if(session.userId === null) {
  //     throw new NotFoundException('User not found')
  //    }
  //    return this.usersService.findOne(session.userId)
  //  }


  @Get('/user/me')
  @UseGuards(AuthGuard)
   getUser(@currentUser() user:User) {
    return user
   }
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto,@Session() session:any) {
    // this.usersService.create(body.email, body.password);
 const user = await this.authService.signup(body.email,body.password)
 session.userId = user.id
 return user;
  }


  @Post('/signin')

 async signin(@Body() body: CreateUserDto,@Session() session:any) {

    const user = await this.authService.signin(body.email,body.password)
    session.userId = user.id

    return user
  }


  // sign out user

  @Post('/signout')
  signOut(@Session() session:any) {
    session.userId = null

  }


  @Get('/:id')
  async findUser(@Param('id') id: string) {

    const newId = parseInt(id)
    const user = await this.usersService.findOne(newId )

    if(!user) {
      throw new NotFoundException('user not found')
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email:string) {
    return this.usersService.find(email)

  }


  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    const newId = parseInt(id)
    return this.usersService.remove(newId)
  }


  @Patch('/:id')

  updateUser(@Param('id') id:string, @Body() body: UpdateUserDto) {

    const idToUpdate = parseInt(id)

    return this.usersService.update(idToUpdate,body)
  }
}
