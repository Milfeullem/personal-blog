import { House, PlaneTakeoff } from 'lucide-react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../../shadcn/ui/navigation-menu';
import { cn } from '../../shadcn/utils';
import $styles from './nav.module.css';

const items = [
  {
    title: '首页',
    href: '/',
    icon: House,
  },
  {
    title: '博客',
    href: '/blog',
    icon: PlaneTakeoff,
  },
];

export default function HeaderNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => {
          return (
            <NavigationMenuItem key={item.href} className={cn($styles['menu-item'])}>
              <NavigationMenuLink href={item.href} className={cn(navigationMenuTriggerStyle())}>
                {item.icon && <item.icon className="mr-1" />}
                <span>{item.title}</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function MobileNav() {
  return (
    <div className={$styles.mobileNav}>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.href} className={$styles['mobile-menu-item']}>
            {item.icon && <item.icon className="tw:mr-2" />}
            <Link href={item.href}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
