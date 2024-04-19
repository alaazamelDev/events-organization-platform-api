import { BaseEntity } from '../../../common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { UserRoleMenuItem } from '../../userRole/entities/user-role-menu-item.entity';

@Entity('menu_items')
export class MenuItem extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'url',
    type: 'varchar',
    nullable: false,
  })
  url: string;

  @Column({
    name: 'icon',
    type: 'varchar',
    nullable: true,
  })
  icon?: string;

  // Parent MenuItem (null for root items)
  @ManyToOne(() => MenuItem, { nullable: true })
  @JoinColumn({ name: 'parent_item_id' })
  parentItem?: MenuItem;

  @RelationId((menuItem: MenuItem) => menuItem.parentItem, 'parent_item_id')
  parentItemId?: number;

  // SubMenu Items (it can be empty)
  @OneToMany(() => MenuItem, (item: MenuItem) => item.parentItem, {
    eager: true,
  })
  subMenuItems: MenuItem[];

  @OneToMany(() => UserRoleMenuItem, (item) => item.menuItem)
  userRoleMenuItems: UserRoleMenuItem[];
}
