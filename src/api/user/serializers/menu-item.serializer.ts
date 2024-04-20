import { MenuItem } from '../entities/menu-item.entity';

export class MenuItemSerializer {
  static serialize(data?: MenuItem) {
    if (!data) return undefined;
    return {
      id: data.id,
      name: data.name,
      url: data.url,
      icon: data.icon,
      sub_menu: this.serializeList(data.subMenuItems),
    };
  }

  static serializeList(data?: MenuItem[]): any | undefined {
    if (!data || data.length == 0) return undefined;
    return data.map((item) => this.serialize(item));
  }
}
