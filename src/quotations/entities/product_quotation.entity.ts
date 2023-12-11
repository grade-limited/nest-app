import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Product from 'src/products/entities/product.entity';
import Quotation from 'src/quotations/entities/quotation.entity';

@Table({
  tableName: 'product_quotations_junction',
})
class ProductQuotationJunction extends Model<ProductQuotationJunction> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'product_id': number;

  @ForeignKey(() => Quotation)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'quotation_id': number;

  @AllowNull
  @Column
  'quantity': number;

  @Default(true)
  @Column
  'is_customized': boolean;

  @AllowNull
  @Column
  'requirments': string;

  @AllowNull
  @Column({
    type: DataType.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('attachments') || '[]');
    },
  })
  'attachments': string;

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

export default ProductQuotationJunction;
