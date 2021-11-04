import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import {randomBytes,scrypt as _scrypt} from 'crypto'
import {promisify} from 'util'


const scrypt = promisify(_scrypt)


@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {

  }

  async signup(email: string,password: string) {
    // see if email is in use


    const users = await this.userService.find(email)

    if(users.length) {
      throw new BadRequestException('email already in use')
    }

    // hash users password

// generate a salt

const salt = randomBytes(8).toString('hex')
// hash the salt and password together

const hashedPassword = (await scrypt(password,salt,32)) as Buffer

// join the hashed result and the salt together

const result = salt + '.' + hashedPassword.toString('hex')
    // create a new user and save it

    const user = await this.userService.create(email,result)

    // return the user

    return user;
  }


  // signin method
  async signin(email:string,password: string) {
    const [user] = await this.userService.find(email)

    if(!user) {

      throw new NotFoundException('User not found')
    }
    const [salt,hash] = user.password.split('.')

    const hashedPassword = (await scrypt(password,salt,32)) as Buffer

    if(hash !== hashedPassword.toString('hex')) {
      throw new BadRequestException('Wrong email and password')
    }
    return user;
  }
}
