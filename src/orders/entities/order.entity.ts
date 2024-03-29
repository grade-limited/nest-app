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
  AfterCreate,
} from 'sequelize-typescript';
import User from 'src/users/entities/user.entity';
import ProductOrderJunction from './product_order.entity';
import Product from 'src/products/entities/product.entity';
import sendEmail from 'src/utils/email/send';

@Table({
  tableName: 'order',
})
class Order extends Model<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(true)
  @Column
  'invoice_prefix': string;

  @AllowNull(true)
  @Column
  'invoice_id': string;

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

  @Default('Pending')
  @AllowNull(false)
  @IsIn({
    args: [['Pending', 'Accepted', 'Processing', 'delivered', 'Declined']],
    msg: 'Not a selectable status',
  })
  @Column(
    DataType.ENUM('Pending', 'Accepted', 'Processing', 'delivered', 'Declined'),
  )
  'status': string;

  @AllowNull(false)
  @IsIn({
    args: [['API', 'Website', 'Android', 'iOS', 'Admin']],
    msg: 'Please choose valid device',
  })
  @Column(DataType.ENUM('API', 'Website', 'Android', 'iOS', 'Admin'))
  'registered_from': string;

  @AllowNull(true)
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

  @AfterCreate
  static async createinvoiceid(instance: Order) {
    instance.invoice_id = `${instance.invoice_prefix}-${String(
      instance.id,
    ).padStart(5, '0')}`;
    instance.save();
  }

  @AfterCreate
  static async sendEmailOnOrder(instance: Order) {
    // Send email
    await sendEmail({
      to_name:
        (await instance.$get('user')).dataValues.first_name ||
        instance.recipient_name,
      message: `Your order has been placed. Your invoice id is ${instance.invoice_id}`,
      from_name: 'Team Grade Employee Mart',
      reply_to: 'sales@gradebd.com',
      to_email:
        (await instance.$get('user')).dataValues.email ||
        instance.recipient_email,
    });
  }
}
export default Order;
