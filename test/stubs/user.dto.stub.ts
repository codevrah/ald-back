import { UserDto } from '../../src/votes/dto/user.dto';

export const User1DTOStub = (): UserDto => {
  return {
    userId: '324456',
    displayName: 'User1',
    email: 'user1@fakegmail.com',
    avatar: 'https://avatars0.githubusercontent.com/u/1234?s=460&v=4',
  };
};

export const User2DTOStub = (): UserDto => {
  return {
    userId: '324457',
    displayName: 'User2',
    email: 'user2@fakegmail.com',
    avatar: 'https://avatars.githubusercontent.com/u/185856?v=4',
  };
};
