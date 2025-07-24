# Password Generator Tool

A secure, customizable password generator that creates strong passwords based on user-defined criteria with instant visual feedback and easy copying.

**Experience Qualities**: 
1. **Trustworthy** - Users feel confident the tool generates truly secure passwords
2. **Efficient** - Quick generation and copying with minimal friction
3. **Intuitive** - Clear controls that make password requirements obvious

**Complexity Level**: 
- Micro Tool (single-purpose)
- This tool has one primary function with a few customization options, making it perfect for focused, quick interactions.

## Essential Features

### Password Generation
- **Functionality**: Generate cryptographically secure passwords based on selected criteria
- **Purpose**: Provide users with strong, unique passwords for their accounts
- **Trigger**: User clicks "Generate Password" button or changes criteria
- **Progression**: Select criteria → Click generate → View password → Copy to clipboard
- **Success criteria**: Password meets all selected criteria and uses secure randomization

### Customizable Criteria
- **Functionality**: Toggle character sets (uppercase, lowercase, numbers, symbols) and set length
- **Purpose**: Allow users to meet specific password requirements from different services
- **Trigger**: User interacts with checkboxes and length slider
- **Progression**: Toggle options → Length adjustment → Real-time preview of criteria → Generate
- **Success criteria**: Generated passwords exactly match selected criteria

### Copy to Clipboard
- **Functionality**: One-click copying of generated password
- **Purpose**: Seamless transfer to password fields without manual selection
- **Trigger**: User clicks copy button or generated password
- **Progression**: Click copy → Visual confirmation → Password in clipboard
- **Success criteria**: Password successfully copied with user feedback

### Password Strength Indicator
- **Functionality**: Visual indicator showing password strength and estimated crack time
- **Purpose**: Help users understand the security level of their generated password
- **Trigger**: Automatic when password is generated
- **Progression**: Password generated → Strength calculated → Visual indicator updated
- **Success criteria**: Accurate strength assessment with clear visual representation

## Edge Case Handling

- **No criteria selected**: Prevent generation and show helpful message
- **Very short lengths**: Warn about security implications while allowing generation
- **Copy failures**: Graceful fallback with manual selection prompt
- **Browser compatibility**: Ensure crypto API availability with fallback randomization

## Design Direction

The design should feel professional and trustworthy like a security-focused tool, with clean lines and subtle technical aesthetics that inspire confidence without being intimidating.

## Color Selection

Complementary (opposite colors) - Using blue for trust/security and orange for action/warning elements to create clear hierarchy and professional feel.

- **Primary Color**: Deep blue (oklch(0.45 0.15 230)) - Communicates trust, security, and professionalism
- **Secondary Colors**: Light blue-gray (oklch(0.92 0.02 230)) for backgrounds and subtle elements  
- **Accent Color**: Warm orange (oklch(0.7 0.15 60)) for call-to-action buttons and strength indicators
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Dark gray text (oklch(0.2 0 0)) - Ratio 15.8:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 230)): White text (oklch(1 0 0)) - Ratio 7.2:1 ✓
  - Accent (Warm Orange oklch(0.7 0.15 60)): Dark text (oklch(0.2 0 0)) - Ratio 6.8:1 ✓

## Font Selection

Clean, modern sans-serif typography that emphasizes readability and technical precision, using Inter for its excellent legibility in UI contexts.

- **Typographic Hierarchy**: 
  - H1 (Tool Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/20px/normal spacing  
  - Body (Controls): Inter Regular/16px/relaxed leading
  - Monospace (Password Display): JetBrains Mono/18px for generated passwords

## Animations

Subtle, functional animations that provide immediate feedback and guide user attention without feeling gimmicky - emphasizing the tool's professional nature.

- **Purposeful Meaning**: Quick transitions reinforce security and efficiency themes
- **Hierarchy of Movement**: Generate button gets satisfying press animation, password appearance has gentle fade-in, copy success shows brief confirmation

## Component Selection

- **Components**: Card for main container, Button for primary actions, Checkbox for criteria selection, Slider for length control, Badge for strength indicator, Input for password display
- **Customizations**: Custom password strength meter, monospace password display area with copy integration
- **States**: Generate button (default/hover/active/generating), checkboxes (checked/unchecked/disabled), copy button (default/success/error)
- **Icon Selection**: Shield for security, Copy for clipboard action, Check for confirmations, Eye for password visibility
- **Spacing**: Consistent 16px base spacing with 24px section gaps, 8px for related controls
- **Mobile**: Single column layout with larger touch targets, simplified controls that work well on smaller screens