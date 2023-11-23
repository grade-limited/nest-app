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
} from 'sequelize-typescript';
import Brand from 'src/brands/entities/brand.entity';
import Category from 'src/categories/entities/category.entity';

@Table({
  tableName: 'product',
})
class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @Column
  'name': string;

  @AllowNull
  @Column
  'description': string;

  @AllowNull
  @Column
  'thumbnail_url': string;

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

  @BelongsTo(() => Brand)
  'category': Category;

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
