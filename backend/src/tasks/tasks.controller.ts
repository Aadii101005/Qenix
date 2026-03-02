import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Body() createTaskDto: any, @Request() req: any) {
        return this.tasksService.create(createTaskDto, req.user.userId);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.tasksService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.tasksService.findOne(id, req.user.userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: any, @Request() req: any) {
        return this.tasksService.update(id, updateTaskDto, req.user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: any) {
        return this.tasksService.remove(id, req.user.userId);
    }
}
