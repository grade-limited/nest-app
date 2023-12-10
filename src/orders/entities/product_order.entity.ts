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
import Order from './order.entity';

@Table({
  tableName: 'product_order_junction',
})
class ProductOrderJunction extends Model<ProductOrderJunction> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'product_id': number;

  @ForeignKey(() => Order)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'order_id': number;

  @AllowNull(false)
  @Column
  'quantity': number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  'unit_price': number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  'total_price': number;

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

export default ProductOrderJunction;
