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
  NotEmpty,
  IsEmail,
  IsIn,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import User from 'src/users/entities/user.entity';
import ProductOrderJunction from './product_order.entity';
import Product from 'src/products/entities/product.entity';

@Table({
  tableName: 'order',
})
class Order extends Model<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @NotEmpty({
    msg: "Name can't be empty",
  })
  @Column
  'recipient_name': string;

  @AllowNull(false)
  @NotEmpty({
    msg: "Contact can't be empty",
  })
  @Column
  'recipient_number': string;

  @AllowNull(true)
  @IsEmail
  @Column
  'recipient_email': string;

  @AllowNull(true)
  @Column
  'recipient_address': string;

  @AllowNull(false)
  @IsIn({
    args: [['Pending', 'Accepted', 'Processing', 'delivered', 'Declined']],
    msg: 'Not a selectabl status',
  })
  @Column(
    DataType.ENUM('Pending', 'Accepted', 'Processing', 'delivered', 'Declined'),
  )
  'status': string;

  @AllowNull(false)
  @Column
  'expected_delivery_date': Date;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.FLOAT)
  'delivery_fee': number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.FLOAT)
  'discount': number;

  @ForeignKey(() => User)
  @AllowNull
  @Column(DataType.BIGINT)
  'user_id': number;

  @BelongsTo(() => User)
  'user': User;

  @BelongsToMany(() => Product, () => ProductOrderJunction)
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
export default Order;