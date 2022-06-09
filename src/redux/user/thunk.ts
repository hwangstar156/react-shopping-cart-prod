import { client } from 'apis';
import type { Dispatch } from 'redux';
import { RootState } from 'redux/rootReducer';
import { LoginRequest, LoginResponse, UserInfo, UserInfoWithPassword } from 'types/domain';

import { UserAction, userActions } from './action';

export const getUser = () => async (dispatch: Dispatch<UserAction>) => {
  const accessToken = localStorage.getItem('access-token');

  if (!accessToken) return;

  dispatch(userActions.getUserGroup.request());
  try {
    const response = await client.get<UserInfo>('/customers/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    dispatch(userActions.getUserGroup.success(response.data));
  } catch (e: unknown) {
    if (e instanceof Error) {
      dispatch(userActions.getUserGroup.failure(e));
    }
  }
};

export const login =
  (userInfo: LoginRequest) => async (dispatch: Dispatch<UserAction>, getState: () => RootState) => {
    dispatch(userActions.loginGroup.request());
    try {
      const response = await client.post<LoginResponse | string>('/login', userInfo);

      if (typeof response.data === 'string') {
        throw new Error(response.data);
      }
      const { accessToken } = response.data;

      localStorage.setItem('access-token', accessToken);
      dispatch(userActions.loginGroup.success(response.data));

      return getState().user.data.name;
    } catch (e: unknown) {
      if (e instanceof Error) {
        dispatch(userActions.loginGroup.failure(e));
      }
    }
  };

export const signup =
  (userInfo: UserInfoWithPassword) => async (dispatch: Dispatch<UserAction>) => {
    dispatch(userActions.signupGroup.request());
    try {
      const response = await client.post<UserInfo | string>('/customers', userInfo);

      if (typeof response.data === 'string') {
        throw new Error(response.data);
      }

      dispatch(userActions.signupGroup.success());
    } catch (e: unknown) {
      if (e instanceof Error) {
        dispatch(userActions.signupGroup.failure(e));
      }
    }
  };

export const editUserInfo =
  (userInfo: UserInfoWithPassword) => async (dispatch: Dispatch<UserAction>) => {
    const accessToken = localStorage.getItem('access-token');

    if (!accessToken) return;

    dispatch(userActions.editGroup.request());
    try {
      const response = await client.put<UserInfo | string>('/customers/me', userInfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (typeof response.data === 'string') {
        throw new Error(response.data);
      }

      dispatch(userActions.editGroup.success(response.data));
    } catch (e: unknown) {
      if (e instanceof Error) {
        dispatch(userActions.editGroup.failure(e));
      }
    }
  };

export const deleteUser =
  (password: { password: string }) => async (dispatch: Dispatch<UserAction>) => {
    const accessToken = localStorage.getItem('access-token');

    if (!accessToken) return;
    dispatch(userActions.deleteGroup.request());
    try {
      const response = await client.delete('/customers/me', {
        data: password,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 204) {
        throw new Error(response.data);
      }

      localStorage.removeItem('access-token');
      dispatch(userActions.deleteGroup.success(response.data));
    } catch (e: unknown) {
      if (e instanceof Error) {
        dispatch(userActions.deleteGroup.failure(e));
      }
    }
  };
