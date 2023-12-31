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
  Default,
  IsIn,
  IsEmail,
  Unique,
  IsUrl,
  Is,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import Organization from 'src/organizations/entities/organization.entity';
import Employee from 'src/employees/entities/employee.entity';
@Table({
  tableName: 'request',
})
class Request extends Model<Request> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @NotEmpty({
    msg: "Name can't be empty",
  })
  @Column
  'organization_name': string;

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

  @AllowNull(false)
  @IsIn({
    args: [['API', 'Website', 'Android', 'iOS', 'Admin']],
    msg: 'Please choose valid device',
  })
  @Column(DataType.ENUM('API', 'Website', 'Android', 'iOS', 'Admin'))
  'registered_from': string;

  @Is([/01\d{9}$/])
  @AllowNull(false)
  @Unique
  @NotEmpty({
    msg: "Contact can't be empty",
  })
  @Column
  'contact_number': string;

  @AllowNull(true)
  @IsEmail
  @Unique
  @NotEmpty({
    msg: "E-mail can't be empty",
  })
  @Column
  'contact_email': string;

  @AllowNull(false)
  @Column
  'contact_address': string;

  @AllowNull(true)
  @IsUrl
  @Column
  'website_url': string;

  @AllowNull(true)
  @IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isLinkedInUrl(value: string): void {
        if (value === null || value === undefined || value === '') return;
        const linkedInUrlRegex =
          /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/;

        if (!linkedInUrlRegex.test(value)) {
          throw new Error('Invalid LinkedIn Profile URL');
        }
      },
    },
  })
  'linkedin_url': string;

  @AllowNull(true)
  @IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isFacebookUrl(value: string): void {
        if (value === null || value === undefined || value === '') return;
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

  @AllowNull(false)
  @Column
  'contact_person_name': string;

  @Is([/01\d{9}$/])
  @AllowNull(false)
  @Column
  'contact_person_phone': string;

  @AllowNull(true)
  @Column
  'contact_person_address': string;

  @AllowNull(true)
  @Column
  'contact_person_employee_id': string;

  @AllowNull(false)
  @Column
  'contact_person_dept': string;

  @AllowNull(false)
  @Column
  'contact_person_designation': string;

  @AllowNull(false)
  @Column
  'contact_person_branch': string;

  @AllowNull(true)
  @Column
  'contact_person_desk_information': string;

  @AllowNull(true)
  @Column
  'contact_person_business_unit': string;

  @AllowNull(true)
  @Default('pending')
  @IsIn({
    args: [['pending', 'approved', 'in progress', 'declined']],
    msg: 'Please choose valid request status',
  })
  @Column(DataType.ENUM('pending', 'approved', 'in progress', 'declined'))
  'request_status': string;

  //relations
  @ForeignKey(() => Organization)
  @AllowNull
  @Column(DataType.BIGINT)
  'organization_id': number;

  @BelongsTo(() => Organization)
  'organization': Organization;

  @ForeignKey(() => Employee)
  @AllowNull
  @Column(DataType.BIGINT)
  'employee_id': number;

  @BelongsTo(() => Employee)
  'employee': Employee;

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
export default Request;
