import { FeedbackService } from '../feedback.service';

export type FindAllResponse = Awaited<ReturnType<FeedbackService['findAll']>>;
