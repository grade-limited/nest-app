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
  @Column
  'description': string;

  @AllowNull(true)
  @Column
  'thumbnail_url': string;

  @AllowNull
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    get: function () {
      return JSON.parse(this.getDataValue('attachments') || '[]');
    },
  })
  'attachments': string[];

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
