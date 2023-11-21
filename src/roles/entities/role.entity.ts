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
  Default,
  HasMany,
} from 'sequelize-typescript';
import Employee from 'src/employees/entities/employee.entity';
import Permission from 'src/permissions/entities/permission.entity';

@Table({
  tableName: 'role',
})
class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @Column
  'name': string;

  @AllowNull(false)
  @Column
  'prefix': string;

  @AllowNull
  @Column
  'description': string;

  @Default(true)
  @Column
  'is_active': boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  'created_at': Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  'updated_at': Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  'deleted_at': Date;

  // Relations
  @HasMany(() => Employee)
  'assigned_employees': Employee[];

  @HasMany(() => Permission)
  'assigned_permissions': Permission[];
}

export default Role;
