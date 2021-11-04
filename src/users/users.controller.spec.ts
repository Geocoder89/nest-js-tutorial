import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService} from './users.service'
import { User} from './user.entity'
import { AuthService} from './auth/auth.service'

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {

    fakeUsersService = {
      findOne: (id:number)=>{
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf'
        } as User)
      },
      find: (email: string)=> {
        return Promise.resolve([
          {
            id: 1,
            email: 'asdf@asdf.com',
            password: 'asdf'
          } as User
        ])
      },
      remove: (id: number)=> {
        return Promise.resolve({
          id,
          email: 'dele@test.com',
          password: 'asdf'
        } as User)
      },
      update: (id: number)=> {
        return Promise.resolve({
          id,
          email: 'dele@test.com',
          password: 'asdf'
        } as User)
      },
    }

    fakeAuthService = {
      signin: (email,password)=> {
        return Promise.resolve({
          id: 1,
          email,
          password
        } as User)
      },
      // signup: ()=> {}
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: fakeUsersService
      },

      {
        provide: AuthService,
        useValue: fakeAuthService
      }
    ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should find all Users with a given email',async()=>{

    const users = await controller.findAllUsers('asdf@asdf.com')
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('it should find a singular user with a given id',async()=>{
    const user = await controller.findUser('2');
    expect(user).toBeDefined();
    expect(user.id).toEqual(2)
  })

  it('it throws an error if user with given id is not found',async()=> {
   fakeUsersService.findOne = ()=> null
   try {
    await controller.findUser('1')
   } catch (error) {
    console.log(error)
   }
  })

  it('signs in updates session object and returns user',async()=> {
    const session = {userId: 50}
    const user = await controller.signin({email: 'asdf@test.com',password:'asdf'},session)

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
});
