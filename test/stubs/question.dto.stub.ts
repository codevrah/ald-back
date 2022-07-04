import { QuestionDto } from '../../src/votes/dto/question.dto';

export const Question1DTOStub = (): QuestionDto => {
  return {
    published: true,
    question: 'Question1',
  };
};
