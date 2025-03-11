# Layout Component

The Layout component provides a consistent structure for all screens in the application, with a header at the top, content in the middle, and a navigator at the bottom.

## Features

- Header at the top with app title and user profile
- Content area in the middle that automatically adjusts to available space
- Bottom navigator with icons and labels
- Automatic safe area handling for different devices
- Theme support for light and dark modes
- Configurable options to show/hide header and navigator

## Usage

To use the Layout component, simply wrap your screen content with it:

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import Layout from '../components/Layout';

const MyScreen: React.FC = () => {
  return (
    <Layout>
      {/* Your screen content goes here */}
      <View>
        <Text>Hello World!</Text>
      </View>
    </Layout>
  );
};

export default MyScreen;
```

## Props

The Layout component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to display in the middle section |
| showHeader | boolean | true | Whether to show the header at the top |
| showNavigator | boolean | true | Whether to show the navigator at the bottom |
| showProfileButton | boolean | true | Whether to show the profile button in the header |
| contentStyle | object | {} | Additional styles to apply to the content container |

## Example

```tsx
// Screen with custom content style and no profile button
import React from 'react';
import { View, Text } from 'react-native';
import Layout from '../components/Layout';

const CustomScreen: React.FC = () => {
  return (
    <Layout 
      showProfileButton={false}
      contentStyle={{ padding: 20 }}
    >
      <View>
        <Text>Custom Screen Content</Text>
      </View>
    </Layout>
  );
};

export default CustomScreen;
```

## Adding New Screens

When adding new screens to the application, they will automatically be wrapped with the Layout component in the navigation configuration. See `src/navigation/AppNavigator.tsx` for examples.

To add a new screen:

1. Create your screen component
2. Add it to the navigation stack in `AppNavigator.tsx`
3. If you want it to appear in the bottom navigator, add it to the `navItems` array in `BottomNavigator.tsx`

## Common Issues

### Double Headers

If you see double headers on your screen, it's likely because:

1. Your screen component already includes a Header component, or
2. Your screen component is wrapped with the Layout component both in the component itself and in the AppNavigator

To fix this:
- Remove any Header components from your screen component
- Make sure your screen is wrapped with Layout only once (preferably in the AppNavigator)

## Future Improvements

- Add support for custom headers
- Add support for screen-specific navigation options
- Add support for nested navigators 