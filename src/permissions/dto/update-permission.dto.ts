import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty()
  role_id: number;

  @ApiProperty()
  access_point_id: number;

  @ApiProperty({
    enum: ['create', 'read', 'update', 'delete'],
  })
  type: 'create' | 'read' | 'update' | 'delete';
}
