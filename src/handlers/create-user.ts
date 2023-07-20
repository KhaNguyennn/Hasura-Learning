import { Request, Response } from 'express'

function create_userHandler(): any {
  return {
    id: 1111,
    username: "<sample value>",
    password: "<sample value>",
  }
}

export const handler = (req: Request, res: Response) => {
  try {
    const result = create_userHandler();
    return res.json(result)
  } catch (error) {
    console.log(error);
    
  }
}