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
} from 'sequelize-typescript';

@Table({
  tableName: 'category',
})
class Category extends Model<Category> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @Column
  'name': string;

  @Column
  'description': string;

  @Column
  'thumbnail_url': string;

  @Column
  'cover_url': string;

  @Column
  'icon_url': string;

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
