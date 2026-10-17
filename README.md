# Multi-Mode Calculator App

A responsive, multi-functional calculator web application built using HTML, CSS, and JavaScript.

This project combines five different calculator modes into a single application: Standard, Scientific, Graphing, Programmer, and Date Calculator.

It is designed to provide users with a simple and accessible interface for performing everyday calculations, advanced mathematical operations, graph plotting, number-system conversions, bitwise operations, and date calculations.

## Features

### 1. Standard Calculator

The Standard Calculator provides basic arithmetic operations for everyday calculations.

**Features:**

- Addition (+)
- Subtraction (-)
- Multiplication (×)
- Division (÷)
- Clear and delete functionality
- Interactive calculator buttons
- Responsive user interface

### 2. Scientific Calculator

The Scientific Calculator supports advanced mathematical operations beyond basic arithmetic.

**Features:**

- Basic arithmetic operations
- Trigonometric functions (sin, cos, tan)
- Additional trigonometric functions (sec, cosec)
- Square roots and other root calculations
- Powers and exponents
- Scientific function buttons
- Interactive calculation display

This mode is useful for students and users who need to perform more advanced mathematical calculations.

### 3. Graphing Calculator

The Graphing Calculator allows users to visualize mathematical functions on a coordinate plane.

**Features:**

- Plot up to three mathematical functions simultaneously
- Support for expressions such as:
  - `x^2`
  - `sin(x)`
  - `2*x + 3`
- Different colors for plotted functions
- Interactive coordinate grid
- Zoom in and zoom out
- Drag the graph to explore different regions
- Reset the graph view
- Clear plotted functions
- Display cursor coordinates
- Download the graph as an image

The Graphing Calculator uses the Math.js library to evaluate mathematical expressions.

### 4. Programmer Calculator

The Programmer Calculator provides number-system conversions and bitwise operations.

**Number Systems:**

- Binary (BIN) — Base 2
- Octal (OCT) — Base 8
- Decimal (DEC) — Base 10
- Hexadecimal (HEX) — Base 16

**Features:**

- Automatic conversion between number systems
- Bitwise AND, OR, XOR, and NOT operations
- Left shift (<<) and right shift (>>)
- Selectable 8-bit, 16-bit, 32-bit, and 64-bit word sizes
- Unsigned integer calculations
- Automatic overflow handling based on the selected word size
- Operation indicator
- Keyboard support
- Clear and backspace functionality
- Automatic disabling of invalid digits for the selected number system

The Programmer Calculator uses JavaScript BigInt to support calculations involving large integers.

**Example:**

Decimal 25 can be represented as:

| Number System | Value |
| ------------- | ----- |
| HEX           | 19    |
| DEC           | 25    |
| OCT           | 31    |
| BIN           | 11001 |

### 5. Date Calculator

The Date Calculator allows users to calculate differences between dates and determine new dates by adding or subtracting time.

**Date Difference Features:**

- Calculate the difference between two selected dates
- Display the difference in years, months, weeks, and days
- Display the total number of days between dates
- Support leap years
- Handle dates entered in either order

**Add/Subtract Features:**

- Add years, months, weeks, or days to a selected date
- Subtract years, months, weeks, or days from a selected date
- Handle month-end adjustments
- Support leap-year calculations
- Display the resulting date in a readable format
- Validate user input

**Example:**

Adding one month to January 31, 2026, produces February 28, 2026.

## General Features

All calculator modes include:

- Responsive layouts for desktop and mobile devices
- Consistent user interface
- Navigation between calculator modes
- Hamburger navigation menu
- Animated hamburger-to-X transformation
- Interactive buttons and hover effects
- Clear and readable displays

## Technologies Used

The project was developed using the following technologies:

| Technology | Purpose                                         |
| ---------- | ----------------------------------------------- |
| HTML5      | Structure and content                           |
| CSS3       | Styling, layout, and responsiveness             |
| JavaScript | Calculator logic and interactivity              |
| Math.js    | Mathematical expression evaluation for graphing |
| Canvas API | Drawing and interacting with graphs             |
| BigInt     | Large integer and bitwise calculations          |
| Git        | Version control                                 |
| GitHub     | Source code hosting                             |

No frontend framework is required.

## Project Structure

```text
Calculator-App/
│---Images
|---README.md
├── index.html
├── script.js
├── scientific.html
├── scientific.js
├── programmer.html
│---programmer.js
│── programmer.js
├── programmer.js
├── graphing.html
├---graphing.js
├── date.html
├── date.js
|
└── style.css

```

