# Minnal Murali Help Portal

A responsive chatbot landing page based on the Gamma design, with a five-step conversational intake and Formspree email handoff.

## Make the email flow live

1. Create a form at https://formspree.io/.
2. Set the destination email to `dayadc1234@gmail.com`.
3. Copy the form endpoint, which looks like `https://formspree.io/f/abcxyz`.
4. Open `config.js` and replace `REPLACE_WITH_FORM_ID` with the real form ID.
5. Test the flow from the deployed URL.

## Deploy to Vercel

1. Create a new GitHub repository and upload this folder.
2. In Vercel, choose **Add New Project** and import the repository.
3. Keep the default settings for a static site.
4. Deploy.
5. Test one complete conversation and confirm the email arrives.

## Easy edits

- Main copy and section content: `index.html`
- Colors, type, spacing, and responsive behavior: `styles.css`
- Chat prompts and validation: `app.js`
- Email endpoint and recipient label: `config.js`
- Hero image: `assets/storm-tree.jpg`
- Origin image: `assets/minnal-origin.png`
