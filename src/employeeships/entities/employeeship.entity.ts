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
  BelongsTo,
  ForeignKey,
  AllowNull,
  Default,
} from 'sequelize-typescript';
import User from 'src/users/entities/user.entity';
import Organization from 'src/organizations/entities/organization.entity';

@Table({
  tableName: 'employeeship',
})
class Employeeship extends Model<Employeeship> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @Column
  'employee_id': string;

  @AllowNull(false)
  @Column
  'depertment': string;

  @AllowNull(false)
  @Column
  'designation': string;

  @AllowNull(false)
  @Column
  'branch': string;

  @AllowNull(true)
  @Column
  'desk_info': string;

  @AllowNull(true)
  @Column
  'business_unit': string;

  @CreatedAt
  @Column({ field: 'created_at' })
  'created_at': Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  'updated_at': Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  'deleted_at': Date;

  @ForeignKey(() => User)
  @AllowNull
  @Column(DataType.BIGINT)
  'user_id': number;

  @BelongsTo(() => User)
  'user': User;

  @ForeignKey(() => Organization)
  @AllowNull
  @Column(DataType.BIGINT)
  'organization_id': number;

  @BelongsTo(() => Organization)
  'organization': Organization;

  @Default('pending')
  @Column(DataType.ENUM('pending', 'confirmed', 'declined'))
  'employeeship_status': string;
}

export default Employeeship;
