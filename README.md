# Gita Comfort

**Gita Comfort** is a spiritual companion web application designed to offer solace and wisdom from the *Bhagavad Gita*. By acknowledging your current emotional state, the application provides relevant verses (shlokas) and comforting explanations to help guide you through life's ups and downs.

## Features

- **Emotion-Based Wisdom**: Select from a range of emotions such as Happiness, Sadness, Anger, Anxiety, Loneliness, and more.
- **Curated Verses**: Receive specific shlokas from the Bhagavad Gita that resonate with your feelings.
- **Comforting Explanations**: Simple and brief explanations accompany each verse to provide immediate clarity and peace.
- **Beautiful UI**: An aesthetic interface with themes that adapt to the selected emotion (colors, accents).

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) / Radix UI
- **Language**: TypeScript

## Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/NagaSaiRakshith2905/gita-comfort.git
    cd gita-comfort
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4.  **Open your browser:**

    Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `src/app`: Main application routes and pages.
    - `page.tsx`: The home page allowing emotion selection.
    - `message/[emotion]/page.tsx`: The dynamic page displaying the verse for a selected emotion.
    - `actions.ts`: Server actions for fetching emotion-based guidance.
- `src/lib/gita.ts`: Core logic for mapping emotions to verses and handling data.
- `src/components`: Reusable UI components.
- `data-set`: JSON data containing the Bhagavad Gita verses.

## Bhagavad Gita Data Sources

These are the exact sources used to prepare the local dataset files:

1. Repository data index (used to identify available source files):  
   [https://api.github.com/repos/gita/gita/contents/data](https://api.github.com/repos/gita/gita/contents/data)
2. Verse metadata/text base file:  
   [https://raw.githubusercontent.com/gita/gita/master/data/verse.json](https://raw.githubusercontent.com/gita/gita/master/data/verse.json)
3. Translations file (English entries used, primarily Swami Sivananda):  
   [https://raw.githubusercontent.com/gita/gita/main/data/translation.json](https://raw.githubusercontent.com/gita/gita/main/data/translation.json)
4. Commentary file (downloaded and inspected during generation flow):  
   [https://raw.githubusercontent.com/gita/gita/main/data/commentary.json](https://raw.githubusercontent.com/gita/gita/main/data/commentary.json)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source.
