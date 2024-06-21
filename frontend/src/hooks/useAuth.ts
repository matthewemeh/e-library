import { useAppSelector } from './useRootStorage';

const useAuth = (): boolean => {
  const { role } = useAppSelector(state => state.user);
  const { isAuthenticated } = useAppSelector(state => state.userData);

  return isAuthenticated && role !== 'USER';
};

export default useAuth;
