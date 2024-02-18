import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResetPassDto } from './dto/reset-pass.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const geoip = require('geoip-lite');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import User from 'src/users/entities/user.entity';
import UserSession from 'src/users-sessions/entities/user-session.entity';
import { nanoid } from 'nanoid';
import Employeeship from 'src/employeeships/entities/employeeship.entity';
import { SmsService } from 'src/sms/sms.service';
import { totp } from 'otplib';

totp.options = {
  digits: 6,
  epoch: Date.now(),
  step: 300,
  window: 300,
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private smsService: SmsService) {}
  async create_username(name: string) {
    const id = (await User.findOne({
      where: { username: name },
      paranoid: false,
    }))
      ? `.${nanoid(3)}`
      : '';

    const username = `${name.toLowerCase().replace(/\s/g, '')}${id}`;
    while (await User.findOne({ where: { username } })) {
      return this.create_username(name);
    }
    return username;
  }

  async signup(registerDto: RegisterDto) {
    if (registerDto.primary_contact === 'phone' && !registerDto.phone)
      throw new BadRequestException('Please provide phone number.');

    if (registerDto.primary_contact === 'email' && !registerDto.email)
      throw new BadRequestException('Please provide email address.');

    if (!registerDto.password)
      throw new BadRequestException('Please provide password.');

    const ref_user = registerDto.referral_code
      ? await User.findOne({
          where: {
            referral_code: registerDto.referral_code,
          },
          paranoid: false,
        })
      : null;

    try {
      const user = await User.create(
        {
          ...registerDto,
          ...(ref_user && {
            referred_by_id: ref_user.id,
          }),
        },
        {
          fields: [
            'first_name',
            'last_name',
            'username',
            'password',
            'gender',
            'email',
            'phone',
            'dob',
            'address',
            'registered_from',
            'referral_code',
            'referred_by_id',
          ],
        },
      );

      if (!!registerDto.organization_id) {
        await Employeeship.create(
          {
            ...registerDto,
            user_id: user.id,
          },
          {
            fields: [
              'organization_id',
              'employee_id',
              'depertment',
              'designation',
              'branch',
              'desk_info',
              'business_unit',
              'user_id',
            ],
          },
        );
      }

      if (registerDto.primary_contact === 'phone' && registerDto.phone) {
        this.smsService.sendSms(
          registerDto.phone,
          `Your OTP for Grade E-mart is ${totp.generate(user.referral_code)}`,
        );
      } else {
        // SEND EMAIL HERE
      }

      return {
        message: `An OTP sent to ${
          registerDto.primary_contact === 'phone'
            ? registerDto.phone
            : registerDto.email
        }. Please verify to continue.`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  // Store Session
  async storeSession(jwt: string, id: number, ip?: string) {
    // find geo location for ip address
    const geo = geoip.lookup(ip);
    await UserSession.create({
      jwt,
      user_id: id,
      address_details:
        Array.from(new Set([geo?.city, geo?.country]))?.join(', ') || null,
      device_details: null,
      user_agent: null,
      ip_address: ip,
      latitude: geo?.ll?.[0] || null,
      longitude: geo?.ll?.[1] || null,
      last_login: new Date(),
    });
  }

  // Login user
  async login(loginDto: LoginDto, ip: string) {
    if (
      (!loginDto.phone && !loginDto.email) ||
      (!!loginDto.phone && !!loginDto.email)
    )
      throw new BadRequestException('Please provide either phone or email.');

    if (!loginDto.password)
      throw new BadRequestException('Please provide password.');

    const user = await User.findOne({
      where: {
        ...(loginDto.email && {
          email: loginDto.email,
        }),
        ...(loginDto.phone && {
          phone: loginDto.phone,
        }),
      },
      paranoid: false,
    });

    // Search if user does exists
    if (!user)
      throw new NotFoundException(
        `No user found with the ${loginDto.email ? 'email' : 'phone number'}.`,
      );

    // If account is archived
    if (user.deleted_at)
      throw new UnauthorizedException(
        `Your account was archived on ${user.deleted_at.toDateString()}. Contact with administration.`,
      );

    // check if user is suspended
    if (!user.is_active)
      throw new UnauthorizedException(
        'Your account is temporarily suspended. Contact with administration.',
      );

    // if (
    //   (loginDto.email && !user.email_verified_at) ||
    //   (loginDto.phone && !user.phone_verified_at)
    // ) {
    //   // SEND OTP HERE
    //   throw new UnauthorizedException(
    //     `An OTP has sent to ${
    //       loginDto.email ? user.email : user.phone
    //     }. Please verify and sign in again.`,
    //   );
    // }

    if (
      !(await bcrypt.compare(loginDto.password, user.getDataValue('password')))
    )
      // Compare password
      throw new UnauthorizedException('Incorrect password! Please try again.');

    // Check total device the user is signed in
    // if (
    //   (await user.$count('sessions', {
    //     where: {
    //       logged_out_at: {
    //         [Op.eq]: null,
    //       },
    //     },
    //   })) >= user.getDataValue('max_session')
    // )
    //   throw new UnauthorizedException(
    //     'You have already reached the maximum logged in devices.',
    //   );

    // Create jwt token
    const jwt = await this.jwtService.signAsync(
      { sub: user.id, username: user.username },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE,
      },
    );

    // Store session and device
    await this.storeSession(jwt, user.id, ip);

    return {
      jwt,
      message: `Welcome ${user.first_name} ${user.last_name}!`,
    };
  }

  // Validate User and Get Information
  validate(user: any) {
    return {
      ...user.dataValues,
      kam_access: user?.dataValues?.organizations?.[0]?.Employeeship?.is_kam
        ? user?.dataValues?.organizations?.[0]
        : null,
    };
  }

  verify(verifyDto: VerifyDto) {
    console.log(verifyDto);
    return 'This action adds a new auth';
  }

  // Update user information
  async update(user_extract: any, updateAuthDto: UpdateAuthDto) {
    // Find user
    const user = await User.findByPk(user_extract.id);

    // Check if user exists
    if (!user)
      throw new UnauthorizedException(
        `Your account was archived. Contact with administration.`,
      );

    // Update info
    user.update(updateAuthDto);
    user.save();

    return {
      message: `Information updated successfully.`,
    };
  }

  async resetpass(user_extract: any, resetPassDto: ResetPassDto) {
    // Find user
    const user = await User.findByPk(user_extract.id);

    // Compare password
    if (
      !(await bcrypt.compare(
        resetPassDto.current_password,
        user.getDataValue('password'),
      ))
    )
      throw new UnauthorizedException('Incorrect password! Please try again.');

    user.password = resetPassDto.new_password;
    user.save();

    return {
      message: `Password updated successfully.`,
    };
  }

  // Signout
  async signout(jwt_token: string) {
    // find session
    const session = await UserSession.findOne({
      where: {
        jwt: jwt_token,
      },
    });

    // check if already logged out
    if (session?.logged_out_at !== null)
      throw new UnauthorizedException('This session is already signed out.');

    // logout session
    session.logged_out_at = new Date();
    session.save();

    return {
      message: `Logged out successfully.`,
    };
  }
}
