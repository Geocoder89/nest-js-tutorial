import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { create } from 'domain';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {

    // create a fake copy of the users service to satisfy testing conditions

    const users: User[] = [];
    fakeUsersService = {
      find: (email:string) => {
        const filteredUsers = users.filter(user=>user.email ===email)
        return Promise.resolve(filteredUsers)
      },

      create: (email:string,password: string)=>{
        const user = {
          id: Math.floor(Math.random()* 999999),
          email,
          password
        } as User
      users.push(user)
      return Promise.resolve(user)
      }
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('dele@test.com', 'abcde');
    expect(user.password).not.toEqual('abcde');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
   await service.signup('asdf@asdf.com', 'asdf')
    try {
      await service.signup('asdf@asdf.com', 'asdf');
    } catch (err) {
      console.log(err)
    }
  });


  it('throws an error if user email is unused on sign in',async()=>{
    try{
      await service.signin('abcdee@test.com','hello hi')
    } catch(err) {
     console.log(err)
    }
  })

  it('throws an error if an invalid password is provided',async () => {

    await service.signup('abe@test.com','asdf')

      try {
        await service.signin('abe@test.com','abbey')
      } catch (error) {
        console.log(error)
      }
  })

  it('returns a user if correct password is provided',async()=>{

    await service.signup('dele@test123.com','mypassword')

      const user = await service.signin('dele@test123.com','mypassword')

      expect(user).toBeDefined()
  })
});
