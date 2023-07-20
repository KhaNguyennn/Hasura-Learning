import express, { Express } from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import databaseConnection from '../models';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { UserModel } from '../models/user';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import * as xlsx from 'xlsx';
import { ScoreModel } from '../models/score';
import sequelize from '../models';
import * as OneSignal from 'onesignal-node';  
import https from 'https'
import axios from 'axios';
import { auth } from 'express-oauth2-jwt-bearer';
import { UserStatsModel } from '../models/user_stats';
import { UUID, UUIDV1, UUIDV4 } from 'sequelize';
import authRoute from '../routes/auth';
const main = async () => {

	
	
	const server = new ApolloServer({typeDefs, resolvers});
	await server.start()
	const app : Express = express()
	server.applyMiddleware({app});
	app.use(bodyParser.json());
	app.get("/", (req, res) => {
		res.send('Hello world');
	})
	app.get("/health", (_,res) => res.status(200).send("OK"))
	app.get("/healthz", (_,res) => res.status(200).send("OK"))
	app.post('/hello', (req: Request, res: Response)  => {
		try {
			// const handler = require(`./handlers/${req.params.route}`);
			// if(!handler) {
			// 	return res.status(404).json({
			// 		message: 'not found'
			// 	})
			// }
			// return handler(req, res);
			res.json({"hello": "world"})
		} catch (error) {
			console.log(error);
			
		}
	})

	// const jwtCheck = auth({
	// 	audience: 'http://localhost:8080/v1/graphql',
	// 	issuerBaseURL: 'https://dev-hes6imoeqvqtb14e.us.auth0.com/',
	// 	tokenSigningAlg: 'RS256'
	// });
	
	// // enforce on all endpoints
	// app.use(jwtCheck);
	
	app.get('/authorized', function (req, res) {
			// const token = req.headers.authorization;
			// if(!token) {
				console.log("okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
				
				return res.json({
					["x-hasura-role"]: "user",
					["x-hasura-user-id"]: '1'
				})
			// }
	});
	
	app.get('/auth', authRoute);


	app.post('/create-user', async (req: Request, res: Response)  => {
		try {
			console.log(req.body);
			const newUserInput = req.body.input.credentials;
			console.log(newUserInput);
			
			const newUser = await UserModel.create({
				...newUserInput
			})
			return res.status(200).send({
				id: newUser.id,
				username: newUser.username,
				password: newUser.password
			})
		} catch (error) {
			console.log(error);
			
		}
	})

	app.get('/sum-score-for-users', async (req: Request, res: Response) => {
		try {
			const users = await UserModel.findAll({});
			const result = await Promise.all(users.map(async (user: any) => {
				const userScores = await ScoreModel.findAll({
					where: {
						user_id: user.id
					}
				})
				let summaryScore = 0;
				userScores.map((score: any) => {
					summaryScore = summaryScore + score.score;
				})
				const obj = {
					id: user.id,
					username: user.username,
					password: user.password,
					sumScore: summaryScore
				}
				return obj;
				
			}))
			const outputFile = 'users.xlsx';
			// Tạo workbook mới
			const workbook = xlsx.utils.book_new();

			// Chuyển đổi dữ liệu JSON thành mảng các đối tượng dạng bảng
			const worksheetData = xlsx.utils.json_to_sheet(result);

			// Thêm worksheet vào workbook
			xlsx.utils.book_append_sheet(workbook, worksheetData, 'Sheet 1');

			// Lưu workbook thành tệp Excel
			xlsx.writeFile(workbook, outputFile);	
			res.json(result);
		} catch (error) {
			console.log("Failed when getting sum score",error);
		}
	})

	app.get('/show-users', async (req:Request, res: Response) => {
		try {
			const users = await UserModel.findAll({});

			const result = await Promise.all(users.map(async(user) => {
				const userScores = await ScoreModel.findAll({
					where: {
						user_id: user.id
					}
				})
				return  {
					id: user.id,
					username: user.username,
					password: user.password,
					scores: userScores.map((score) => (
						{
							id: score.id,
							course: score.course,
							score: score.score
						})
					)
				}
			}))
			res.json(result);
		
			
		} catch (error) {
			console.log("Failed when showing users",error);
			
		}
	})


	//Cron job
	app.post('/user-stats', async (req: Request, res: Response) => {
		try {
			// console.log(req);
			
			const users = await UserModel.findAll({});
			const result = await Promise.all(users.map(async (user: any) => {
				const userScores = await ScoreModel.findAll({
					where: {
						user_id: user.id
					}
				})
				let summaryScore = 0;
				userScores.map((score: any) => {
					summaryScore = summaryScore + score.score;
				})
				const obj = {
					
					name: user.username,
					// password: user.password,
					sum_score: summaryScore,
					user_id: user.id
				}
				return obj;
				
			}))

			let userStats = await UserStatsModel.bulkCreate(result.map((data) => data as UserStatsModel))
			console.log(userStats);
			
			// result.map( async(data) => {
			// 	// let id = UUID;
			// 	let userId = data.id;
			// 	let userName = data.username;
			// 	let userScore = data.sumScore;
			// 	// console.log(userId);
			// 	console.log(data);
			// 	// await sequelize.query('INSERT INTO user_stats(user_id, name, sum_score) VALUES (:userId, :userName, :userScore)', {
			// 	// 	replacements: { userId, userName, userScore }
			// 	// }).catch(error => {
			// 	// 	console.log('Error occurred during user stats creation:', error);
			// 	// 	throw error; // Ném lại lỗi để báo hiệu lỗi đã xảy ra
			// 	// });
			// 	let userCredentials = {
			// 		// id: 'sdfhgdfghfdh',
			// 		name: userName,
			// 		sum_score: userScore,
			// 		user_id: userId,

			// 	}
			// 	// await UserStatsModel.create(
			// 	// 	{
			// 	// 		...userCredentials
			// 	// 	});
			// 	let userStats = await UserStatsModel.create(userCredentials as UserStatsModel);
			// 	console.log(userStats);
				
			// })
			res.status(200).json({ success: true, message: 'User stats created successfully' });
		} catch (error) {
			console.log('Faild when creating user stats', error);
			
		}
	})
	// const sendNotification = function(data: any) {
	// 	const headers = {
	// 		"Content-Type": "application/json; charset=utf-8",
	// 		"Authorization": "Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj"
	// 	};
		
	// 	const options = {
	// 		host: "onesignal.com",
	// 		port: 443,
	// 		path: "/api/v1/notifications",
	// 		method: "POST",
	// 		headers: headers
	// 	};
		
	// 	const https = require('https');
	// 	const req = https.request(options, function(res: any) {  
	// 		res.on('data', function(data: any) {
	// 			console.log("Response:");
	// 			console.log(JSON.parse(data));
	// 		});
	// 	});
		
	// 	req.on('error', function(e: any) {
	// 		console.log("ERROR:");
	// 		console.log(e);
	// 	});
		
	// 	req.write(JSON.stringify(data));
	// 	req.end();
	// };





	const APP_ID = '9b278345-2ce1-4bae-afd7-fc58a78e7044';
	const API_KEY = 'ZjA3NmU5M2MtZTIzYy00ODJhLWI3MGItNDAxYmMwYWEzMTQ5';

	interface OneSignalNotification {
  app_id: string;
  contents: { [key: string]: string };
  headings: { [key: string]: string };
  include_player_ids: string[];
	}
	app.post('/send-notification', async (req: Request, res: Response) => {
		
	const { playerIds, message, title } = req.body;

  const notification: OneSignalNotification = {
    app_id: APP_ID,
    contents: { en: message },
    headings: { en: title },
    include_player_ids: playerIds,
  };

  try {
    await axios.post('https://onesignal.com/api/v1/notifications', notification, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${API_KEY}`,
      },
    });
    console.log('Notification sent successfully!');
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
	})


	// const client = new ApolloClient({
	// 	uri: 'http://',

	// })
	// app.get('/show-users', async (req:Request, res: Response) => {
	// 	try {
	// 		const response = await client.query({
	// 			query: gql`
	// 				query {
						
	// 					users {
	// 						id
	// 						name
	// 					}
	// 				}
	// 			`,
	// 		});
	
	// 		// Trích xuất dữ liệu từ phản hồi GraphQL
	// 		const data = response.data.users;
	
	// 		// Trả về dữ liệu cho người dùng
	// 		res.json(data);
			
	// 	} catch (error) {
	// 		console.log("Failed when showing users",error);
			
	// 	}
	// })
	
	
	// Request Handler
	// app.post('/create_user',  (req: Request, res: Response) => {
	// 	// get request input
	// 	try {
			
	// 	} catch (error) {
			
	// 	}
	// 	const params: create_userArgs = req.body.input
	
	// 	// run some business logic
	// 	const result = create_userHandler(params)
	
	// 	/*
	// 	// In case of errors:
	// 	return res.status(400).json({
	// 		message: "error happened"
	// 	})
	// 	*/
	
	// 	// success
	// 	return res.json(result)
	// })
	const PORT = process.env.PORT || 8000;
	databaseConnection.sync({}).then(() => {
		console.info('INFO - Database sync complete.')

    console.info('SETUP - Starting server...')	

		app.listen(PORT, () => console.log(`Server start on port ${PORT}`))
	})
	.catch((err: any) => {console.log(err);
	})
}
main().catch((err) => console.log(err));

// sequelize.sync().then(() => {
//     server.listen().then(({url}:{url: string}) => {
//         console.log(`Server listening at ${url}`);
//     })
// })

