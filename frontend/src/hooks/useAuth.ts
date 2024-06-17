import { useAppSelector } from './useRootStorage';

const useAuth = (): boolean => {
  const { isAuthenticated, role } = useAppSelector(store => store.user);
  return isAuthenticated && role !== 'USER';
};

export default useAuth;
