// types/mesh.ts - Типы для москитных сеток

/** ID цвета рамки */
export type ColorId = 1 | 2 | 3 | 4

/** Тип сетки */
export type MeshType = 'standart' | 'antimoshka' | 'antikoshka' | 'ultravyu' | 'antipyl'

/** Тип рамки */
export type FrameType = 'standart' | 'vstavnaya'

/** Тип ручек */
export type HandleType = 'pvc' | 'metal'

/** Цвет рамки с названием */
export interface MeshColor {
  id: ColorId
  name: string
  hex?: string
}

/** Доступные цвета рамки */
export const MESH_COLORS: MeshColor[] = [
  { id: 1, name: 'БЕЛАЯ', hex: '#FFFFFF' },
  { id: 2, name: 'КОРИЧНЕВАЯ', hex: '#8B4513' },
  { id: 3, name: 'АНТРАЦИТ', hex: '#36454F' },
  { id: 4, name: 'RAL', hex: undefined }
]

/** Доступные типы сеток */
export const MESH_TYPES: { id: MeshType; name: string }[] = [
  { id: 'standart', name: 'СТАНДАРТ' },
  { id: 'antimoshka', name: 'АНТИМОШКА' },
  { id: 'antikoshka', name: 'АНТИКОШКА' },
  { id: 'ultravyu', name: 'УЛЬТРАВЬЮ' },
  { id: 'antipyl', name: 'АНТИПЫЛЬ' }
]

/** Доступные типы рамки */
export const FRAME_TYPES: { id: FrameType; name: string }[] = [
  { id: 'standart', name: 'РАМОЧНАЯ' },
  { id: 'vstavnaya', name: 'ВСТАВНАЯ VSN' }
]

/** Названия типов сеток */
export const MESH_TYPE_NAMES: Record<MeshType, string> = {
  standart: 'СТАНДАРТ',
  antimoshka: 'АНТИМОШКА',
  antikoshka: 'АНТИКОШКА',
  ultravyu: 'УЛЬТРАВЬЮ',
  antipyl: 'АНТИПЫЛЬ'
}

/** Названия цветов */
export const COLOR_NAMES: Record<ColorId, string> = {
  1: 'БЕЛАЯ',
  2: 'КОРИЧНЕВАЯ',
  3: 'АНТРАЦИТ',
  4: 'RAL'
}

/** Названия типов рамки */
export const FRAME_TYPE_NAMES: Record<FrameType, string> = {
  standart: 'РАМОЧНАЯ',
  vstavnaya: 'ВСТАВНАЯ VSN'
}
