# Компоненты проекта

Подробное описание всех компонентов, виджетов и их использования.

## 📐 Архитектура компонентов

Проект следует архитектуре Feature-Sliced Design (FSD) с разделением на слои:

- **`shared/ui/`** - Переиспользуемые UI компоненты
- **`widgets/`** - Составные виджеты (Header, Footer, Preloader)
- **`entities/`** - Бизнес-сущности с UI
- **`features/`** - Функциональные возможности
- **`_pages/`** - Страницы с полной бизнес-логикой

## 🎨 Shared UI компоненты

Базовые переиспользуемые компоненты находятся в `src/shared/ui/`.

### Animate

**Путь**: `@shared/ui/animate/`

**Назначение**: Компоненты для анимаций элементов

**Компоненты**:
- `Animate` - Базовый компонент анимации с GSAP
- `AnimateInView` - Анимация при появлении в viewport
- `SplitTextAnimate` - Анимация текста с разбивкой на слова/символы
- `SplitTextAnimateInView` - Анимация текста при появлении в viewport
- `SplitText` - Компонент разбивки текста на слова/символы

**Использование**:
```tsx
import { Animate, AnimateInView } from "@shared/ui/animate";
import { SplitTextAnimate, SplitTextAnimateInView } from "@shared/ui/animate/split-text";
import { SplitText } from "@shared/ui/split-text";

// Простая анимация
<Animate isVisible={true} data="fadeIn">
  <div>Контент</div>
</Animate>

// Анимация при появлении в viewport
<AnimateInView data="fadeInUp">
  <div>Контент</div>
</AnimateInView>

// Анимированный текст
<SplitTextAnimate isVisible={true} type="char">
  Анимированный текст
</SplitTextAnimate>

// Анимированный текст при появлении
<SplitTextAnimateInView type="word" stagger={0.02}>
  Анимированный текст
</SplitTextAnimateInView>

// Просто разбивка текста без анимации
<SplitText type="char">Текст</SplitText>
```

**Пропсы Animate**:
- `isVisible` - Видимость элемента (true/false)
- `data` - Данные анимации (объект или пресет: "fadeIn", "fadeInUp", etc.)
- `delay` - Задержка анимации
- `duration` - Длительность анимации
- `onComplete` - Callback при завершении
- `onStart` - Callback при старте
- `animateOnMount` - Анимировать при монтировании

**Пропсы SplitTextAnimate**:
- `isVisible` - Видимость элемента
- `type` - Тип разбивки: "char" | "word"
- `stagger` - Задержка между элементами
- `duration` - Длительность анимации
- `delay` - Задержка анимации
- `as` - HTML тег для обертки
```

### Button

**Путь**: `@shared/ui/button/`

**Назначение**: Кнопка с различными вариантами стилизации

**Особенности**:
- Различные размеры и варианты
- Поддержка состояний (loading, disabled)
- TypeScript типизация

### Checkbox & Radio

**Путь**: `@shared/ui/checkbox/`, `@shared/ui/radio/`

**Назначение**: Элементы формы для выбора

**Особенности**:
- Кастомная стилизация
- Accessibility поддержка
- Интеграция с формами

### Container

**Путь**: `@shared/ui/container/`

**Назначение**: Контейнер для ограничения ширины контента

**Особенности**:
- Responsive ширина
- Центрирование контента
- Настраиваемые отступы

### Icon

**Путь**: `@shared/ui/icon/`

**Назначение**: Компонент для отображения SVG иконок

**Особенности**:
- Импорт SVG как React компонентов
- Поддержка различных размеров
- Кастомизация через пропсы

**Использование**:
```tsx
import Icon from "@shared/ui/icon";
import ArrowIcon from "public/icons/arrow-right.svg";

<Icon component={ArrowIcon} size={24} />
```

### Image

**Путь**: `@shared/ui/image/`

**Назначение**: Оптимизированный компонент изображения

**Особенности**:
- Интеграция с Next.js Image
- Ленивая загрузка
- Оптимизация изображений
- Поддержка разных форматов

### Input

**Путь**: `@shared/ui/input/`

**Назначение**: Поле ввода с валидацией

**Особенности**:
- Различные типы (text, email, password, etc.)
- Валидация через Zod
- Состояния ошибок

### Link

**Путь**: `@shared/ui/link/`

**Назначение**: Компонент ссылки с интеграцией Next.js Router

**Особенности**:
- Client-side навигация
- Поддержка внешних ссылок
- Активные состояния

### Logo

**Путь**: `@shared/ui/logo/`

**Назначение**: Логотип приложения

**Особенности**:
- Различные варианты (light/dark)
- Responsive размеры
- Ссылка на главную страницу

### Portal

**Путь**: `@shared/ui/portal/`

**Назначение**: Portal для рендеринга вне DOM дерева

**Особенности**:
- Модальные окна
- Dropdown меню
- Tooltips

**Использование**:
```tsx
import { Portal } from "@shared/ui/portal";

<Portal>
  <Modal>Контент модального окна</Modal>
