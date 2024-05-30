import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { UserRole } from './user_role.entity';
import { MenuItem } from '../../user/entities/menu-item.entity';

@Entity('user_role_menu_item')
export class UserRoleMenuItem extends BaseEntity {
  // relate the two relations

  @ManyToOne(() => UserRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_role_id' })
  userRole: UserRole;

  @RelationId(
    (userRoleMenuItem: UserRoleMenuItem) => userRoleMenuItem.userRole,
    'user_role_id',
  )
  userRoleId: number;

  @ManyToOne(() => MenuItem, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @RelationId(
    (userRoleMenuItem: UserRoleMenuItem) => userRoleMenuItem.menuItem,
    'menu_item_id',
  )
  menuItemId: number;
}
