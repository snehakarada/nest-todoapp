import { Controller, Get, Post, Body, Param, Patch, Delete, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

const getCookie = (req) => {
  return req.cookies["userName"]
}

@Controller("/user")
export class session {
  constructor(private readonly appService: AppService) { }

  @Post()
  addUser(@Body() FormData: any, @Req() req: Request, @Res() res: any): any {
    this.appService.addUser(FormData.username)
    return res.redirect('/index.html')
  }
}

@Controller("/deleteUser")
export class logout {
  constructor(private readonly appService: AppService) { }

  @Post()
  deleteUser(@Req() req: Request, @Res() res: any) {
    this.appService.deleteUser(req.cookies.username)
    return res.redirect('/login.html')
  }

}

@Controller("/todolist")
export class todoController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getList(@Req() req: Request, @Res() res: any): any {
    const value = this.appService.serveList(req.cookies["userName"])
    if (value.isUserThere) {
      return res.status(200).json(value.list);
    }
    return res.status(300).redirect('/login.html')
  }
}

@Controller("/todo")
export class listController {
  constructor(private readonly appService: AppService) { }

  @Post("/list")
  saveList(@Body() body: any, @Req() req: any): void {
    this.appService.saveList(body.listName, getCookie(req))
  }

  @Post("/task/:id")
  saveTask(@Param('id') id: string, @Body() body: any, @Req() req: any): void {
    this.appService.saveTask(id, body.taskName, getCookie(req))
  }

  @Delete("/list/:id")
  deleteList(@Param('id') id: string, @Req() req: any): void {
    this.appService.deleteList(id, getCookie(req))
  }
}

@Controller("/list/:id/task/:taskId")
export class deletion {
  constructor(private readonly appService: AppService) { }

  @Patch()
  toggleTask(@Param('id') id: string, @Param('taskId') taskId: string, @Req() req: any) {
    this.appService.toggleTask(id, taskId, getCookie(req))
  }

  @Delete()
  deleteTask(@Param('id') id: string, @Param('taskId') taskId: string, @Req() req: any) {
    this.appService.deleteTask(id, taskId, getCookie(req))
  }
}
