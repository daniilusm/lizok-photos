const imageLink = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_PROJECTS_ID}/image/upload`;

export const projects = [
  {
    mainImage: `${imageLink}/v1783324877/05_lcph2l.webp`,
    date: "01.01.2020",
    slug: "maksim",
    images: [
      {
        url: `${imageLink}/v1783324877/05_lcph2l.webp`,
      },
      {
        url: `${imageLink}/v1783324876/04_r33taa.webp`,
      },
      {
        url: `${imageLink}/v1783324876/03_ys1h8m.webp`,
      },
      {
        url: `${imageLink}/v1783324876/06_x8uehw.webp`,
      },
      {
        url: `${imageLink}/v1783324876/02_z0zncf.webp`,
      },
      {
        url: `${imageLink}/v1783324876/01_tmovah.webp`,
      },
    ],
  },
];
