const localLogo = 'img/favicon.svg';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Luca Sprunt IDR',
  tagline: 'Cybersecurity foundations, systems operations and secure AI automation',
  favicon: localLogo,
  url: 'https://skunkworks-academy.github.io',
  baseUrl: '/ls1607/',
  organizationName: 'skunkworks-academy',
  projectName: 'ls1607',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    },
    {
      tagName: 'meta',
      attributes: {property: 'og:type', content: 'website'},
    },
    {
      tagName: 'meta',
      attributes: {property: 'og:site_name', content: 'Skunkworks Academy'},
    },
    {
      tagName: 'meta',
      attributes: {name: 'twitter:card', content: 'summary'},
    },
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: 'Luca Sprunt Individual Development Roadmap',
        description: 'A personalised 12-month cybersecurity, systems operations and secure AI development roadmap.',
        educationalLevel: 'Foundation technical',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Skunkworks Academy',
          url: 'https://skunkworksacademy.com/',
        },
        url: 'https://skunkworks-academy.github.io/ls1607/',
      }),
    },
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'roadmap',
          editUrl: 'https://github.com/skunkworks-academy/ls1607/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        sitemap: {
          changefreq: 'weekly',
          priority: 0.8,
          ignorePatterns: ['/roadmap/tags/**'],
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    image: localLogo,
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Luca Sprunt IDR',
      hideOnScroll: false,
      logo: {
        alt: 'Skunkworks Academy',
        src: localLogo,
        srcDark: localLogo,
        width: 34,
        height: 34,
      },
      items: [
        {to: '/', label: 'Dashboard', position: 'left', exact: true},
        {to: '/roadmap/intro', label: 'IDR', position: 'left'},
        {to: '/roadmap/execution-roadmap', label: 'Timeline', position: 'left'},
        {to: '/roadmap/portfolio', label: 'Portfolio', position: 'left'},
        {
          type: 'dropdown',
          label: 'Assignments',
          position: 'left',
          className: 'navbar-assignment-link',
          items: [
            {
              to: '/roadmap/owasp-top-10-2025-content-sprint',
              label: 'OWASP Top 10 Content Sprint',
            },
            {
              to: '/roadmap/github-achievements-academy',
              label: 'GitHub Achievements Academy',
            },
          ],
        },
        {
          href: 'https://github.com/skunkworks-academy/ls1607',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://raw.githubusercontent.com/skunkworks-academy/ls1607/main/docs/Luca_Sprunt_Individual_Development_Roadmap.docx',
          label: 'Download IDR',
          position: 'right',
          className: 'navbar-download-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Roadmap',
          items: [
            {label: 'Executive Summary', to: '/roadmap/intro'},
            {label: 'Learning Pathway', to: '/roadmap/pathway'},
            {label: '90-Day Plan', to: '/roadmap/execution-roadmap'},
          ],
        },
        {
          title: 'Assignments and Evidence',
          items: [
            {label: 'Portfolio Projects', to: '/roadmap/portfolio'},
            {label: 'OWASP Content Sprint', to: '/roadmap/owasp-top-10-2025-content-sprint'},
            {label: 'GitHub Achievements Academy', to: '/roadmap/github-achievements-academy'},
            {label: 'Evidence Register', to: '/roadmap/evidence'},
            {label: 'Mentor Reviews', to: '/roadmap/mentoring'},
          ],
        },
        {
          title: 'Skunkworks Academy',
          items: [
            {label: 'Academy Home', href: 'https://skunkworksacademy.com/'},
            {label: 'Training Team', href: 'mailto:training@skunkworksacademy.com'},
            {label: 'GitHub Organisation', href: 'https://github.com/skunkworks-academy'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Skunkworks Academy. Dream. Design. Deliver.`,
    },
    prism: {
      additionalLanguages: ['bash', 'json', 'python', 'powershell'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
      options: {
        securityLevel: 'strict',
      },
    },
    metadata: [
      {
        name: 'description',
        content: 'Luca Sprunt’s personalised 12-month cybersecurity roadmap, weekly planner, project tracker and review workspace.',
      },
      {name: 'theme-color', content: '#0f62fe'},
      {property: 'og:title', content: 'Luca Sprunt — Individual Development Roadmap'},
      {
        property: 'og:description',
        content: 'Plan, track, measure and evidence a 12-month cybersecurity development journey.',
      },
      {property: 'og:url', content: 'https://skunkworks-academy.github.io/ls1607/'},
      {name: 'twitter:title', content: 'Luca Sprunt — Individual Development Roadmap'},
      {
        name: 'twitter:description',
        content: 'A personalised cybersecurity roadmap, progress dashboard and evidence workspace.',
      },
    ],
  },
};

module.exports = config;
