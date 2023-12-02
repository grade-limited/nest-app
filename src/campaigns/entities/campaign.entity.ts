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
  ForeignKey,
  BelongsTo,
  NotEmpty,
  Default,
  IsIn,
  IsUrl,
} from 'sequelize-typescript';

@Table({
  tableName: 'campaign',
})
class Campaign extends Model<Campaign> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @NotEmpty({
    msg: "name can't be empty",
  })
  @Column
  'name': string;

  @AllowNull(true)
  @Column
  'description': string;

  @AllowNull(true)
  @IsUrl
  @Column
  'cover_url': string;

  @AllowNull(true)
  @IsUrl
  @Column
  'thumbnail_url': string;

  @AllowNull(true)
  @Default(true)
  @Column
  'is_active': boolean;

  @AllowNull(true)
  @Default(null)
  @Column
  'publish_date': Date;

  @AllowNull(true)
  @Default(null)
  @Column
  'start_date': Date;

  @AllowNull(true)
  @Default(null)
  @Column
  'end_date': Date;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  'amount': number;

  @AllowNull(false)
  @IsIn({
    args: [['amount', 'percentage']],
    msg: 'Must be amount or percentage',
  })
  @Column(DataType.ENUM('amount', 'percentage'))
  'amount_type': string;

  @AllowNull(true)
  @Column
  'campaign_type': string;

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

export default Campaign;
