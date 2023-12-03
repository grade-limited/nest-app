import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Product from 'src/products/entities/product.entity';
import Campaign from './campaign.entity';

@Table({
  tableName: 'product_campaigns_junction',
})
class ProductCampaignJunction extends Model<ProductCampaignJunction> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'product_id': number;

  @ForeignKey(() => Campaign)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'campaign_id': number;

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

export default ProductCampaignJunction;
