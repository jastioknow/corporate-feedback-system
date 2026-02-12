import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateFeedbackStatusDto } from './dto/update-feedback-status.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('feedback')
@UseGuards(AuthGuard('jwt'))
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  create(@Body() dto: CreateFeedbackDto, @Req() req: RequestWithUser) {
    return this.feedbackService.create(dto, req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeedbackStatusDto) {
    return this.feedbackService.updateStatus(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.feedbackService.findAll(req.user.sub, req.user.role);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.feedbackService.remove(id, req.user.sub);
  }
}
