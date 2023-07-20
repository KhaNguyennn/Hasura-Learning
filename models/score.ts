import {
  Model,
  Column,
  Table,
  BeforeCreate,
  HasMany,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { UserModel } from './user';

// import { Tracing } from 'trace_events';
interface IUser {
  username: string;
  password: string;
}
@Table({ tableName: "scores", underscored: true })
export class ScoreModel extends Model<ScoreModel> {
  @PrimaryKey
  @Column(
    {
      type: DataType.INTEGER,
      autoIncrement: true,
    }
  )
  id!: number;
  @Column
  course!: string;

  @Column
  score!: number;

  @ForeignKey (() => UserModel)
  @Column
  user_id!: number;
  
  @BelongsTo(() => UserModel, 'user_id')
  user!: UserModel
  

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
