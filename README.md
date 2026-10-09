# Shadrick Solochi – Interactive Personal Website

ICT251 Web Technologies, Activity 3 – Mulungushi University
Student number: 202509615

A responsive student portfolio built with plain HTML5, CSS and JavaScript. It grew from a one-page "Hello World" (Activity 1) into a full personal website (Activity 2) and now has interactive features (Activity 3). The colour palette is blue, black, white and red, with a light and a dark theme.

**Live website:** `https://ss-desyn-tech.onrender.com`

## Sections

About Me, My Hobbies, My Learning Plan, My Projects and Skills, My Photos, My Media (video and audio) and Contact.

## The four JavaScript features (all in `js/script.js`)

1. **Contact form validation and preview (compulsory)** – validates name, email and message on submit. Empty or spaces-only names and messages, and badly formatted emails, are rejected with a message under the field. When everything is valid, a summary appears on the page without reloading. It says the data was *validated* and that nothing was sent. The form is labelled "Browser demonstration only – no message is sent."
2. **Gallery viewer** – Previous and Next buttons show one photo and its caption at a time, with a "Photo 1 of 3" counter. Previous is disabled on the first photo and Next on the last.
3. **Project search and filter** – type a keyword and/or choose a category to filter the project cards. A count shows how many are visible, a message appears when nothing matches, and "Reset filters" restores everything.
4. **Theme switch** – a button in the navigation switches between light and dark themes. The choice is saved in the browser.

## How to test the features

| Feature | What to try |
|---|---|
| Form | Press **Preview message** with empty fields; enter spaces only; enter `bad@x` as the email; then enter valid values and check the preview. Press **Clear form**. |
| Gallery | Click **Next** until the last photo and **Previous** back to the first; the end buttons become disabled. |
| Filter | Search for `form`, then `zzz` (no match message), choose the **CSS** category, then press **Reset filters**. |
| Theme | Click **Switch to dark theme**, reload the page (choice is remembered), switch back. |

Also check the site at about 375 px and 1280 px wide, and use the Tab key to confirm visible focus on links and controls.

## Project structure

```
index.html
README.md
css/styles.css
js/script.js
images/   photo1.jpg, photo2.jpg, photo3.jpg
videos/   intro.mp4, voice.mp3
```

## Deploying on Render (static site)

| Setting | Value |
|---|---|
| Root Directory | blank (index.html is at the repository root) |
| Build Command | `echo "No build required"` |
| Publish Directory | `.` |
| Auto Deploy | Enabled |

## Sources and credits

- Layout, text and code written by Shadrick Solochi for this assignment, with the MDN Web Docs (developer.mozilla.org) used as a reference.
- Photos, video and audio are the author's own files for this assignment.
