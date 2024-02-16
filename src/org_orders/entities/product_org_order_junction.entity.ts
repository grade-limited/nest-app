import {
  AfterCreate,
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
import OrgOrder from 'src/org_orders/entities/org_order.entity';

@Table({
  tableName: 'product_org_order_junction',
})
class ProductOrgOrderJunction extends Model<ProductOrgOrderJunction> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'product_id': number;

  @ForeignKey(() => OrgOrder)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'orgorder_id': number;

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

  @AfterCreate
  static async addSoldProduct(instance: ProductOrgOrderJunction) {
    const product = await Product.findByPk(instance.product_id);
    await product.update(
      {
        sold: product.sold + instance.quantity,
      },
      {
        fields: ['sold'],
      },
    );
  }
}

export default ProductOrgOrderJunction;
