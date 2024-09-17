import bcrypt from 'bcrypt';
import express, { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import * as http from 'http';
import * as mongoose from 'mongoose';

import { configs } from './configs/configs';
import { cronRunner } from './crons';
import { ERoles } from './enums/roles.enum';
import { ApiError } from './errors/api.error';
import { User } from './models/User.model';
import { userRepository } from './repositories/user.repository';
import { authRouter } from './routers/auth.router';
import { carRouter } from './routers/car.router';
import { userRouter } from './routers/user.router';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/users', userRouter);
app.use('/cars', carRouter);
app.use('/auth', authRouter);

app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;

  res.status(status).json({
    message: error.message || 'Server error',
    status,
  });
});

server.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  cronRunner();
  console.log(`Server is running on port ${configs.PORT}`);

  const adminUser = await userRepository.getOneByParams({
    roles: ERoles.Admin,
  });

  if (!adminUser) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env file');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      email: adminEmail,
      password: hashedPassword,
      roles: ERoles.Admin,
      status: 'active',
      userType: 'admin',
    });

    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
});
