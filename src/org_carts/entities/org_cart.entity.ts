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
  Length,
} from 'sequelize-typescript';

import User from 'src/users/entities/user.entity';
import Product from 'src/products/entities/product.entity';
import Organization from 'src/organizations/entities/organization.entity';

@Table({
  tableName: 'orgcart',
})
class OrgCart extends Model<OrgCart> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @Length({ min: 1 })
  @Column(DataType.INTEGER)
  'quantity': number;

  relations;

  @ForeignKey(() => User)
  @AllowNull
  @Column(DataType.BIGINT)
  'user_id': number;

  @BelongsTo(() => User)
  'user': User;

  @ForeignKey(() => Organization)
  @AllowNull
  @Column(DataType.BIGINT)
  'organization_id': number;

  @BelongsTo(() => Organization)
  'organization': Organization;

  @ForeignKey(() => Product)
  @AllowNull(false)
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

export default OrgCart;
