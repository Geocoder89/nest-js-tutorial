import { Expose,Transform} from 'class-transformer'
import { User } from 'src/users/user.entity';
export class ReportDto {

  @Expose()
id: number;
@Expose()
price: number;
@Expose()
year: number;
@Expose()
lng: number;
@Expose()
lat:number;
@Expose()
mileage: number;
@Expose()
model: string
@Expose()
make: string;

@Transform(({obj})=>{
return obj.user.id
})
@Expose()
userId: number;

@Expose()
approved: boolean;
}
