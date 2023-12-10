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
  BelongsTo,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';

import User from 'src/users/entities/user.entity';
import Product from 'src/products/entities/product.entity';

@Table({
  tableName: 'bookmark',
})
class Bookmark extends Model<Bookmark> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  //relations

  @ForeignKey(() => User)
  @AllowNull
  @Column(DataType.BIGINT)
  'user_id': number;

  @BelongsTo(() => User)
  'user': User;

  @ForeignKey(() => Product)
  @AllowNull
  @Column(DataType.BIGINT)
  'product_id': number;

  @BelongsTo(() => Product)
  'product': Product;

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
export default Bookmark;
