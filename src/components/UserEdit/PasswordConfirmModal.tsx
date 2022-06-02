import Button from 'components/common/Button';
import LabeledInput from 'components/common/LabeledInput';
import Modal from 'components/common/Modal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useInput from 'hooks/useInput';
import { useEffect } from 'react';
import { editUserInfo } from 'redux/user/thunk';
import styled from 'styled-components';

interface PasswordConfirmModalProps {
  name: string;
  closeModal: () => void;
}

const PasswordConfirmModal = ({ name, closeModal }: PasswordConfirmModalProps) => {
  const [password, onChangePassword] = useInput();
  const loginId = useAppSelector(state => state.user.data.loginId);
  const { data } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const onClickPasswordConfirmButton = () => {
    dispatch(editUserInfo({ loginId, name, password }));
  };

  useEffect(() => {
    if (name === data.name) {
      closeModal();
    }
  }, [data.name]);

  return (
    <Modal closeModal={closeModal}>
      <StyledPasswordConfirmContent>
        <LabeledInput
          label='비밀번호'
          id='password2'
          placeholder='비밀번호를 입력해주세요.'
          type='password'
          value={password}
          onChange={onChangePassword}
        />
        <Button
          type='submit'
          width='300px'
          height='36px'
          color='white'
          fontSize='14px'
          backgroundColor='primary'
          margin='24px 0 0'
          borderRadius='4px'
          onClick={onClickPasswordConfirmButton}
        >
          확인
        </Button>
      </StyledPasswordConfirmContent>
    </Modal>
  );
};

export default PasswordConfirmModal;

const StyledPasswordConfirmContent = styled.div`
  width: 500px;
  padding: 0 100px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: white;
`;
