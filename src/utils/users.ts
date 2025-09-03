import { UserDTO } from '@/auth/types';
import { User } from '@/users/entities/user.entity';
import { IUser } from '@/users/types';

export function prepareUser(user: IUser): UserDTO {
  const { id, firstName, lastName, age, birthDate, email, phoneNumber, sex } =
    user;

  return { id, firstName, lastName, age, birthDate, email, phoneNumber, sex };
}

export function transformDbUserToIUser(user: User): IUser {
  const { id, first_name, last_name, age, birth_date, email, phone_number, sex, password } =
    user;

  return { id, firstName: first_name, lastName: last_name, age, birthDate: birth_date, email, phoneNumber: phone_number, sex, password };
}
