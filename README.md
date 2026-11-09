# Nay Engineering — Website

Website for **Nay Engineering Pte Ltd**, Singapore. Covers steel structure, piping, construction, design & build, and customised metal components.

Static site (HTML, CSS and vanilla JS). No build step and no dependencies.

## Pages
| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About us: vision, mission, values, achievements |
| `services.html` | The 5 services |
| `projects.html` | Projects with filters and a photo gallery |
| `contact.html` | Contact details, enquiry form, map |

## Editing content
- **Contact details and projects:** `assets/js/data.js`. The footer, Contact page, home carousel and Projects page all read from this file.
- **Images:** `public/img/`. To add a project photo, put the file here and add its name to that project's `images` list in `data.js`.
- **Styles:** `assets/css/style.css`. Colours and fonts are CSS variables at the top of the file.
- **Interactions:** `assets/js/main.js`. This builds the shared header and footer and runs the animations, slider, carousel, filters and gallery.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
npx serve .
```

## Notes
- The enquiry form opens the visitor's email app (mailto). To receive submissions directly, connect a form service such as Formspree.
- Social icons in the footer stay hidden until real URLs are set in `data.js`.
