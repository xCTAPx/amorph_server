import { UserDTO } from '@/auth/types';
import { IUser } from '@/users/types';

export function prepareUser(user: IUser): UserDTO {
  const { id, firstName, lastName, age, birthDate, email, phoneNumber, sex } =
    user;

  return { id, firstName, lastName, age, birthDate, email, phoneNumber, sex };
}
