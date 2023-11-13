# Fedi Mod Boilerplate

A template for building Fedi Mods with on-brand UI and Lightning/Nostr utilities over [Alby](https://getalby.com) and [`@nostr-dev-kit/ndk`](https://www.npmjs.com/package/@nostr-dev-kit/ndk).

## Table of Contents
- [Development](#development)
- [Components](#components)
  - [WebLNProvider](#weblnprovider)
  - [NostrProvider](#nostrprovider)
  - 

## Development

Install packages with `bun install`

Run the development server with `bun run dev`

## Components
All base UI components can be found in the `components` folder

### WebLNProvider
Enables `window.webln` if it exists. Provides `useWebLNContext` & `useWebLN` through `WebLNContext`.

```tsx
import { WebLNProvider, useWebLNContext } from '@/components/providers/webln-provider';

export default function Page() {
  return <WebLNProvider>
    <MyComponent />
  </WebLNProvider>
}

function MyComponent() {
  const { webln, isLoading, error } = useWebLNContext();

  if(error) {
    return <div>An error occurred: {error}</div>
  }

  return isLoading ? 
    <div>Loading...</div> :
    <div>
      <h1>WebLN Enabled</h1>
      <button onClick={async () => {
        console.log(await webln.getInfo())
      }}>Get Info</button>
    </div>
}
```

#### useWebLN
Returns `WebLNContext.webln`. If in a loading / error state, throws an error. Requires `window.webln` to exist and be in an `enabled` state.

```tsx
import { useWebLNContext, useWebLN } from '@/components/providers/webln-provider';
import { useState } from 'react';

// Assuming MyWrapper is wrapped in <WebLNContext/>
function MyWrapper() {
  const { isLoading, error } = useWebLNContext();

  if(error) return <div>An error occurred: {error}</div>

  return isLoading ? 
    <div>Loading...</div> :
    <MyComponent/>
}

function MyComponent() {
  const [amount, setAmount] = useState(0);
  const webln = useWebLN();

  const createInvoice = () => {
    const invoice = await webln.makeInvoice({ amount });
    console.log(invoice);
  }

  return <div>
    <input 
      type="number"
      value={amount} 
      onChange={e => setAmount(e.target.value)} 
      min="0" 
      step="1"
    />
    <button onClick={createInvoice}>Create</button>
  </div>
}
```

### NostrProvider
Initializes `window.nostr` through `NDKNip07Signer`. Provides `useNDKContext`, `useNDK`, and `useNDKUser` through `NostrContext`.

```tsx
import { NostrProvider, useNDKContext } from "@/components/providers/nostr-provider";

export default function Page() {
  return <NostrProvider>
    <MyComponent />
  </NostrProvider>
}

function MyComponent() {
  const { ndk, user, isLoading, error } = useNDKContext();

  if(error) return <div>Error: {error.message}</div>

  return isLoading ? 
    <div>Loading...</div> :
    <div>
      <span>Nostr pubkey: {user.npub}</span>
      <span>Relays: {ndk.explicitRelayUrls.join(', ')}</span>
    </div>
}
```

#### useNDK
Returns `NostrProvider.ndk`. If in a loading/error staate, throws an error. Requires `window.nostr` to be connected.

```tsx
import { NostrProvider, useNDKContext, useNDK } from "@/components/providers/nostr-provider";

// Assuming MyWrapper is wrapped in a <NostrProvider/>
function MyWrapper() {
  const { isLoading, error } = useNDKContext();

  if(error) return <div>{error.message}</div>
  
  return isLoading ?
    <div>Loading...</div> :
    <MyComponent />
}

function MyComponent() {
  const ndk = useNDK();

  return <div>Nostr Relays: {ndk.explicitRelayUrls.join(', ')}</div>
}
```

#### useNDKUser
Returns `NostrProvider.user`. If in a loading/error staate, throws an error. Requires `window.nostr` to be connected.

```tsx
import { NostrProvider, useNDKContext, useNDKUser } from "@/components/providers/nostr-provider";

// Assuming MyWrapper is wrapped in a <NostrProvider/>
function MyWrapper() {
  const { isLoading, error } = useNDKContext();

  if(error) return <div>{error.message}</div>

  return isLoading ?
    <div>Loading...</div> :
    <MyComponent />
}

function MyComponent() {
  const ndk = useNDKUser();

  return <div>Nostr pubkey: {user.npub}</div>
}
```

### Text
Typography. Provides enumerated variants consisting of `variant`, `weight`, and `ellipsize`.

```tsx
import { Text } from '@/components/ui/text';

function MyComponent() {
  return <div>
    <Text variant="display">Display</Text>
    <Text variant="h1">Header 1</Text>
    <Text variant="h2">Header 2</Text>
    <Text weight="medium">Normal Text, medium</Text>
    <Text variant="caption" weight="bold">Caption, bold</Text>
    <Text variant="small" weight="bolder">Small, bolder</Text>
    <Text variant="tiny">Super small</Text>
  </div>
}
```

### Button
The name says it all. Variants consist of `variant`, `size`, `width`, `disabled`, and `loading`.

```tsx
import { Button } from '@/components/ui/button';

function MyComponent() {
  return <div>
    <Button>Click me</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="secondary" size="sm">Secondary, small</Button>
    <Button variant="tertieary" size="xs">Tertiary, extra small</Button>
  </div>
}
```

### Input
An input. The only style variant is `width`, which can be `auto` (default), or `full`

```tsx
import { Input } from "@/components/ui/input";
import { useState } from "react";

function MyComponent() {
  const [value, setValue] = useState("");
  
  return <div>
    <Input value={value} onChange={e => setValue(e.target.value)}/>
  </div>
}
```

### Checkbox / CheckboxGroup
A checkbox. Checkbox variants consist of `disabled`, `defaultChecked`, and `checked`.

```tsx
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Text } from '@/components/ui/text';
import { useState } from "react";

function MyComponent() {
  const [checked, setChecked] = useState(false);

  const [checkboxGroupValues, setCheckboxGroupValues] = useState(["one"]);
  
  const groupOptions = [
    {
      label: "Group option one",
      value: "one",
    },
    {
      label: "Group option two",
      value: "two",
    },
    {
      label: "Group option three",
      value: "three",
      disabled: true,
    },
  ];
  
  return <div>
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label="I am a single Checkbox"
    />

    <Text variant="h2">Checkbox Group</Text>
    <CheckboxGroup
      options={groupOptions}
      values={checkboxGroupValues}
      onChange={setCheckboxGroupValues}
    />
  </div>
}
```

### RadioGroup
A group of radio buttons. Individual radio buttons should not be used.

```tsx
import { RadioGroup } from "@/components/ui/radio";
import { useState } from "react";

function MyComponent() {
  const [radioGroupValue, setRadioGroupValue] = useState("one");

  const groupOptions = [
    {
      label: "Group option one",
      value: "one",
    },
    {
      label: "Group option two",
      value: "two",
    },
    {
      label: "Group option three",
      value: "three",
      disabled: true,
    },
  ];

  return <div>
    <RadioGroup
      options={groupOptions}
      value={radioGroupValue}
      onChange={setRadioGroupValue}
    />
  </div>
}
```

### Avatar
A user avatar. Includes an initial / icon+holo fallback. All variations consist of `size`, `shape`, and `holo`

```tsx
import { Avatar } from "@/components/ui/avatar";

function MyComponent() {
  return <div>
    <Avatar
      // ID is used to determine fallback color
      id="one"
      src="image1.png"
      name="John Doe"
    />

    <Avatar
      id="two"
      src="invalid-image.png"
      name="Elon Musk"
      size="md"
      shape="square"
    />

    <Avatar
      id="two"
      src="invalid-image-2.png"
      name="Elon Musk"
      icon="IconSocial"
      holo
    />
  </div>
}
```

### Toast
Shows a toast. No variations.

```tsx
import { useToast } from "@/components/ui/hooks/use-toast";
import { Button } from "@/components/ui/button";

function MyFunction() {
  const { toast } = useToast();

  return <div>
    <Button onClick={() => {
      toast({
        content: "I am a toast"
      })
    }}>Toast</Button>
  </div>
}
```

### Dialog / DialogStatus
A controlled Modal/Dialog component. No variations.

```tsx
import { Dialog } from "@/components/ui/dialog";
import { DialogStatus } from "@/components/ui/dialog/status";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

function MyFunction() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "loading" | undefined>(undefined);

  const submit = (status: "success" | "error") => {
    setStatus("loading");
    setTimeout(() => {
      setStatus(status)
      setTimeout(() => {
        setOpen(false);
        setStatus(undefined)
      }, 2000)
    }, 2000);
  }

  return <div>
    <Button onClick={() => setOpen(true)}>Open Dialog</Button>

    <Dialog
      title="I am a Dialog"
      description="Click one of the buttons in me or nothing will happen"
      open={open}
      onOpenChange={setOpen}
    >
      <Button onClick={() => submit("success")}>Succeed</Button>
      <Button onClick={() => submit("error")}>Fail</Button>

      {status && (
        <DialogStatus
          status={status}
          title={`Status: ${status}`}
          description="This is a description"
        />
      )}
    </Dialog>
  </div>
}
```

### Scanner
A QR Code scanner.

```tsx
import Scanner from "@/components/ui/scanner";
import { useState } from 'react';

function MyComponent() {
  const [scanning, setScanning] = useState(false);

  return <div>
    <Button onClick={() => setScanning(true)}>Start Scanning</Button>
    
    <Scanner
      scanning={scanning && pInvoiceOpen}
      onResult={(result) => {
        console.log(result);
        setScanning(false);
      }}
      onError={console.log}
    />
  </div>
}
```

## Design, Units, and classes
All custom units & classes for the Fedi UI can be found in `tailwind.config.js`. Here are the important ones.

### Holo
Applies the holo gradient to an element via the `background-image` CSS property. Weight values consist of `100`, `400`, `600`, and `900`

```html
<div className="bg-holo-100">Feint</div>
<div className="bg-holo-400">Light</div>
<div className="bg-holo-600">Medium</div>
<div className="bg-holo-900">Heavy</div>
```

### Colors
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

### Spacing
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