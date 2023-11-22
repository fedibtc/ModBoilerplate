# Design, Units, and classes
All custom units & classes for the Fedi UI can be found in `tailwind.config.js`. Here are the important ones.

## Holo
Applies the holo gradient to an element via the `background-image` CSS property. Weight values consist of `100`, `400`, `600`, and `900`

```html
<div className="bg-holo-100">Feint</div>
<div className="bg-holo-400">Light</div>
<div className="bg-holo-600">Medium</div>
<div className="bg-holo-900">Heavy</div>
```

## Colors
Color tokens. Can be used for all color-accepting properties in tailwind, but contrast/weight units don't work.

```html
<div className="bg-green">Green Background</div>
<div className="text-green">Green Text</div>
<div className="bg-green-500">Won't work</div>
<div className="bg-green/500">Green Background, half-transparent</div>
```

| color | color also | same thing |
|-|-|-|
| red | orange | green |
| blue | black | white |
| grey | lightGrey | extraLightGrey |
| darkGrey | keyboardGrey | night |

## Spacing
Spacing extended tailwind utils. Can be used in any tailwind spacing classes.

- xxs: `2px`
- xs: `4px`
- sm: `8px`
- md: `12px`
- lg: `16px`
- xl: `24px`
- xxl: `48px`
- 10: `10px`
- 20: `20px`
- 40: `40px`