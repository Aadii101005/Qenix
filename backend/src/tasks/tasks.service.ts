import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from '../schemas/task.schema';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<Task>) { }

    async create(createTaskDto: any, userId: string) {
        const newTask = new this.taskModel({
            ...createTaskDto,
            userId: new Types.ObjectId(userId),
        });
        return newTask.save();
    }

    async findAll(userId: string) {
        return this.taskModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findOne(id: string, userId: string) {
        const task = await this.taskModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: string, updateTaskDto: any, userId: string) {
        const updatedTask = await this.taskModel.findOneAndUpdate(
            { _id: id, userId: new Types.ObjectId(userId) },
            updateTaskDto,
            { new: true },
        ).exec();
        if (!updatedTask) throw new NotFoundException('Task not found');
        return updatedTask;
    }

    async remove(id: string, userId: string) {
        const result = await this.taskModel.deleteOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
        if (result.deletedCount === 0) throw new NotFoundException('Task not found');
        return { message: 'Task deleted' };
    }
}
