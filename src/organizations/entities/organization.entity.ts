import { HttpStatus } from '@nestjs/common';
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  NotEmpty,
  IsIn,
  IsEmail,
  IsUrl,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'organization',
})
class Organization extends Model<Organization> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @NotEmpty({
    msg: "Name can't be empty",
  })
  @AllowNull(false)
  @Column
  'name': string;

  @AllowNull(false)
  @NotEmpty({
    msg: "Contact can't be empty",
  })
  @Column
  'contact_number': string;

  @AllowNull(false)
  @Unique
  @IsEmail
  @NotEmpty({
    msg: "E-mail can't be empty",
  })
  @Column
  'contact_email': string;

  @AllowNull(false)
  @IsIn({
    args: [['Retail Shop', 'Hotel/Restaurant', 'Corporate Company']],
    msg: 'Not a selectable business type',
  })
  @Column(DataType.ENUM('Retail Shop', 'Hotel/Restaurant', 'Corporate Company'))
  'business_type': string;

  @AllowNull(false)
  @Column
  'business_subtype': string;

  @AllowNull(true)
  @IsUrl
  @Column
  'website_url': string;

  @AllowNull(true)
  @IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isLinkedInUrl(value: string): void {
        const linkedInUrlRegex =
          /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/;

        if (!linkedInUrlRegex.test(value)) {
          throw new Error('Invalid LinkedIn Profile URL');
        }
      },
    },
  })
  'linkedin_url': string;

  @AllowNull
  //@IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isFacebookUrl(value: string): void {
        const facebookUrlRegex =
          /^(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/;
        if (!facebookUrlRegex.test(value)) {
          throw new Error('Invalid Facebook URL');
        }
      },
    },
  })
  'facebook_url': string;

  @AllowNull(true)
  @IsUrl
  @Column
  'instagram_url': string;

  @CreatedAt
  @Column({ field: 'created_at' })
  'created_at': Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  'updated_at': Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  'deleted_at': Date;
}
export default Organization;
