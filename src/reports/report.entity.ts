import
{PrimaryGeneratedColumn,Entity,Column} from 'typeorm'

@Entity()
export class Report {

  @PrimaryGeneratedColumn()
  id: number

  // @Column()
  // name: string;
  @Column()
  price: number;
}
