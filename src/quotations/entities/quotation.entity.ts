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
  BelongsToMany,
  Default,
} from 'sequelize-typescript';
import Product from 'src/products/entities/product.entity';
import ProductQuotationJunction from 'src/quotations/entities/product_quotation.entity';
import User from 'src/users/entities/user.entity';

@Table({
  tableName: 'quotation',
})
class Quotation extends Model<Quotation> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @NotEmpty({
    msg: "Name can't be empty",
  })
  @AllowNull(false)
  @Column
  'contact_name': string;

  @AllowNull(false)
  @NotEmpty({
    msg: "Contact can't be empty",
  })
  @Column
  'contact_number': string;

  @AllowNull(true)
  @IsEmail
  @Column
  'contact_email': string;

  @AllowNull(true)
  @Column
  'contact_designation': string;

  @Default('Pending')
  @AllowNull(false)
  @IsIn({
    args: [['Pending', 'Accepted', 'Processing', 'Completed', 'Declined']],
    msg: 'Not a selectabl status',
  })
  @Column(
    DataType.ENUM('Pending', 'Accepted', 'Processing', 'Completed', 'Declined'),
  )
  'status': string;

  @ForeignKey(() => User)
  @AllowNull
  @Column(DataType.BIGINT)
  'user_id': number;

  @BelongsTo(() => User)
  'user': User;

  @BelongsToMany(() => Product, () => ProductQuotationJunction)
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

export default Quotation;