</Portal>
```

### Scroll

**Путь**: `@shared/ui/scroll/`

**Назначение**: Обертка для плавного скролла (Lenis)

**Особенности**:
- Плавная прокрутка
- Контроль скорости
- События скролла

**Использование**:
```tsx
import { Scroll } from "@shared/ui/scroll";

<Scroll root wrapper>
  <App />
</Scroll>
```

### Typography

**Путь**: `@shared/ui/typography/`

**Назначение**: Типографические компоненты

**Компоненты**:
- `Heading` - Заголовки (h1-h6)
- `Body` - Текстовые блоки
- `Typography` - Базовый компонент

**Особенности**:
- Семантическая разметка
- Responsive размеры
- Варианты стилизации

### Video

**Путь**: `@shared/ui/video/`

**Назначение**: Компонент для видео контента

**Особенности**:
- Поддержка различных источников
- Контроль воспроизведения
- Оптимизация загрузки

### GSAP

**Путь**: `@shared/ui/gsap/`

**Назначение**: Обертка для GSAP анимаций

**Компоненты**:
- `Gsap` - Провайдер GSAP контекста и плагинов
- `Modules` - Регистрация GSAP плагинов и интеграция с Lenis

**Особенности**:
- Автоматическая регистрация GSAP плагинов (ScrollTrigger, Observer, CustomEase, ScrollToPlugin)
- Интеграция с Lenis для плавного скролла
- Автоматическое обновление ScrollTrigger при изменении размера
- Глобальный доступ к Lenis через `window.__GLOBAL_SCROLL__`

**Использование**:
```tsx
import { Gsap } from "@shared/ui/gsap";

// В _app.tsx или корневом компоненте
<Gsap>
  <App />
</Gsap>

// Использование GSAP в компонентах
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

useEffect(() => {
  gsap.to(elementRef.current, {
    scrollTrigger: {
      trigger: elementRef.current,
      start: "top center",
    },
    opacity: 1,
  });
}, []);
```

**Зарегистрированные плагины**:
- `ScrollTrigger` - Анимации при скролле
- `Observer` - Наблюдение за событиями
- `CustomEase` - Кастомные easing функции
- `ScrollToPlugin` - Плавная прокрутка к элементам

### Burger

**Путь**: `@shared/ui/burger/`

**Назначение**: Иконка гамбургер-меню

**Особенности**:
- Анимация при открытии/закрытии
- Состояния (open/closed)
- Кастомизация стилей

### Styled Button

**Путь**: `@shared/ui/styled-button/`

**Назначение**: Стилизованная кнопка с дополнительными эффектами

**Особенности**:
- Hover эффекты
- Magnetic эффект (притяжение курсора)
- Различные варианты стилизации

### Slot

**Путь**: `@shared/ui/slot/`

**Назначение**: Компонент для композиции (аналог Radix UI Slot)

**Особенности**:
- Передача пропсов и событий
- Композиция компонентов

## 🧩 Widgets

Составные виджеты находятся в `src/widgets/`.

### Header

**Путь**: `@widgets/header/`

**Назначение**: Шапка сайта

**Компоненты**:
- `Header` - Основной компонент

**Особенности**:
- Навигационное меню
- Логотип
- Мобильное меню
- Sticky header (при необходимости)

### Footer

**Путь**: `@widgets/footer/`

**Назначение**: Подвал сайта

**Компоненты**:
- `Footer` - Основной компонент

**Особенности**:
- Навигационные ссылки
- Социальные сети
- Копирайт информация

### Preloader

**Путь**: `@widgets/preloader/`

**Назначение**: Экран загрузки приложения

**Компоненты**:
- `Preloader` - Основной компонент
- `PreloaderBody` - Тело прелоадера
- `PreloaderCross` - Крестик закрытия

**Особенности**:
- Анимация загрузки
- Прогресс бар
- Загрузка изображений
- GSAP анимации

**State Management**: Zustand store в `model/preloaderStore.ts`

**Hooks**:
- `usePreloader` - Хук для управления прелоадером

**Использование**:
```tsx
import { Preloader } from "@widgets/preloader";

// В _app.tsx
<Preloader />
```

### Cursor

**Путь**: `@widgets/cursor/`

**Назначение**: Кастомный курсор с эффектами

**Компоненты**:
- `Cursor` - Основной компонент
- `Magnetic` - Магнитный эффект для элементов
- `Drag`, `DragLeft` - Режимы перетаскивания
- `Text` - Текстовый курсор

**Особенности**:
- Кастомный курсор вместо системного
- Magnetic эффект (притяжение к элементам)
- Различные режимы (default, drag, text)
- GSAP анимации

**State Management**: Zustand store в `model/cursorStore.ts`

**Использование**:
```tsx
import { Cursor } from "@widgets/cursor";
import { Magnetic } from "@widgets/cursor/ui";

// В _app.tsx
<Cursor />

// Магнитный эффект на элементе
<Magnetic>
  <button>Нажми меня</button>
