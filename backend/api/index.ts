import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
const express = require('express');

const server = express();

const createServer = async (expressInstance: any) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.init();
};

let serverStarted = false;

module.exports = async (req: any, res: any) => {
  if (!serverStarted) {
    await createServer(server);
    serverStarted = true;
  }
  return server(req, res);
};
