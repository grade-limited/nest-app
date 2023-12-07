import { nanoid } from 'nanoid';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
  IsEmail,
  Default,
  BeforeUpdate,
  BeforeCreate,
  Unique,
  HasMany,
  ForeignKey,
  BelongsTo,
  NotEmpty,
  IsIn,
  Is,
} from 'sequelize-typescript';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import Session from 'src/users-sessions/entities/user-session.entity';

@Table({
  tableName: 'user',
})
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @NotEmpty({
    msg: 'First Name is required',
  })
  @Column
  'first_name': string;

  @AllowNull(false)
  @NotEmpty({
    msg: 'Last Name is required',
  })
  @Column
  'last_name': string;

  @Unique
  @Column
  'username': string;

  @AllowNull(false)
  @NotEmpty({
    msg: 'Password is required',
  })
  @Column
  'password': string;

  @IsIn({
    args: [['Male', 'Female', 'Non Binary']],
    msg: 'Must be Male, Female or Non Binary',
  })
  @Column(DataType.ENUM('Male', 'Female', 'Non Binary'))
  'gender': string;

  @AllowNull
  @Column
  'display_picture': string;

  @Unique
  @AllowNull(true)
  // @Is([/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/])
  @Column
  'email': string;

  @Unique
  @AllowNull(true)
  @Is([/01\d{9}$/])
  @Column
  'phone': string;

  @AllowNull
  @Column
  'dob': Date;

  @AllowNull
  @Column
  'address': string;

  @Unique
  @Column
  'referral_code': string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.BIGINT)
  'referred_by_id': number;

  @BelongsTo(() => User)
  'referred_by': User;

  @HasMany(() => User, {
    foreignKey: 'referred_by_id',
    as: 'referred_to',
  })
  'referred_to': User[];

  @Default(10)
  @Column
  'max_session': number;

  @Default(true)
  @Column
  'is_active': boolean;

  @AllowNull
  @Column
  'phone_verified_at': Date;

  @AllowNull
  @Column
  'email_verified_at': Date;

  @AllowNull(false)
  @IsIn({
    args: [['API', 'Website', 'Android', 'iOS']],
    msg: 'Please choose valid device',
  })
  @Column(DataType.ENUM('API', 'Website', 'Android', 'iOS'))
  'registered_from': string;

  @HasMany(() => Session)
  'sessions': Session[];

  @CreatedAt
  @Column({ field: 'created_at' })
  'created_at': Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  'updated_at': Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  'deleted_at': Date;

  //hooks
  @BeforeUpdate
  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(instance.password, salt);
      instance.password = hashedPassword;
    }
  }

  @BeforeCreate
  static async createReferralCode(instance: User) {
    // Create Referral Code
    let ref = nanoid(6).toUpperCase();

    while (
      await this.findOne({
        where: {
          referral_code: ref,
        },
        paranoid: false,
      })
    )
      ref = nanoid(6).toUpperCase();

    instance.referral_code = ref;
  }

  @BeforeCreate
  static async createUsername(instance: User) {
    // Create Username
    let usename = `${instance.last_name
      .toLowerCase()
      .replace(/\s/g, '')}_${nanoid(2)}`;

    while (
      await this.findOne({ where: { username: usename }, paranoid: false })
    )
      usename = `${instance.last_name
        .toLowerCase()
        .replace(/\s/g, '')}_${nanoid(2)}`;

    instance.username = usename;
  }

  @BeforeCreate
  @BeforeUpdate
  static async phoneAndEmailValidation(instance: User) {
    if (instance.changed('phone')) {
      if (instance.phone === '') instance.phone = null;
      instance.phone_verified_at = null;
    }
    if (instance.changed('email')) {
      if (instance.email === '') instance.email = null;
      instance.email_verified_at = null;
    }
  }
}

export default User;
