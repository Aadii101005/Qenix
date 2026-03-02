import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async register(name: string, email: string, pass: string) {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) throw new ConflictException('Email already exists');

        const hashedPassword = await bcrypt.hash(pass, 10);
        const user = new this.userModel({ name, email, password: hashedPassword });
        await user.save();
        return { message: 'User registered successfully' };
    }

    async login(email: string, pass: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user._id.toString(), email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { id: user._id.toString(), name: user.name, email: user.email },
        };
    }
}
