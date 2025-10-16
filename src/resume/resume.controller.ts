import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiBearerAuth} from '@nestjs/swagger';
import {JwtGuard} from 'src/auth/guards/jwt.guard';

@ApiBearerAuth()
@Controller('resume')
@UseGuards(JwtGuard)
export class ResumeController {
  @Get()
  getResume() {
    return {message: 'This is the resume endpoint.'};
  }


}
