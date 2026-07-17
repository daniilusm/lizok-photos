const imageLink = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_PROJECTS_ID}/image/upload`;

export type ProjectImage = {
  url: string;
};

export type Project = {
  mainImage: string;
  date: string;
  slug: string;
  images: ProjectImage[];
};

export const projects: Project[] = [
  {
    mainImage: `${imageLink}/v1783330387/03_ffz5qb.webp`,
    date: "01.01.2020",
    slug: "shablino",
    images: [
      {
        url: `${imageLink}/v1783330386/01_u0vzuy.webp`,
      },
      {
        url: `${imageLink}/v1783330386/02_rfu5wx.webp`,
      },
      {
        url: `${imageLink}/v1783330387/03_ffz5qb.webp`,
      },
      {
        url: `${imageLink}/v1783330387/04_j9jaus.webp`,
      },
      {
        url: `${imageLink}/v1783330387/05_iody3m.webp`,
      },
      {
        url: `${imageLink}/v1783330388/06_rkodei.webp`,
      },
      {
        url: `${imageLink}/v1783330389/07_prmha0.webp`,
      },
      {
        url: `${imageLink}/v1783330389/08_jiq6o7.webp`,
      },
      {
        url: `${imageLink}/v1783330391/10_qitqgh.webp`,
      },
      {
        url: `${imageLink}/v1783330390/09_n2z3sd.webp`,
      },
      {
        url: `${imageLink}/v1783330391/11_agvs53.webp`,
      },
      {
        url: `${imageLink}/v1783330392/12_czrive.webp`,
      },
      {
        url: `${imageLink}/v1783330393/13_ryvvfa.webp`,
      },
    ],
  },
  {
    mainImage: `${imageLink}/v1783330777/10_d4yprq.webp`,
    date: "01.01.2020",
    slug: "sara_and_yana",
    images: [
      {
        url: `${imageLink}/v1783330785/26_m2m4bn.webp`,
      },
      {
        url: `${imageLink}/v1783330784/27_pmk7ob.webp`,
      },
      {
        url: `${imageLink}/v1783330782/25_zz8jhw.webp`,
      },
      {
        url: `${imageLink}/v1783330782/20_tsimbe.webp`,
      },
      {
        url: `${imageLink}/v1783330782/24_nbxjhy.webp`,
      },
      {
        url: `${imageLink}/v1783330782/19_fxrchw.webp`,
      },
      {
        url: `${imageLink}/v1783330782/18_ftgkaw.webp`,
      },
      {
        url: `${imageLink}/v1783330781/22_czujfz.webp`,
      },
      {
        url: `${imageLink}/v1783330781/15_ajobwy.webp`,
      },
      {
        url: `${imageLink}/v1783330781/21_kuknbl.webp`,
      },
      {
        url: `${imageLink}/v1783330780/16_v5ayni.webp`,
      },
      {
        url: `${imageLink}/v1783330780/17_vgmte6.webp`,
      },
      {
        url: `${imageLink}/v1783330780/14_k4nhxr.webp`,
      },
      {
        url: `${imageLink}/v1783330780/13_p5j0sn.webp`,
      },
      {
        url: `${imageLink}/v1783330779/04_vkhatg.webp`,
      },
      {
        url: `${imageLink}/v1783330779/11_vedzhl.webp`,
      },
      {
        url: `${imageLink}/v1783330779/12_nnfhao.webp`,
      },
      {
        url: `${imageLink}/v1783330778/08_k2yww7.webp`,
      },
      {
        url: `${imageLink}/v1783330777/10_d4yprq.webp`,
      },
      {
        url: `${imageLink}/v1783330778/06_snsxap.webp`,
      },
      {
        url: `${imageLink}/v1783330777/09_g66byo.webp`,
      },
      {
        url: `${imageLink}/v1783330777/07_cxtfa4.webp`,
      },
      {
        url: `${imageLink}/v1783330776/05_b205ib.webp`,
      },
      {
        url: `${imageLink}/v1783330775/01_vj5agy.webp`,
      },
      {
        url: `${imageLink}/v1783330775/03_auqjum.webp`,
      },
      {
        url: `${imageLink}/v1783330775/02_akikcq.webp`,
      },
    ],
  },
  {
    mainImage: `${imageLink}/v1783329879/01_svuvgj.webp`,
    date: "01.01.2020",
    slug: "tma",
    images: [
      {
        url: `${imageLink}/v1783329879/02_spwinq.webp`,
      },
      {
        url: `${imageLink}/v1783329879/01_svuvgj.webp`,
      },
      {
        url: `${imageLink}/v1783329881/09_ogwewq.webp`,
      },
      {
        url: `${imageLink}/v1783329879/03_w5gntm.webp`,
      },
      {
        url: `${imageLink}/v1783329880/05_nvaxpw.webp`,
      },
      {
        url: `${imageLink}/v1783329880/06_racoxr.webp`,
      },
      { url: `${imageLink}/v1783329881/08_skkxtm.webp` },
      { url: `${imageLink}/v1783329880/07_yndwwt.webp` },
      { url: `${imageLink}/v1783329880/04_ln8ypy.webp` },
    ],
  },
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
  // {
  //   mainImage: ``,
  //   date: "01.01.2020",
  //   slug: "name",
  //   images: [
  //     {
  //       url: ``,
  //     },
  //   ],
  // },
];
