import AuthPage from 'components/common/AuthPage';
import LabeledInput from 'components/common/LabeledInput';
import Snackbar, { MESSAGE } from 'components/common/Snackbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuthError from 'hooks/useAuthError';
import useInput from 'hooks/useInput';
import useSnackBar from 'hooks/useSnackBar';
import React, { FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from 'redux/user/thunk';
import { PATH } from 'Routers';

const UserWithDrawal = () => {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useInput();
  const { data } = useAppSelector(state => state.user);
  const navigate = useNavigate();
  const { isOpenSnackbar, openSnackbar } = useSnackBar();

  useAuthError(openSnackbar);

  useEffect(() => {
    if (data === null) {
      navigate(PATH.home);
    }
  }, [data]);

  const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(deleteUser({ password }));
  };

  return (
    <AuthPage title='회원 탈퇴' onSubmitAuthForm={onSubmitForm}>
      <LabeledInput
        label='비밀번호'
        type='password'
        id='password3'
        placeholder='비밀번호를 입력해주세요.'
        value={password}
        onChange={setPassword}
      />
      {isOpenSnackbar && <Snackbar message={MESSAGE.password} />}
    </AuthPage>
  );
};

export default UserWithDrawal;