</Magnetic>
```

### Content

**Путь**: `@widgets/content/`

**Назначение**: Виджет для отображения контента из CMS

**Компоненты**:
- `Content` - Основной компонент

**Особенности**:
- Рендеринг Rich Text
- Динамические зоны Strapi
- Компоненты контента

### Device Info

**Путь**: `@widgets/device-info/`

**Назначение**: Определение устройства и viewport

**Компоненты**:
- `DeviceInfo` - Провайдер информации об устройстве

**Утилиты**:
- `device/` - Определение типа устройства (desktop, tablet, mobile)
- `viewport/` - Информация о viewport (ширина, высота)

**Hooks**:
- `useDevice` - Хук для получения информации об устройстве
- `useViewport` - Хук для получения информации о viewport

**Использование**:
```tsx
import { useDevice, useViewport } from "@widgets/device-info";

const { isMobile, isTablet, isDesktop } = useDevice();
const { width, height } = useViewport();
```

### Sequence

**Путь**: `@widgets/sequence/`

**Назначение**: Последовательность анимаций (возможно Canvas анимации)

**Компоненты**:
- `Sequence` - Основной компонент
- `CanvasSequence` - Canvas реализация

**Особенности**:
- Последовательное воспроизведение анимаций
- Canvas интеграция
- GSAP timeline

## 🔧 Hooks

Переиспользуемые хуки находятся в `src/shared/hooks/`.

### useArrayRefs

**Назначение**: Управление массивом ref'ов

**Использование**:
```tsx
const [refs, setRef] = useArrayRefs<HTMLDivElement>();
```

### useEventListener

**Назначение**: Подписка на события DOM

**Использование**:
```tsx
useEventListener('scroll', handleScroll);
```

### useIntersectionObserver

**Назначение**: Intersection Observer для отслеживания видимости элементов

**Использование**:
```tsx
const { ref, isIntersecting } = useIntersectionObserver({
  triggerOnce: true,
});
```

### useMedia

**Назначение**: Media queries в React

**Использование**:
```tsx
const isMobile = useMedia('(max-width: 768px)');
```

### useMouseMove

**Назначение**: Отслеживание движения мыши

### useOnClickOutside

**Назначение**: Определение клика вне элемента

**Использование**:
```tsx
const ref = useOnClickOutside(() => {
  setIsOpen(false);
});
```

### useResizeObserver

**Назначение**: Отслеживание изменения размера элемента

### useTouch

**Назначение**: Обработка touch событий

**Возвращает**: Данные о touch событиях (swipe, pinch, etc.)

### useValueUpdate

**Назначение**: Выполнение функции при изменении значения

### useVariables

**Назначение**: Мемоизация объекта с зависимостями

### useWheel

**Назначение**: Обработка событий колеса мыши

## 📄 Content Types

Система работы с контентом из Strapi находится в `src/shared/content-types/`.

### Адаптеры

**Путь**: `adapters/`

- `richText.adapter.ts` - Адаптер для Rich Text из Strapi

### Схемы

**Путь**: `schemas/`

- `dynamicZone.schema.ts` - Схемы для Dynamic Zones
- `media.schema.ts` - Схемы для медиа файлов
- `richText.schema.ts` - Схемы для Rich Text

### Рендереры

**Путь**: `renderers/`

- `richTextRenderer.tsx` - Рендерер Rich Text контента

### Утилиты

**Путь**: `utils/`

- `sanitize.ts` - Санитизация HTML контента

**Использование**:
```tsx
import { RichTextRenderer } from "@content/types";
import { mapRichText } from "@content/types";

const richText = mapRichText(data.richText);
<RichTextRenderer content={richText} />
```

## 🗂️ Структура компонента

Типичная структура компонента в проекте:

```
component-name/
├── component-name.tsx      # Основной компонент
├── component-name.module.scss  # Стили компонента
├── index.ts                # Экспорты
└── types.ts                # Типы (опционально)
```

### Пример компонента

```tsx
// component-name.tsx
import styles from "./component-name.module.scss";
import type { ComponentNameProps } from "./types";

export const ComponentName = ({ 
  children, 
  className 
}: ComponentNameProps) => {
  return (
    <div className={clsx(styles.root, className)}>
      {children}
    </div>
  );
};

// types.ts
export interface ComponentNameProps {
  children: React.ReactNode;
  className?: string;
}
```

## 📝 Best Practices

### Стилизация

- Используйте SCSS модули для изоляции стилей
- Применяйте CSS переменные из `_root.scss` для цветов и размеров
- Используйте миксины из `mixins/` для переиспользуемых паттернов

### Типизация

- Всегда типизируйте пропсы компонентов
- Используйте `React.ReactNode` для children
- Экспортируйте типы через `types.ts` или в самом файле

### Композиция

- Разбивайте сложные компоненты на более мелкие
- Используйте композицию вместо наследования
- Применяйте паттерн Compound Components где уместно

### Производительность

- Используйте `React.memo` для компонентов, которые редко изменяются
- Применяйте `useMemo` и `useCallback` для оптимизации
- Ленивая загрузка для тяжелых компонентов

### Accessibility

- Используйте семантические HTML элементы
- Добавляйте ARIA атрибуты где необходимо
- Обеспечивайте keyboard navigation

