import {
  Model,
  Column,
  Table,
  BeforeCreate,
  HasMany,
  PrimaryKey,
  DataType,
  
} from 'sequelize-typescript';
import { ScoreModel } from './score';
import { UserStatsModel } from './user_stats';
// import { Tracing } from 'trace_events';
interface IUser {
  id:number;
  username: string;
  password: string;
}
@Table({ tableName: "users", underscored: true })
export class UserModel extends Model<UserModel> {
  @PrimaryKey
  @Column(
    {
      type: DataType.INTEGER,
      autoIncrement: true,
    }
  )
  public id!: number;
  @Column
  public username!: string;

  @Column
  public password!: string;

  @HasMany(() => ScoreModel)
  scores!: ScoreModel[];
  @HasMany(() => UserStatsModel)
  user_stats!: UserStatsModel[];
}

// import { Model, DataTypes } from 'sequelize';
// import sequelize from '../config/database'; // Import đối tượng kết nối Sequelize

// class UserModel extends Model {
//   public id!: number;
//   public username!: string;
//   public password!: string;

//   // Khai báo các mối quan hệ (nếu có)
//   static associate(models: any) {
//     UserModel.hasMany(models.Score);
//   }
// }

// UserModel.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: 'User', // Tên mô hình
//     tableName: 'Users', // Tên bảng trong cơ sở dữ liệu
//     timestamps: true, // Thêm timestamps created_at và updated_at
//     underscored: true, // Sử dụng chữ thường và gạch dưới cho các cột và khóa ngoại
//   }
// );

// export default UserModel;
