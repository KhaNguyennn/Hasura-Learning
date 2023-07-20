import {
  Model,
  Column,
  Table,
  BeforeCreate,
  HasMany,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  
} from 'sequelize-typescript';
import { ScoreModel } from './score';
import { UserModel } from './user';
// import { Tracing } from 'trace_events';
interface IUser {
  id:number;
  username: string;
  password: string;
}
@Table({ tableName: "user_stats", underscored: true })
export class UserStatsModel extends Model<UserStatsModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;
  
  @Column
  public name!: string;

  @Column
  public sum_score!: number;

  @ForeignKey (() => UserModel)
  @Column
  user_id!: number;
  
  @BelongsTo(() => UserModel, 'user_id')
  user!: UserModel
  
}
