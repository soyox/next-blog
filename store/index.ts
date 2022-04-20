import {
  atom,
  selector,
  // useRecoilState,
  // useRecoilValue,
} from 'recoil';

export interface UserStateProps {
  userId?: string;
  nickname?: string;
  avatar?: string;
}
export const userState = atom<UserStateProps>({
  key: 'userState',
  default: {},
});

export const userIdState = selector({
  key: 'userIdState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }: any) => {
    const user = get(userState);

    return user.userId;
  },
});

export const getUserState = selector({
  key: 'getUserState',
  get: ({ get }: any) => {
    const user = get(userState);

    return user;
  },
});
