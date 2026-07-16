const lightLogo = 'https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png';
const darkLogo = 'https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-white.png';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Luca Sprunt IDR',
  tagline: 'Cybersecurity foundations, systems operations and secure AI automation',
  favicon: 'img/favicon.svg',
  url: 'https://skunkworks-academy.github.io',
  baseUrl: '/ls1607/',
  organizationName: 'skunkworks-academy',
  projectName: 'ls1607',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
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
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    image: lightLogo,
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Luca Sprunt IDR',
      logo: {
        alt: 'Skunkworks Academy',
        src: lightLogo,
        srcDark: darkLogo,
      },
      items: [
        {to: '/', label: 'Dashboard', position: 'left'},
        {to: '/roadmap/intro', label: 'IDR', position: 'left'},
        {to: '/roadmap/execution-roadmap', label: 'Timeline', position: 'left'},
        {to: '/roadmap/portfolio', label: 'Portfolio', position: 'left'},
        {
          href: 'https://github.com/skunkworks-academy/ls1607',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://github.com/skunkworks-academy/ls1607/raw/main/docs/Luca_Sprunt_Individual_Development_Roadmap.docx',
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
          title: 'Evidence',
          items: [
            {label: 'Portfolio Projects', to: '/roadmap/portfolio'},
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
      {name: 'description', content: 'Luca Sprunt’s Individual Development Roadmap for cybersecurity, systems operations and secure AI automation.'},
      {name: 'theme-color', content: '#0f62fe'},
    ],
  },
};

module.exports = config;
