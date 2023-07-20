import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import {UserModel} from './user';
import * as dotenv from "dotenv";
import { ScoreModel } from './score';
import { UserStatsModel } from './user_stats';

dotenv.config();



const sequelize = new Sequelize(
  process.env.DB_NAME ? process.env.DB_NAME : "",
  process.env.DB_USER ? process.env.DB_USER : "",
  process.env.DB_PASS ? process.env.DB_PASS : "",
  {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    logging: true,
    schema: "public",
    pool: {
        max: 300,
        idle: 30000,
        acquire: 60000,
    },
    query: { raw: true },
    models: [UserModel, ScoreModel, UserStatsModel],
  },
);
// sequelize.addModels([UserModel]);
// console.log(sequelize.models);
sequelize.authenticate().then(() => {
  console.info("DATABASE CONNECTED");
  }).catch((err) => {
    console.error("UNABLE TO CONNECT TO THE DATABASE");
  })

export default sequelize;
