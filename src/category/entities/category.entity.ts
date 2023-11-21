import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Question from 'src/questions/entities/question.entity';

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

  @AllowNull
  @Column
  'description': string;

  @ForeignKey(() => Category)
  @AllowNull(true)
  @Column(DataType.BIGINT)
  'parent_id': number;

  @BelongsTo(() => Category)
  'parent': Category;

  @HasMany(() => Category, {
    foreignKey: 'parent_id',
    as: 'children',
  })
  'children': Category[];

  @HasMany(() => Question)
  'questions': Question[];

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
