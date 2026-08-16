import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@skene/design-system/ui/navigation-menu'

/**
 * Top navigation with dropdown panels. A bare link uses
 * `navigationMenuTriggerStyle` so it matches the height and weight of the
 * items that do open a panel — without it, the flat links sit a pixel off and
 * the row reads as two different components.
 */
const meta = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: {
    children: (
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[380px] gap-2 p-3">
              <li>
                <NavigationMenuLink href="#">How it works</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Features</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Integrations</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle}>
            Developers
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    ),
  },
}

/** The panel open, which is the state a closed screenshot never shows. */
export const Open: Story = { args: { ...Closed.args, value: 'product', defaultValue: 'product' } }

/** Links only — no panel anywhere in the row. */
export const LinksOnly: Story = {
  args: {
    children: (
      <NavigationMenuList>
        {['Product', 'Pricing', 'Developers', 'Community'].map((l) => (
          <NavigationMenuItem key={l}>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle}>
              {l}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    ),
  },
}
