import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import PageLayout from 'layouts/PageLayout';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { PATHS } from 'routes/PathConstants';
import { logout } from 'services/apis/userApi/userSlice';
import { resetUserData } from 'services/userData/userDataSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';
import { useUpdateUserMutation } from 'services/apis/userApi/userApi';

import { showAlert } from 'utils';
import RiUser3Line from 'assets/ri-user-3-line.svg';

const Profile = () => {
  const { FORGOT_PASSWORD } = PATHS;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const nameRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const profileImagePreviewRef = useRef<HTMLImageElement>(null);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const { _id, name, email, profileImageUrl } = useAppSelector(state => state.user);
  const [updateUser, { error, isError, isLoading, isSuccess }] = useUpdateUserMutation();

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newName: string = nameRef.current!.value;
    const profileImage: File | undefined = profileImageRef.current!.files?.[0];

    const userPayload: UserUpdatePayload = { _id, userID: _id };

    if (newName && name !== newName) userPayload.name = newName;
    if (profileImageChanged) userPayload.profileImage = profileImage;

    if (Object.keys(userPayload).length === 2) {
      return showAlert({ msg: 'No changes made!' });
    }

    updateUser(userPayload);
  };

  const updatePreviewImage = (imageFile: File | null | undefined) => {
    const imageTag: HTMLImageElement = profileImagePreviewRef.current!;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.addEventListener('load', () => {
        const result = `${reader.result ?? ''}`;
        imageTag.src = result;
      });
    } else {
      imageTag.src = profileImageUrl || RiUser3Line;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setProfileImageChanged(false);
      showAlert({ msg: 'Updated details successfully' });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error && 'status' in error) {
      showAlert({ msg: `${error.data ?? ''}` });
      console.error(error);
    }
  }, [error, isError]);

  return (
    <PageLayout>
      <section
        className='bg-white p-8 rounded-lg dark:dark:bg-nile-blue-900 flex flex-col items-center'
        onSubmit={handleUpdateUser}>
        <label htmlFor='profile-image' className='cursor-pointer'>
          <img
            alt=''
            ref={profileImagePreviewRef}
            src={profileImageUrl || RiUser3Line}
            className='w-[100px] h-[100px] text-current rounded-half bg-zircon border-2 border-nile-blue-900 dark:border-zircon'
          />
        </label>
        <h1 className='text-2xl font-semibold mt-4'>Update your details</h1>

        <form onSubmit={handleUpdateUser}>
          <FormInput
            readOnly
            disabled
            type='email'
            label='Email'
            inputID='email'
            inputName='email'
            defaultValue={email}
            autoComplete='username'
            extraLabelClassNames='mt-8'
            extraInputClassNames='dark:bg-nile-blue-950'
          />

          <FormInput
            type='text'
            label='Full Name'
            inputRef={nameRef}
            spellCheck={false}
            inputID='full-name'
            defaultValue={name}
            inputName='full-name'
            autoComplete='full-name'
            extraLabelClassNames='mt-[15px]'
            extraInputClassNames='dark:bg-nile-blue-950'
          />

          <FormInput
            type='file'
            label='Profile Image'
            inputID='profile-image'
            onChange={e => {
              const imageFile: File | undefined = e.target.files?.[0];
              updatePreviewImage(imageFile);
              !profileImageChanged && setProfileImageChanged(true);
            }}
            inputName='profile-image'
            accept='.png, .jpg, .webp'
            inputRef={profileImageRef}
            extraLabelClassNames='mt-[15px]'
            extraInputClassNames='dark:bg-nile-blue-950'
          />

          <AuthButton
            type='submit'
            title='Update'
            disabled={isLoading}
            isLoading={isLoading}
            extraClassNames='dark:bg-zircon dark:text-nile-blue-900 dark:hover:bg-transparent dark:hover:text-zircon dark:hover:border-zircon'
          />

          <AuthButton
            type='button'
            title='Reset Password?'
            onClick={() => {
              dispatch(logout());
              dispatch(resetUserData());
              navigate(FORGOT_PASSWORD);
            }}
            extraClassNames='dark:!bg-transparent dark:!text-zircon dark:!border-transparent h-0'
          />
        </form>
      </section>
    </PageLayout>
  );
};

export default Profile;
