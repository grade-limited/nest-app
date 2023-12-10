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
  Unique,
  IsEmail,
  NotEmpty,
} from 'sequelize-typescript';

@Table({
  tableName: 'newsletter',
})
class Newsletter extends Model<Newsletter> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @Unique
  @IsEmail
  @NotEmpty({
    msg: "E-mail can't be empty",
  })
  @Column
  'email': string;

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
export default Newsletter;