Note: The Standard Calculator's JavaScript may be included directly in `index.html` or stored in a separate JavaScript file, depending on the project structure.

## Installation and Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your actual GitHub username and repository name.

### 2. Navigate to the Project Folder

```bash
cd YOUR_REPOSITORY
```

### 3. Open the Application

Open `index.html` in a modern web browser.

Alternatively, you can use the Live Server extension in Visual Studio Code.

### 4. Internet Connection

Most calculator features work directly in the browser.

However, the Graphing Calculator loads Math.js from a CDN, so an internet connection is required to load that library unless it is installed locally.

## How to Use

### Standard Calculator

1. Open the Standard Calculator.
2. Enter numbers using the calculator buttons.
3. Select an arithmetic operation.
4. Press the equals button to calculate the result.
5. Use Clear to reset the calculator.

### Scientific Calculator

1. Open the Scientific Calculator from the navigation menu.
2. Enter the required number.
3. Select a scientific function.
4. View the calculated result.

### Graphing Calculator

1. Open the Graphing Calculator.
2. Enter a mathematical expression in one of the function fields.
3. Enter additional expressions if needed.
4. Click **Plot Graph**.
5. Use the graph controls to zoom, reset, or clear.
6. Move the cursor over the graph to view coordinates.
7. Click **Download** to save the graph as an image.

### Programmer Calculator

1. Open the Programmer Calculator.
2. Select a number system: HEX, DEC, OCT, or BIN.
3. Select the desired word size.
4. Enter a number using the available digit buttons.
5. View its equivalent values in the other number systems.
6. Select a bitwise operation if needed.
7. Enter the second operand and press `=`.
8. Use the keyboard or calculator buttons for input.

### Date Calculator

**To calculate a date difference:**

1. Open the Date Calculator.
2. Select the Date Difference tab.
3. Choose the start date.
4. Choose the end date.
5. Click **Calculate Difference**.
6. View the difference and total number of days.

**To add or subtract dates:**

1. Select the Add / Subtract tab.
2. Choose a starting date.
3. Select Add or Subtract.
4. Enter the number of years, months, weeks, or days.
5. Click **Calculate Date**.
6. View the calculated date.

## Keyboard Shortcuts

The Programmer Calculator supports the following keyboard shortcuts:

| Key       | Action                   |
| --------- | ------------------------ |
| 0–9       | Enter numeric digits     |
| A–F       | Enter hexadecimal digits |
| Enter     | Calculate result         |
| =         | Calculate result         |
| Backspace | Delete the last digit    |
| Escape    | Clear                    |
| &         | Bitwise AND              |
| \|        | Bitwise OR               |
| ^         | Bitwise XOR              |
| ~         | Bitwise NOT              |
| <         | Left shift               |
| >         | Right shift              |

Only digits valid for the selected number system are accepted.

## Browser Compatibility

The application is designed to work with modern browsers, including:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

A browser with JavaScript, HTML5 Canvas, and BigInt support is required.

## Limitations

- The application is designed for educational and general-purpose calculations.
- The Graphing Calculator supports up to three functions at a time.
- Graph plotting depends on Math.js.
- The Programmer Calculator uses unsigned integer calculations with selectable word sizes.
- The Programmer Calculator does not currently include floating-point or signed integer modes.
- Date calculations use the Gregorian calendar.
- Date calculations do not account for business days or public holidays.

## Future Improvements

Possible future enhancements include:

- Calculation history
- Dark and light theme options
- Additional scientific functions
- More advanced graphing features
- Signed integer support for the Programmer Calculator
- Additional keyboard shortcuts
- Improved accessibility
- Progressive Web App (PWA) support

## Learning Outcomes

Developing this project provided practical experience in:

- Building responsive interfaces with HTML and CSS
- Manipulating the DOM using JavaScript
- Handling user input and events
- Implementing mathematical calculations
- Working with JavaScript BigInt
- Using the HTML5 Canvas API
- Integrating external JavaScript libraries
- Performing date calculations
- Debugging JavaScript and CSS issues
- Organizing a multi-page web application
- Using Git and GitHub for version control

## Live Demo

**Live Website:** [View Calculator App](https://developer121438.github.io/Calculator-App-/)

Replace the placeholder URL with your actual GitHub Pages link after deployment.

## Author

**Dejen Angaw**

Computer Science Student | Aspiring Front-End Developer

GitHub: [Developer121438](https://github.com/Developer121438)

## License

This project is available for educational and personal use.

If you plan to make the project open source, consider adding a LICENSE file, such as the MIT License, to define how others may use and distribute the code.
