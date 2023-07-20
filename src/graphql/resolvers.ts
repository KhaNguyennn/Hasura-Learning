import { UUIDV4 } from 'sequelize';
import { ScoreModel } from '../../models/score';
import { UserModel } from '../../models/user';
import { getUsers} from '../utils';


export const resolvers = {
        User: {
          scores: async (parent: UserModel) => {
            const userId = parent.id;
            return await ScoreModel.findAll({
              where: {
                user_id: userId
              }
            })
          },
        },
        Query: {
          getUsers: async () => {
            // console.log(info);
            const users = await UserModel.findAll({
              // include: [{model: ScoreModel,
              // as: "scores"}]
            });
            // console.log(users.map((user) => user.scores.map((result) => result.course)));
            console.log(users);
            
            if(users) return users;
            return {
              message: "Yo, there was an error!"
            }
          },
          user: async (_parent: any, args: any) => {
            const userId = args.id;
            const user = await UserModel.findOne({where: {id: <number>userId}});
            return user;
            // console.log(user);
            
          },
          getScores: async() => {
            return await ScoreModel.findAll({})
          },
          score: async (_parent: any, args: any) => {
            // console.log(args);
            const courseName = args.course;
            return await ScoreModel.findOne({where: {course: courseName}});
          }
        },
        Mutation: {
          deleteUser:async (parent: any, args: any) => {
            const userId = args.id;
            const deleteUser = await UserModel.findOne({where: {
              id: userId,
            }})
            if (deleteUser) {
              console.log("Delete User Successfully");
              
            }
          },
          createUser: async (parent: any, args: any) => {
            const newUserInput = args.input;
            const newUser = await UserModel.create({
              ...newUserInput // phải nhập id
            });
            return newUser;
          },
          updateUserName: async (_parent: any, args: any) => {
            console.log(args);
            
            const {id, newUserName} = args.input;
            console.log(id);
            console.log(newUserName);
            
            const newUser = await UserModel.update({
              username: <string>newUserName
            },
            {
              where: {
                id: <number>id
              }
            }
            );
            return newUser;
            
          },
        },

        // UsersResult: {
        //   __resolveType(obj: UserModel) {
        //     console.log(obj);
            
        //     if (obj.users) {
        //       return "UsersSuccessfulResult";
        //     }
        //     if (obj.message) {
        //       return "UsersErrorResult";
        //     }
        //     return null;
        //   }
        // }
      };
