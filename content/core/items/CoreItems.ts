import { Item, ItemFilter, ItemProperty, ItemState } from '@items'

class Material {
  name: string;
  hardness: number;

  setName(name: string) {
    this.name = name;
    return this;
  }

  setHardness(n: number) {
    this.hardness = n;
  }
}

// #region properties!
export const ROCK = new ItemProperty('core:rock')
export const MATERIAL = new ItemProperty('core:material')
export const ROCK_SIZE = new ItemProperty('core:rock-size')
export const SEDIMENTARY = new ItemProperty('core:sedimentary')
export const IGNEOUS = new ItemProperty('core:igneous')
export const METAMORPHIC = new ItemProperty('core:metamorphic')
// #endregion

// #region tree-y stuff
export const LOG = new Item()
  .setName("Log")
  .setId('core:resources/log')

export const STICK = new Item()
  .setName("Stick")
  .setId('core:resources/stick')

export const PLANT_FIBRES = new Item()
  .setName("Plant Fibres")
  .setId('core:plant-fibres')
// #endregion

// #region normal ass rocks
export const FLINT_NORMAL = new Item()
  .setName("Flint")
  .setId('core:flint')
  .setProperty(MATERIAL, new Material()
    .setName('Flint')
    .setHardness(7)
  )
  .setProperty(ROCK, true)
  .setProperty(IGNEOUS, true)

export const SANDSTONE_NORMAL = new Item()
  .setName("Sandstone")
  .setId('core:sandstone')

export const SANDSTONE_PEBBLE = new Item()
  .setName("Sandstone Pebble")
  .setId('core:sandstone-pebble')

export const SLATE_NORMAL = new Item()
  .setName("Slate")
  .setId('core:slate')

export const LIMESTONE_NORMAL = new Item()
  .setName("Limestone")
  .setId('core:limestone')

export const LIMESTONE_PEBBLE = new Item()
  .setName("Limestone Pebble")
  .setId('core:limestone-pebble')

export const SHALE_NORMAL = new Item()
  .setName("Shale")
  .setId('core:shale')

export const SHALE_PEBBLE = new Item()
  .setName("Shale Pebble")
  .setId('core:shale-pebble')

export const OBSIDIAN_NORMAL = new Item()
  .setName("Obsidian")
  .setId('core:obsidian')

// #endregion

// #region tools n shit

export const FLINT_HATCHET = new Item()
  .setName("Flint Hatchet")
  .setId('core:flint-hatchet')

export const ARROWHEAD = new Item<{
  baseMaterial: ItemState<any>
}>()
  .setName("Flint Arrowhead")
  .setId('core:flint-arrowhead')

export const FLINT_SPEAR = new Item()
  .setName("Flint Spear")
  .setId('core:flint-spear')

export const SLATE_HATCHET = new Item()
  .setName("Slate Hatchet")
  .setId('core:slate-hatchet')

export const SLATE_ARROWHEAD = new Item()
  .setName("Slate Arrowhead")
  .setId('core:slate-arrowhead')

export const SLATE_SPEAR = new Item()
  .setName("Slate Spear")
  .setId('core:slate-spear')

export const OBSIDIAN_HATCHET = new Item()
  .setName("Obsidian Hatchet")
  .setId('core:obsidian-hatchet')

export const OBSIDIAN_ARROWHEAD = new Item()
  .setName("Obsidian Arrowhead")
  .setId('core:obsidian-arrowhead')

export const OBSIDIAN_SPEAR = new Item()
  .setName("Obsidian Spear")
  .setId('core:obsidian-spear')

// #endregion

export function FILTER_CRAFTABLE_ROCK(itemState: ItemState<any>) {
  if(!itemState.item.getProperty(MATERIAL)) return false;
  const mat: Material = itemState.item.getProperty(MATERIAL) as Material;
  return itemState.item.getProperty(ROCK)
    && mat.hardness >= 6
    && mat.hardness < 10
}

// tools: plant fibres = rope, flint hatchet
// shale - igneous. metamorphasis => slate