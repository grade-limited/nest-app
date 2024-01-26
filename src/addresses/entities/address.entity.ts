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
  HasMany,
  NotEmpty,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import User from 'src/users/entities/user.entity';
@Table({
  tableName: 'address',
})
class Address extends Model<Address> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @NotEmpty({
    msg: "Description can't be empty",
  })
  @Column(DataType.STRING(1000))
  'description': string;

  @AllowNull(true)
  @Column
  'label': string;

  @ForeignKey(() => User)
  @AllowNull
  @Column(DataType.BIGINT)
  'user_id': number;

  @BelongsTo(() => User)
  'user': User;

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

export default Address;
