import { collection, config, fields, singleton } from "@keystatic/core";

const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as
  | `${string}/${string}`
  | undefined;

const searchFields = {
  searchTitle: fields.text({
    label: "Search title",
    description: "This page's title in search results. Ara67 is added after it. Keep it under 50 characters.",
  }),
  searchDescription: fields.text({
    label: "Search description",
    description: "This page's summary in search results and AI tools. Keep it under 155 characters.",
    multiline: true,
  }),
};

export default config({
  // Local files while developing. Set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO to edit a deployed site.
  storage: githubRepo ? { kind: "github", repo: githubRepo } : { kind: "local" },
  ui: {
    brand: { name: "Ara67" },
    navigation: {
      Pages: ["home", "servicesPage", "workPage", "contactPage"],
      Work: ["projects"],
      Site: ["settings"],
    },
  },
  singletons: {
    settings: singleton({
      label: "Site settings",
      path: "content/settings",
      schema: {
        contactEmail: fields.text({
          label: "Contact email",
          description: "Shown on the Contact page and in the footer.",
          validation: { isRequired: true },
        }),
        location: fields.text({ label: "Location", defaultValue: "Atlanta" }),
        coordinates: fields.text({
          label: "Coordinates",
          description: "Shown under the location in the footer.",
          defaultValue: "33.7490° N, 84.3880° W",
        }),
        timeZone: fields.select({
          label: "Time zone",
          description: "Sets the local time shown in the footer.",
          options: [
            { label: "Eastern", value: "America/New_York" },
            { label: "Central", value: "America/Chicago" },
            { label: "Mountain", value: "America/Denver" },
            { label: "Pacific", value: "America/Los_Angeles" },
          ],
          defaultValue: "America/New_York",
        }),
        searchTitle: fields.text({
          label: "Search title",
          description: "The Home page title in search results. Keep it under 60 characters.",
        }),
        description: fields.text({
          label: "Search description",
          description:
            "The short summary search engines and AI tools show for the site. Keep it under 155 characters.",
          multiline: true,
        }),
        socialLinks: fields.array(fields.url({ label: "Link" }), {
          label: "Official profiles",
          description: "Links to Ara67's Vimeo, Instagram, LinkedIn and so on. Helps search engines and AI tools identify the company.",
          itemLabel: (props) => props.value || "New link",
        }),
      },
    }),
    home: singleton({
      label: "Home",
      path: "content/home",
      schema: {
        heroHeadline: fields.text({ label: "Headline", multiline: true }),
        heroIntro: fields.text({
          label: "Intro",
          description: "Wrap a phrase in **double asterisks** to set it in bold.",
          multiline: true,
        }),
        heroPhoto: fields.image({
          label: "Hero photo",
          description: "Shown when there is no reel, and while the reel loads.",
          directory: "public/images/home",
          publicPath: "/images/home/",
        }),
        heroReelUrl: fields.url({
          label: "Hero reel URL",
          description: "A direct link to a short, silent .mp4 file. Plays on a loop.",
        }),
        whoHeading: fields.text({ label: "Who we are: heading", multiline: true }),
        whoBody: fields.text({ label: "Who we are: text", multiline: true }),
        statement: fields.text({
          label: "Statement",
          description: "The short line set across the full width of the dark band. Keep it to a few words.",
        }),
        quote: fields.text({
          label: "Testimonial: quote",
          description: "A real client quote, without quotation marks. The section stays hidden until this is filled in.",
          multiline: true,
        }),
        quoteAttribution: fields.text({
          label: "Testimonial: name, role, company",
        }),
        workHeading: fields.text({ label: "Selected work: heading" }),
        contactHeading: fields.text({ label: "Contact prompt: heading", multiline: true }),
        contactButton: fields.text({ label: "Contact prompt: button" }),
      },
    }),
    servicesPage: singleton({
      label: "Services",
      path: "content/services",
      schema: {
        heading: fields.text({ label: "Heading", multiline: true }),
        intro: fields.text({ label: "Intro", multiline: true }),
        services: fields.array(
          fields.object({
            name: fields.text({ label: "Name", validation: { isRequired: true } }),
            summary: fields.text({ label: "Summary", multiline: true }),
            image: fields.image({
              label: "Image",
              description: "A real still for this phase. 16:9 works best.",
              directory: "public/images/services",
              publicPath: "/images/services/",
            }),
          }),
          {
            label: "Services",
            itemLabel: (props) => props.fields.name.value || "New service",
          },
        ),
        faqHeading: fields.text({ label: "Questions: heading" }),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: "Question", validation: { isRequired: true } }),
            answer: fields.text({ label: "Answer", multiline: true }),
          }),
          {
            label: "Questions",
            description: "Shown on the page and given to search engines and AI tools as direct answers.",
            itemLabel: (props) => props.fields.question.value || "New question",
          },
        ),
        ...searchFields,
      },
    }),
    workPage: singleton({
      label: "Work",
      path: "content/work",
      schema: {
        heading: fields.text({ label: "Heading", multiline: true }),
        intro: fields.text({ label: "Intro", multiline: true }),
        ...searchFields,
      },
    }),
    contactPage: singleton({
      label: "Contact",
      path: "content/contact",
      schema: {
        heading: fields.text({ label: "Heading", multiline: true }),
        intro: fields.text({ label: "Intro", multiline: true }),
        successMessage: fields.text({
          label: "Message after sending",
          multiline: true,
        }),
        ...searchFields,
      },
    }),
  },
  collections: {
    projects: collection({
      label: "Projects",
      path: "content/projects/*",
      slugField: "title",
      columns: ["category", "year", "order"],
      schema: {
        title: fields.slug({ name: { label: "Title", validation: { isRequired: true } } }),
        client: fields.text({ label: "Client" }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Branded film", value: "Branded film" },
            { label: "Commercial", value: "Commercial" },
            { label: "Documentary", value: "Documentary" },
          ],
          defaultValue: "Branded film",
        }),
        year: fields.text({ label: "Year" }),
        runtime: fields.text({
          label: "Runtime",
          description: "Shown in the Selected work list, such as 2:14.",
        }),
        summary: fields.text({ label: "Summary", multiline: true }),
        cover: fields.image({
          label: "Cover image",
          description: "A real still from the work. 16:9 works best.",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
        }),
        previewClip: fields.url({
          label: "Preview clip URL",
          description:
            "A direct link to a short, silent .mp4 file. Plays on the project's card, on hover or as it scrolls into view on phones.",
        }),
        videoUrl: fields.url({
          label: "Video URL",
          description: "A Vimeo or YouTube link. Shown on the project page.",
        }),
        featured: fields.checkbox({
          label: "Show on Home",
          description: "Adds this project to Selected work on the Home page.",
        }),
        order: fields.integer({
          label: "Order",
          description: "Lower numbers appear first.",
          defaultValue: 10,
        }),
      },
    }),
  },
});
