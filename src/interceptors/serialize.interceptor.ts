import
{
  UseInterceptors,
  NestInterceptor,ExecutionContext,CallHandler
} from '@nestjs/common'


import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {plainToClass} from 'class-transformer'


interface ClassConstructor {
  new (...args: any[]): {}
}

export function serializeData(dto:ClassConstructor) {


  return UseInterceptors(new SerializeInterceptor(dto))



}


export class SerializeInterceptor implements NestInterceptor {

  // constructor to define a generic dto type which we pass into the plain class method

  constructor(private dto: any) {

  }
  intercept(context:ExecutionContext,handler: CallHandler):Observable<any> {



    // after the request is handled before a request is handled by the request handler.


    return handler.handle().pipe(
      map((data:any)=>{

        // take incoming user entity and turn it to an instance of user dto

        return plainToClass(this.dto,data,{
          excludeExtraneousValues: true,
        })
      })
    )
  }
}
