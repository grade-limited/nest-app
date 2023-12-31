import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  NotEmpty,
} from 'sequelize-typescript';
import Product from 'src/products/entities/product.entity';
// import Hierarchy from 'sequelize-hierarchy-nestjs';

@Table({
  tableName: 'category',
})
class Category extends Model<Category> {
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

  @Column(DataType.STRING(1000))
  'description': string;

  @Column
  'thumbnail_url': string;

  @Column
  'cover_url': string;

  @Column
  'icon_url': string;

  @Column
  'color_code': string;

  @HasMany(() => Product)
  'products': Product[];

  @ForeignKey(() => Category)
  @AllowNull
  @Column(DataType.BIGINT)
  'parent_id': number;

  @BelongsTo(() => Category)
  'parent': Category;

  @HasMany(() => Category, {
    foreignKey: 'parent_id',
    as: 'children',
  })
  'children': Category[];

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

export default Category;
