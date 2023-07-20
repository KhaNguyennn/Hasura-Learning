import { UserModel } from "../models/user";

export async function register(user: UserModel): Promise<void> {
 try {
   await UserModel.create(user);
 } catch (error) {
   throw error;
 }
}

export async function login(user: UserModel) {
 try {
   const foundUser = await UserModel.findOne({where:{ username: user.username, password: user.password }});
 } catch (error) {
   throw error;
 }
}