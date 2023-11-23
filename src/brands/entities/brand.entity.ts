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
} from 'sequelize-typescript';
import Product from 'src/products/entities/product.entity';
@Table({
  tableName: 'brand',
})
class Brand extends Model<Brand> {
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

  @AllowNull
  @Column
  'cover_url': string;

  @HasMany(() => Product)
  'products': Product[];

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

export default Brand;
