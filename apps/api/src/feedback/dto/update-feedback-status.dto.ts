import { IsEnum, IsString, IsOptional } from 'class-validator';
import { FeedbackStatus } from '@corporate/db';

export class UpdateFeedbackStatusDto {
  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;

  @IsString()
  @IsOptional()
  adminReply?: string;
}
