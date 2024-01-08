import { IsDateString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ESex, IUser } from '../users/types';

export type UserDTO = Omit<IUser, 'password'>;

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SignUpDTO implements Omit<IUser, 'id'> {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  sex?: ESex;
}
