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
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import Bookmark from 'src/bookmarks/entities/bookmark.entity';
import Brand from 'src/brands/entities/brand.entity';
import Campaign from 'src/campaigns/entities/campaign.entity';
import ProductCampaignJunction from 'src/campaigns/entities/product_campaigns.entity';
import Cart from 'src/carts/entities/cart.entity';
import Category from 'src/categories/entities/category.entity';
import Order from 'src/orders/entities/order.entity';
import ProductOrderJunction from 'src/orders/entities/product_order.entity';
import Quotation from 'src/quotations/entities/quotation.entity';
import ProductQuotationJunction from '../../quotations/entities/product_quotation.entity';

@Table({
  tableName: 'product',
})
class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @NotEmpty({
    msg: "Name can't be empty",
  })
  @Column
  'name': string;

  @AllowNull(true)
  @Column(DataType.STRING(1000))
  'description': string;

  @AllowNull(true)
  @Column
  'thumbnail_url': string;

  @AllowNull
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    get: function () {
      return JSON.parse(this.getDataValue('price') || '[]');
    },
  })
  'price': string;

  @AllowNull
  @Column
  'sku': string;

  @AllowNull
  @Column
  'unit_of_measure': string;

  @AllowNull
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    get: function () {
      return JSON.parse(this.getDataValue('price') || '[]');
    },
  })
  'minimum_order_quantity': string;

  @AllowNull
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    get: function () {
      return JSON.parse(this.getDataValue('attachments') || '[]');
    },
  })
  'attachments': string;

  @ForeignKey(() => Brand)
  @AllowNull
  @Column(DataType.BIGINT)
  'brand_id': number;

  @BelongsTo(() => Brand)
  'brand': Brand;

  @ForeignKey(() => Category)
  @AllowNull
  @Column(DataType.BIGINT)
  'category_id': number;

  @BelongsTo(() => Category)
  'category': Category;

  @BelongsToMany(() => Campaign, () => ProductCampaignJunction)
  'campaigns': Campaign[];

  @BelongsToMany(() => Order, () => ProductOrderJunction)
  'orders': Order[];

  @BelongsToMany(() => Quotation, () => ProductQuotationJunction)
  'quotations': Quotation[];

  @HasMany(() => Cart)
  'carts': Cart[];

  @HasMany(() => Bookmark)
  'bookmarks': Bookmark[];

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
export default Product;
