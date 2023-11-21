import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty()
  role_id: number;

  @ApiProperty()
  access_point_id: number;

  @ApiProperty({
    enum: ['create', 'read', 'update', 'delete'],
    default: 'read',
  })
  type: 'create' | 'read' | 'update' | 'delete';
}
