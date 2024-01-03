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
  BelongsToMany,
  IsUrl,
} from 'sequelize-typescript';
import Product from 'src/products/entities/product.entity';
import ProductCampaignJunction from './product_campaigns.entity';

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
  @Column(DataType.STRING(1000))
  'description': string;

  @AllowNull(true)
  @Column
  'cover_url': string;

  @AllowNull(true)
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

  @Default(0)
  @Column(DataType.FLOAT)
  'amount': number;

  @AllowNull(true)
  @IsIn({
    args: [['amount', 'percentage']],
    msg: 'Must be amount or percentage',
  })
  @Column(DataType.ENUM('amount', 'percentage'))
  'amount_type': string;

  @AllowNull(true)
  @Column
  'campaign_type': string;

  @BelongsToMany(() => Product, () => ProductCampaignJunction)
  'products': Product[];

  @AllowNull(true)
  @IsUrl
  @Column
  'campaign_url': string;

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
