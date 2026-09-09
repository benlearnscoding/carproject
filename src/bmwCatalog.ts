export type BmwCatalogEntry = {
  id: string;
  model: string;
  generation: string;
  image: string;
  year: number;
  transmission: "Automatic" | "Manual";
  tags: string[];
};

const sourceRows = [
  [
    "330i",
    "E46",
    "https://www.automobile-sportive.com/guide/bmw/330ci/bmw-330ci-e46.jpg"
  ],
  [
    "330i",
    "E90",
    "https://www.forumbmw.net/img/members/3/Serie-3-E90.jpeg"
  ],
  [
    "330i",
    "F30",
    "https://www.larevueautomobile.com/images/articles/Bmw/Serie-3-F30/Exterieur/Bmw_Serie_3_F30_005.jpg"
  ],
  [
    "330i",
    "G20",
    "https://mediapool.bmwgroup.com/cache/P9/201812/P90332408/P90332408-the-all-new-bmw-330i-model-m-sport-portimao-blue-metallic-rim-19-styling-791-m-12-2018-2250px.jpg"
  ],
  [
    "330d",
    "E46",
    "https://www.automobile-sportive.com/guide/bmw/330ci/bmw-330ci-e46.jpg"
  ],
  [
    "330d",
    "E90",
    "https://www.forumbmw.net/img/members/3/Serie-3-E90.jpeg"
  ],
  [
    "330d",
    "F30",
    "https://www.larevueautomobile.com/images/articles/Bmw/Serie-3-F30/Exterieur/Bmw_Serie_3_F30_005.jpg"
  ],
  [
    "330d",
    "G20",
    "https://www.mosselmanturbo.com/uploads/cars/detail_default/1200x675/bmw-330d-g20-265hp.jpeg"
  ],
  [
    "335i",
    "E90",
    "https://www.motorlegend.com/images-voiture/large/bmw-serie-3-e90-berline-335i-306ch-134999.jpg"
  ],
  [
    "335i",
    "F30",
    "https://www.larevueautomobile.com/images/articles/Bmw/Serie-3-F30/Exterieur/Bmw_Serie_3_F30_005.jpg"
  ],
  [
    "335d",
    "E90",
    "https://www.motorlegend.com/images-voiture/large/bmw-serie-3-e90-berline-335i-306ch-134999.jpg"
  ],
  [
    "335d",
    "F30",
    "https://www.larevueautomobile.com/images/articles/Bmw/Serie-3-F30/Exterieur/Bmw_Serie_3_F30_005.jpg"
  ],
  [
    "335is",
    "E92",
    "https://tflcar.com/wp-content/uploads/2014/12/2012_BMW_335is_Coupe_3587525.jpg"
  ],
  [
    "335is",
    "E93",
    "https://hips.hearstapps.com/hmg-prod/amv-prod-cad-assets/images/10q3/357232/2011-bmw-335is-photo-358990-s-original.jpg?fill=1:1&resize=1200:*"
  ],
  [
    "335xi",
    "E90",
    "https://www.motorlegend.com/images-voiture/large/bmw-serie-3-e90-berline-335i-306ch-134999.jpg"
  ],
  [
    "335xi",
    "E91",
    "https://www.asphalte.ch/Auto/335xi/335istat1-650.jpg"
  ],
  [
    "335xi",
    "E92",
    "https://tflcar.com/wp-content/uploads/2014/12/2012_BMW_335is_Coupe_3587525.jpg"
  ],
  [
    "335xi",
    "E93",
    "https://hips.hearstapps.com/hmg-prod/amv-prod-cad-assets/images/10q3/357232/2011-bmw-335is-photo-358990-s-original.jpg?fill=1:1&resize=1200:*"
  ],
  [
    "340i",
    "F30",
    "https://cdn.shopify.com/s/files/1/0809/6684/4690/files/BMW-M240i_Coupe-2018-1280-1acc8e1f45d5ef6fea2e0e09a0df495bca_b836f98d-f69e-4870-b083-8c8462977a34_1024x1024.jpg?v=1729775259"
  ],
  [
    "340i",
    "F31",
    "https://medias.blogbmw.fr/2015/05/nouvelle-BMW-Serie-3-F30-1.jpg"
  ],
  [
    "M340i",
    "G20",
    "https://www.turbo.fr/sites/default/files/2022-09/15_essai_bmw_serie_3_g20_m340i_facelift_2022.jpg"
  ],
  [
    "M340i",
    "G21",
    "https://www.automotivpress.fr/wp-content/uploads/2019/10/P90373322_highRes_the-new-bmw-m340i-xd-990x660.jpg"
  ],
  [
    "M340d",
    "G20",
    "https://www.turbo.fr/sites/default/files/2022-09/15_essai_bmw_serie_3_g20_m340i_facelift_2022.jpg"
  ],
  [
    "M340d",
    "G21",
    "https://www.automotivpress.fr/wp-content/uploads/2019/10/P90373322_highRes_the-new-bmw-m340i-xd-990x660.jpg"
  ],
  [
    "M3",
    "E30",
    "https://cdn.motor1.com/images/mgl/G3yeBV/s1/bmw-m3-e30-statica.jpg"
  ],
  [
    "M3",
    "E36",
    "https://www.automobile-sportive.com/guide/bmw/m3e36/bmw-m3-e36-3l2.jpg"
  ],
  [
    "M3",
    "E46",
    "https://i0.wp.com/ffdetailingcenter.fr/wp-content/uploads/2021/11/dsc_0884.jpg?fit=6000%2C4000&ssl=1"
  ],
  [
    "M3",
    "E90",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-3-e90-m3/S0-modele--bmw-serie-3-e90-m3.jpg"
  ],
  [
    "M3",
    "F80",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-3-f80-m3/S0-modele--bmw-serie-3-f80-m3.jpg"
  ],
  [
    "M3",
    "G80",
    "https://www.auto-data.net/images/f107/BMW-M3-G80.jpg"
  ],
  [
    "M3",
    "G81",
    "https://i.gaw.to/content/photos/52/93/529302-voici-la-bmw-m3-touring-que-nous-n-aurons-pas.jpg"
  ],
  [
    "M135i",
    "E82",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-1-e82-coupe/S8-modele--bmw-serie-1-e82-coupe.jpg"
  ],
  [
    "M135i",
    "F20",
    "https://images.caradisiac.com/images/8/0/4/2/188042/S1-bmw-m135i-140i-2012-2019-des-petites-bombes-a-propulsion-comme-on-n-en-fera-plus-des-19-000-eur-661425.jpg"
  ],
  [
    "M135i",
    "F40",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-1-f40/S8-modele--bmw-serie-1-f40.jpg"
  ],
  [
    "M140i",
    "F20",
    "https://www.auto-data.net/images/f3/bmw-1er-hatchback-f20-lci-facelift-2017.jpg"
  ],
  [
    "1M",
    "E82 1M Coupé",
    "https://public.carjager.com/production/cms/BMW_1_M_E82_01_c917a3b85e.jpg"
  ],
  [
    "M1",
    "E26",
    "https://uncrate.com/p/2024/01/bmw-m1-1.jpg"
  ],
  [
    "230i",
    "F22",
    "https://www.auto-data.net/images/f23/bmw-2er-coupe-f22-lci-facelift-2017.jpg"
  ],
  [
    "230i",
    "G42",
    "https://lapmeta.com/storage/vi-images/l4bfCCvNN8.jpg"
  ],
  [
    "M235i",
    "F22",
    "https://medias.blogbmw.fr/2014/03/BMW-M-235i-presse-14.jpg"
  ],
  [
    "M235i",
    "F44",
    "https://cdn.shopify.com/s/files/1/0809/6684/4690/files/BMW-M235i_xDrive_Gran_Coupe-2020-HD-c1550cc51b95f4586e5f153f2eca90bf756594fa0_3eaa3930-f084-4ea4-97f9-9a483186ae9c_1024x1024.jpg?v=1735551788"
  ],
  [
    "M240i",
    "F22",
    "https://lapmeta.com/storage/vi-images/sYp6FIquon.jpg"
  ],
  [
    "M240i",
    "G42",
    "https://lapmeta.com/storage/vi-images/iAp8izbdZo.jpg"
  ],
  [
    "M2",
    "F87",
    "https://carfans.fr/wp-content/uploads/2025/01/P90199668_highRes_the-new-bmw-m2-coupe.jpg"
  ],
  [
    "M2",
    "G87",
    "https://i0.wp.com/pdlv.fr/wp-content/uploads/2022/10/fiche-technique-bmw-m2-g87-2023.jpg?resize=780%2C470&ssl=1"
  ],
  [
    "M2 Competition",
    "F87",
    "https://medias.blogbmw.fr/2018/04/P90298672_highRes_the-new-bmw-m2-compe.jpg"
  ],
  [
    "M2 CS",
    "F87",
    "https://www.bmw-m.com/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/magazine-article-pool/2025/bmw-m2-cs-f87/bmw-m2-cs-f87-st-01-16x9.jpg"
  ],
  [
    "M2 CS",
    "G87",
    "https://images.caradisiac.com/images/5/9/9/2/215992/S0-la-nouvelle-bmw-m2-cs-montre-enfin-ses-muscles-844333.jpg"
  ],
  [
    "430i",
    "F32",
    "https://www.auto-data.net/images/f0/bmw-4er-coupe-f32-lci-facelift-2017.jpg"
  ],
  [
    "430i",
    "F33",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f33-cabriolet/S8-modele--bmw-serie-4-f33-cabriolet.jpg"
  ],
  [
    "430i",
    "F36",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f36/S8-modele--bmw-serie-4-f36.jpg"
  ],
  [
    "430i",
    "G22",
    "https://cache.motorsdb.com/resize/1600x1000/archives/2020/06/05/BMW-430i-Coupe-G22-2020-62220.jpg?mtime=1591359882"
  ],
  [
    "430i",
    "G23",
    "https://www.auto-data.net/images/f50/BMW-4-Series-Convertible-G23-LCI-facelift-2024.jpg"
  ],
  [
    "430i",
    "G26",
    "https://bmw.scene7.com/is/image/BMW/g26_ice_positioning_image:16to7?fmt=webp&wid=2560&fit=wrap%2C+1"
  ],
  [
    "430d",
    "F32",
    "https://www.auto-data.net/images/f0/bmw-4er-coupe-f32-lci-facelift-2017.jpg"
  ],
  [
    "430d",
    "F33",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f33-cabriolet/S8-modele--bmw-serie-4-f33-cabriolet.jpg"
  ],
  [
    "430d",
    "F36",
    "https://dcmc.b-cdn.net/CarImages/b74024df-f032-4b84-9e49-3f728fa46177.jpg"
  ],
  [
    "430d",
    "G22",
    "https://cache.motorsdb.com/resize/1600x1000/archives/2020/06/05/BMW-430i-Coupe-G22-2020-62220.jpg?mtime=1591359882"
  ],
  [
    "430d",
    "G23",
    "https://www.auto-data.net/images/f50/BMW-4-Series-Convertible-G23-LCI-facelift-2024.jpg"
  ],
  [
    "430d",
    "G26",
    "https://bmw.scene7.com/is/image/BMW/g26_ice_positioning_image:16to7?fmt=webp&wid=2560&fit=wrap%2C+1"
  ],
  [
    "435i",
    "F32",
    "https://www.mad4wheels.com/img/free-car-images/mobile/13141/bmw-435i-f32--2013-388105.jpg"
  ],
  [
    "435i",
    "F33",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f33-cabriolet/S8-modele--bmw-serie-4-f33-cabriolet.jpg"
  ],
  [
    "435i",
    "F36",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f36/S8-modele--bmw-serie-4-f36.jpg"
  ],
  [
    "435d",
    "F32",
    "https://mediapool.bmwgroup.com/cache/P9/201601/P90207362/P90207362-the-bmw-435d-xdrive-coupe-12-2015-2249px.jpg"
  ],
  [
    "435d",
    "F33",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f33-cabriolet/S8-modele--bmw-serie-4-f33-cabriolet.jpg"
  ],
  [
    "435d",
    "F36",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f36/S8-modele--bmw-serie-4-f36.jpg"
  ],
  [
    "440i",
    "F32",
    "https://lapmeta.com/storage/vi-images/fKNxP7o5H3.jpg"
  ],
  [
    "440i",
    "F33",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f33-cabriolet/S8-modele--bmw-serie-4-f33-cabriolet.jpg"
  ],
  [
    "440i",
    "F36",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f36/S8-modele--bmw-serie-4-f36.jpg"
  ],
  [
    "440i",
    "G22",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-g22/S8-modele--bmw-serie-4-g22.jpg"
  ],
  [
    "440i",
    "G23",
    "https://i0.wp.com/pdlv.fr/wp-content/uploads/2023/01/fiche-technique-bmw-serie-4-cabriolet-g23-2020.jpg?resize=780%2C470&ssl=1"
  ],
  [
    "440i",
    "G26",
    "https://bmw.scene7.com/is/image/BMW/g26_ice_positioning_image:16to7?fmt=webp&wid=2560&fit=wrap%2C+1"
  ],
  [
    "M440i",
    "G22",
    "https://www.auto-data.net/images/f49/BMW-4-Series-Coupe-G22-LCI-facelift-2024.jpg"
  ],
  [
    "M440i",
    "G23",
    "https://static3d.felgenshop.de/mam-rs4-black-painted-felge-mit-reifen-schwarz-in-19zoll-winterfelge-alufelge-auf-weissem-bmw-m4-typ-g83-cabrio-4er-g23-cabrio-g3c-mit-15mm-tieferlegung-old-industrial-hall-max-5300mm-2024-frontansicht-1-1920.jpg"
  ],
  [
    "M440i",
    "G26",
    "https://i0.wp.com/pdlv.fr/wp-content/uploads/2023/01/fiche-technique-bmw-serie-4-gran-coupe-g26-2022.jpg?resize=780%2C470&ssl=1"
  ],
  [
    "M4",
    "F82",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f82-m4/S0-modele--bmw-serie-4-f82-m4.jpg"
  ],
  [
    "M4",
    "G82",
    "https://bmw.scene7.com/is/image/BMW/g82_g22-m440_dynamics_m-sport-differential_fb?qlt=80&wid=1024&fmt=webp"
  ],
  [
    "M4",
    "G83",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-g83-cabriolet-m4/S8-modele--bmw-serie-4-g83-cabriolet-m4.jpg"
  ],
  [
    "M4 Competition",
    "F82",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f82-m4/S0-modele--bmw-serie-4-f82-m4.jpg"
  ],
  [
    "M4 Competition",
    "G82",
    "https://auto.cdn-rivamedia.com/1283694/132540143-ibig.jpg"
  ],
  [
    "M4 Competition",
    "G83",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-g83-cabriolet-m4/S8-modele--bmw-serie-4-g83-cabriolet-m4.jpg"
  ],
  [
    "M4 CS",
    "F82",
    "https://spots.ag/2023/09/08/bmw-m4-f82-cs-2017-c931808092023220404_1.jpg?1694203463"
  ],
  [
    "M4 CS",
    "G82",
    "https://bmw.scene7.com/is/image/BMW/g82_cs_design-positioning%3A16to7?fit=constrain%2C1&fmt=webp&wid=2560"
  ],
  [
    "M4 CSL",
    "G82",
    "https://prestigeandperformancecar.com/wp-content/uploads/BMW-M4-CSL-4.jpg"
  ],
  [
    "535i",
    "E60",
    "https://www.o2programmation.com/images/detail/produit916.JPG"
  ],
  [
    "535i",
    "F10",
    "https://images.caradisiac.com/logos/2/5/1/3/132513/S8-Nouvelle-BMW-Serie-5-F10-officielle-photos-et-videos-36850.jpg"
  ],
  [
    "535i",
    "F11",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-5-f11-touring/S8-modele--bmw-serie-5-f11-touring.jpg"
  ],
  [
    "535d",
    "E60",
    "https://www.o2programmation.com/images/detail/produit916.JPG"
  ],
  [
    "535d",
    "F10",
    "https://images.caradisiac.com/logos/2/5/1/3/132513/S8-Nouvelle-BMW-Serie-5-F10-officielle-photos-et-videos-36850.jpg"
  ],
  [
    "535d",
    "F11",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-5-f11-touring/S8-modele--bmw-serie-5-f11-touring.jpg"
  ],
  [
    "540i",
    "E34",
    "https://images.caradisiac.com/logos/2/0/9/8/272098/S7-bmw-530i-540i-v8-e34-1992-1995-la-plus-belle-de-serie-5-a-son-apogee-des-10-000-eur-196651.jpg"
  ],
  [
    "540i",
    "E39",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-5-e39/S8-modele--bmw-serie-5-e39.jpg"
  ],
  [
    "540i",
    "G30",
    "https://www.auto-data.net/images/f19/file5341705.jpg"
  ],
  [
    "540i",
    "G31",
    "https://cache.motorsdb.com/resize/1600x1067/archives/2024/04/01/BMW-540i-Touring-G31-2020-42312.jpg?mtime=1712012402"
  ],
  [
    "540i",
    "G60",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3FUxjjb24k0h_kQVq9QivlYAHsO0eaTV1zk044VnT89M-sOmTQG0RhM36&s=10"
  ],
  [
    "540i",
    "G61",
    "https://www.auto-data.net/images/f105/BMW-5-Series-Touring-G61_4.jpg"
  ],
  [
    "550i",
    "E60",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-5-e60/S8-modele--bmw-serie-5-e60.jpg"
  ],
  [
    "550i",
    "F10",
    "https://cdn.bmwblog.com/wp-content/uploads/2017/01/BMW-F10-5-Series-images-19.jpg"
  ],
  [
    "550i",
    "F11",
    "https://cache.motorsdb.com/resize/1600x1067/archives/2022/01/06/BMW-550i-Touring-F11-2013-2017-37522.jpg?mtime=1641455016"
  ],
  [
    "550i",
    "G30",
    "https://www.asphalte.ch/news/wp-content/uploads/2016/10/BMW-Serie-5-G30-07.jpg"
  ],
  [
    "550i",
    "G31",
    "https://mediapool.bmwgroup.com/cache/P9/202005/P90389082/P90389082-the-new-bmw-530i-touring-sophisto-grey-metallic-05-2020-600px.jpg"
  ],
  [
    "M550i",
    "G30",
    "https://cache.motorsdb.com/resize/1600x1067/archives/2017/02/20/BMW-M550i-G30-2016-33543.jpg?mtime=1487605609"
  ],
  [
    "M550d",
    "G31",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-5-g31-touring/S8-modele--bmw-serie-5-g31-touring.jpg"
  ],
  [
    "M5",
    "E28",
    "https://cdn.motor1.com/images/mgl/7ZQPjp/s1/bmw-m5-e28-1984-1987.webp"
  ],
  [
    "M5",
    "E34",
    "https://cdn3.focus.bg/autodata/i/bmw/m5/m5-e34/large/e898e72d85a394d7a10d708977d69dca.jpg"
  ],
  [
    "M5",
    "E39",
    "https://public.carjager.com/images/production/CJVYT0904251510AFU-exteriors-3I2q65FZaC_E7RpF6bxzu-m5"
  ],
  [
    "M5",
    "E60",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-5-e60-m5/S0-modele--bmw-serie-5-e60-m5.jpg"
  ],
  [
    "M5",
    "F10",
    "https://i.namu.wiki/i/SS5VpmVMYreFi1b0zZSYD_KnH5GFzdwcLLRU1tosj-d-ihdvtcEDm5WYmPCac1lRcPVj0dhqiAD0Po2Ab-XL_g.webp"
  ],
  [
    "M5",
    "F90",
    "https://lapmeta.com/storage/vi-images/uXBzxber3a.jpg"
  ],
  [
    "M5",
    "G90",
    "https://carfans.fr/wp-content/uploads/2024/10/BMW-M5-Isle-Of-Man-Green_029.webp"
  ],
  [
    "M5 Competition",
    "F10",
    "https://www.hexagonclassics.com/userfiles/crops/1296-20201002102155-35.jpg"
  ],
  [
    "M5 Competition",
    "F90",
    "https://images.collectingcars.com/073583/17-02-2025-AS-12.jpg?w=3840&q=95"
  ],
  [
    "M5 CS",
    "F90",
    "https://mediapool.bmwgroup.com/cache/P9/202101/P90411283/P90411283-the-new-bmw-m5-cs-01-2021-599px.jpg"
  ],
  [
    "640i",
    "F12",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/2018_BMW_640_3.0_Front.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"
  ],
  [
    "640i",
    "F13",
    "https://cache.motorsdb.com/resize/1600x1000/archives/2016/05/16/BMW-640i-Coupe-F13-2011-28788.jpg?mtime=1463397579"
  ],
  [
    "640i",
    "F06",
    "https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1562254412/autoexpress/images/car_photo_526378.jpg"
  ],
  [
    "640i",
    "G32",
    "https://cache.motorsdb.com/resize/1600x1000/archives/2017/09/05/BMW-640i-Gran-Turismo-G32-2017-97811.jpg?mtime=1504640400"
  ],
  [
    "640d",
    "F12",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/2018_BMW_640_3.0_Front.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"
  ],
  [
    "640d",
    "F13",
    "https://cache.motorsdb.com/resize/1600x1000/archives/2016/05/16/BMW-640i-Coupe-F13-2011-28788.jpg?mtime=1463397579"
  ],
  [
    "640d",
    "F06",
    "https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1562254412/autoexpress/images/car_photo_526378.jpg"
  ],
  [
    "640d",
    "G32",
    "https://cache.motorsdb.com/resize/1600x1000/archives/2017/09/05/BMW-640i-Gran-Turismo-G32-2017-97811.jpg?mtime=1504640400"
  ],
  [
    "650i",
    "E63",
    "https://images.caradisiac.com/images/1/8/4/2/191842/S1-bmw-serie-6-e63-2003-2010-look-fort-et-mecaniques-au-top-des-10-000-eur-689203.jpg"
  ],
  [
    "650i",
    "E64",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-6-e64-cabriolet/S8-modele--bmw-serie-6-e64-cabriolet.jpg"
  ],
  [
    "650i",
    "F06",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-6-f06-gran-coupe/S8-modele--bmw-serie-6-f06-gran-coupe.jpg"
  ],
  [
    "650i",
    "F12",
    "https://auto.cdn-rivamedia.com/1283694/125238697-ibig.jpg"
  ],
  [
    "650i",
    "F13",
    "https://cdn.automoto.tn/images/generation/424d572053c3a9726965203620436f7570c3a9202846313329.jpeg"
  ],
  [
    "M635CSi",
    "E24",
    "https://www.bmwgroup-classic.com/content/dam/grpw/websites/bmwgroup-classic_com/productcatalog2/images_pc/AF-8010-1.png/jcr:content/renditions/original"
  ],
  [
    "M6",
    "E63",
    "https://carfans.fr/wp-content/uploads/2022/07/BMW-M6-E63_2-scaled.jpg.webp"
  ],
  [
    "M6",
    "E64",
    "https://mediapool.bmwgroup.com/download/edown/pressclub/public?actEvent=zoomImage&dokNo=P0024681&filename=P0024681.JPG"
  ],
  [
    "M6",
    "F12",
    "https://www.motorlegend.com/images-voiture/large/bmw-m6-f12-cabriolet-v8-132487.jpg"
  ],
  [
    "M6",
    "F13",
    "https://s1.cdn.autoevolution.com/images/news/gallery/bmw-f13-m6-review-by-car-and-driver_4.jpg"
  ],
  [
    "M6",
    "F06",
    "https://auto.cdn-rivamedia.com/2414/156418236-ibig.jpg"
  ],
  [
    "M6 Competition",
    "F12",
    "https://www.motorlegend.com/images-voiture/large/bmw-m6-f12-cabriolet-v8-132487.jpg"
  ],
  [
    "M6 Competition",
    "F13",
    "https://www.supersprint.com/public/img/BMW%20F12%20M6%20Coup%C3%A8%20-%20%20F13%20M6%20Cabrio%20V8%20(560%20Hp)%202012%20-%202018-398663.jpg"
  ],
  [
    "M6 Competition",
    "F06",
    "https://luxeautomotive.com/wp-content/uploads/2022/01/POP08713-scaled-1.jpg"
  ],
  [
    "750i",
    "E32",
    "https://www.bmwgroup-classic.com/content/dam/grpw/websites/bmwgroup-classic_com/productcatalog2/images_pc/AF-12829-1.png/jcr:content/renditions/original"
  ],
  [
    "750i",
    "E38",
    "https://images.caradisiac.com/logos/1/4/4/2/291442/S0-bmw-750i-e38-le-vaisseau-amiral-de-munich-qui-reste-abordable-218808.jpg"
  ],
  [
    "750i",
    "E65",
    "https://cache.motorsdb.com/resize/1600x1067/archives/2019/08/05/BMW-750i-E65-2005-2008-10175.jpg?mtime=1662325512"
  ],
  [
    "750i",
    "F01",
    "https://www.mosselmanturbo.com/uploads/cars/detail_default/1200x675/bmw-750i-f01-449hp.jpeg"
  ],
  [
    "750i",
    "G11",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-7-g11/S8-modele--bmw-serie-7-g11.jpg"
  ],
  [
    "750d",
    "E32",
    "https://www.bmwgroup-classic.com/content/dam/grpw/websites/bmwgroup-classic_com/productcatalog2/images_pc/AF-12829-1.png/jcr:content/renditions/original"
  ],
  [
    "750d",
    "E38",
    "https://images.caradisiac.com/logos/1/4/4/2/291442/S0-bmw-750i-e38-le-vaisseau-amiral-de-munich-qui-reste-abordable-218808.jpg"
  ],
  [
    "750d",
    "E65",
    "https://cache.motorsdb.com/resize/1600x1067/archives/2019/08/05/BMW-750i-E65-2005-2008-10175.jpg?mtime=1662325512"
  ],
  [
    "750d",
    "F01",
    "https://www.mosselmanturbo.com/uploads/cars/detail_default/1200x675/bmw-750i-f01-449hp.jpeg"
  ],
  [
    "750d",
    "G11",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-7-g11/S8-modele--bmw-serie-7-g11.jpg"
  ],
  [
    "760i",
    "E65",
    "https://images.caradisiac.com/images/8/1/3/8/208138/S1-208138-796779.jpg"
  ],
  [
    "760i",
    "F01",
    "https://cdn3.focus.bg/autodata/i/bmw/7er/7er-f01/large/231dc574d77a8ce026e3ba414a14e321.jpg"
  ],
  [
    "760i",
    "G11",
    "https://upload.wikimedia.org/wikipedia/commons/f/f0/BMW_G11_IMG_2002.jpg?utm_source=fr.wikipedia.org&utm_campaign=index&utm_content=original"
  ],
  [
    "760i",
    "G70",
    "https://www.mad4wheels.com/img/free-car-images/mobile/19971/bmw-760i-g70-xdrive-usa-version-2023-695127.jpg"
  ],
  [
    "M760Li",
    "G12",
    "https://mediapool.bmwgroup.com/cache/P9/201701/P90246740/P90246740-bmw-m760li-xdrive-onlocation-scenic-drive-02-2017-2250px.jpg"
  ],
  [
    "M760Li",
    "G70",
    "https://seo-cms.autoscout24.ch/wp-content/uploads/2025/02/617301B-1024x683.jpg"
  ],
  [
    "M8",
    "F91",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQRzJpaI_EFrMO9d_uPnl8B8cvOhTwWgtbEiRjQJ3hmulFvYaNYYv3_PY&s=10"
  ],
  [
    "M8",
    "F92",
    "https://www.automoli.com/common/vehicles/_assets/img/gallery/f64/bmw-m8-coupe-f92-facelift-2022.webp"
  ],
  [
    "M8",
    "F93",
    "https://auto.cdn-rivamedia.com/2414/137946224-ibig.jpg"
  ],
  [
    "M8 Competition",
    "F91",
    "https://www.dealndrive.com/Content/images/upload/81505-full.jpg"
  ],
  [
    "M8 Competition",
    "F92",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-8-f92-m8/S8-modele--bmw-serie-8-f92-m8.jpg"
  ],
  [
    "M8 Competition",
    "F93",
    "https://www.supersprint.com/public/img/1-537922.jpg"
  ],
  [
    "X3 M50",
    "G45",
    "https://www.daehler-tuning.com/wp-content/uploads/2026/01/BMW-X3-G45-by-dAHLer-1-1-scaled.jpg"
  ],
  [
    "X3 M",
    "F97",
    "https://cdn.motor1.com/images/mgl/zM828/s1/bmw-x3-m.jpg"
  ],
  [
    "X3 M Competition",
    "F97",
    "https://www.auto-data.net/images/f109/BMW-X3-M-F97-LCI-facelift-2021.jpg"
  ],
  [
    "X5 M60i",
    "G05 LCI",
    "https://i.gaw.to/vehicles/photos/40/33/403362-2024-bmw-x5.jpg?1024x640"
  ],
  [
    "X5 M",
    "E70",
    "https://www.forumbmw.net/img/members/3/BMW-X5-M-E70-1.jpg"
  ],
  [
    "X5 M",
    "F15",
    "https://www.forumbmw.net/img/members/3/BMW-X5-M-F85-3.jpeg"
  ],
  [
    "X5 M",
    "F95",
    "https://www.auto-data.net/images/f129/BMW-X5-M-G05.jpg"
  ],
  [
    "X5 M Competition",
    "F95",
    "https://www.latribuneauto.com/media/cache/resolve/article/reportages/salon/2023/2023-02-24-La-bmw-x5-m-competition-embarque-un-moteur-v8-a-technologie-48v-de-625-ch/02%20BMW%20X5%20M%20Competition%202023%20Exterieur%2034%20Arriere.jpg"
  ],
  [
    "X6 M60i",
    "G06 LCI",
    "https://cdn.bmwblog.com/wp-content/uploads/2024/02/2024-bmw-x6-m60i-review-27.jpg"
  ],
  [
    "X6 M",
    "E71",
    "https://benzin.fra1.digitaloceanspaces.com/lead/original/img_68cd1f84a6d7b.jpg"
  ],
  [
    "X6 M",
    "F16",
    "https://www.forumbmw.net/img/members/3/Fiche-occasion--guide-d-achat-BMW-X6-M-F16-F86-8.jpg"
  ],
  [
    "X6 M",
    "F96",
    "https://www.auto-data.net/images/f123/BMW-X6-M-F96-LCI-facelift-2023.jpg"
  ],
  [
    "X6 M Competition",
    "F96",
    "https://www.supersprint.com/public/img/BMW_F96_X6_M_Competition_LCI_X-rive_44i_V8_S63M_-_625_Hp_-_Modelli_con_OPF_2023_web-567704.jpg"
  ],
  [
    "X7 M60i",
    "G07 LCI",
    "https://mediapool.bmwgroup.com/cache/P9/202204/P90457447/P90457447-the-new-bmw-x7-m60i-xdrive-04-2022-2249px.jpg"
  ],
  [
    "X7 M70",
    "G07 LCI",
    "https://mediapool.bmwgroup.com/cache/P9/202204/P90457426/P90457426-the-new-bmw-x7-m60i-xdrive-04-2022-600px.jpg"
  ],
  [
    "Z1",
    "E30 Z1",
    "https://images.caradisiac.com/logos/8/6/5/9/288659/S0-bmw-z1-une-simple-histoire-de-portieres-215666.jpg"
  ],
  [
    "Z3 Roadster",
    "E36/7",
    "https://upload.wikimedia.org/wikipedia/commons/2/2e/BMW_Z3_1.9L_1998.jpg?utm_source=fr.wikipedia.org&utm_campaign=index&utm_content=original"
  ],
  [
    "Z3 Coupé",
    "E36/8",
    "https://www.bmwgroup-classic.com/content/dam/grpw/websites/bmwgroup-classic_com/productcatalog2/images_pc/AF-22742-1.png/jcr:content/renditions/original"
  ],
  [
    "Z3 M Roadster",
    "E36/7",
    "https://cdn3.focus.bg/autodata/i/bmw/z3/z3-m-e367/large/94222a9fd8476503ebbc43c132094d68.jpg"
  ],
  [
    "Z3 M Coupé",
    "E36/8",
    "https://public.carjager.com/production/cms/wallpaperflare_com_wallpaper_6_1_a4ac52cf49.jpg"
  ],
  [
    "Z4",
    "E85",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOv8_c6ZU7xxwFpmFDf5lJvE4oR6RR1e_8Z66TjTd__g&s=10"
  ],
  [
    "Z4",
    "E89",
    "https://www.wintonsworld.com/wp-content/uploads/2013/08/BMW_Z4_Sdrive18i_6.jpg"
  ],
  [
    "Z4 sDrive20i",
    "G29",
    "https://bmw.scene7.com/is/image/BMW/g29-roadster_mp_final-edition_highlight_front:3to2?fmt=webp&wid=1493&fit=wrap%2C+1"
  ],
  [
    "Z4 M40i",
    "G29",
    "https://bmw.scene7.com/is/image/BMW/g29-roadster_mp_final-edition_highlight_front:3to2?fmt=webp&wid=1493&fit=wrap%2C+1"
  ],
  [
    "Z4 M Roadster",
    "E85",
    "https://images.caradisiac.com/images/0/8/4/6/210846/S1-210846-813799.jpg"
  ],
  [
    "Z4 M Coupé",
    "E86",
    "https://images.caradisiac.com/logos-ref/modele/modele--bmw-z4-e86-coupe-m/S0-modele--bmw-z4-e86-coupe-m.jpg"
  ]
] as const;

const generationYears: Record<string, number> = {
  E24: 1976, E26: 1978, E28: 1984, E30: 1986, E32: 1986, E34: 1988,
  E36: 1990, "E36/7": 1995, "E36/8": 1998, E38: 1994, E39: 1995,
  E46: 1998, E60: 2003, E63: 2003, E64: 2004, E65: 2001, E70: 2006,
  E71: 2008, E82: 2007, E85: 2002, E86: 2006, E89: 2009, E90: 2005,
  E91: 2005, E92: 2006, E93: 2007, F01: 2008, F06: 2012, F10: 2010,
  F11: 2010, F12: 2011, F13: 2011, F15: 2013, F16: 2014, F20: 2011,
  F22: 2013, F30: 2012, F31: 2012, F32: 2013, F33: 2014, F36: 2014,
  F40: 2019, F44: 2019, F80: 2014, F82: 2014, F87: 2015, F90: 2017,
  F91: 2018, F92: 2018, F93: 2018, F95: 2019, F96: 2019, F97: 2019,
  G05: 2018, G06: 2019, G07: 2018, G11: 2015, G12: 2015, G20: 2019,
  G21: 2019, G22: 2020, G23: 2020, G26: 2021, G29: 2018, G30: 2017,
  G31: 2017, G32: 2017, G42: 2021, G45: 2024, G60: 2023, G61: 2024,
  G70: 2022, G80: 2020, G81: 2022, G82: 2020, G83: 2021, G87: 2022,
  G90: 2024,
};

const legacyManualGenerations = new Set([
  "E24", "E26", "E28", "E30", "E34", "E36", "E36/7", "E36/8", "E39",
  "E46", "E63", "E64", "E82", "E85", "E86", "E89",
]);

const preservedIds: Record<string, string> = {
  "M1|E26": "bmw-m1-e26",
  "M2|F87": "m2-f87",
  "M3|E46": "m3-e46",
  "M4|G82": "bmw-m4-g82",
  "M5|F90": "bmw-m5-f90",
  "Z1|E30 Z1": "bmw-z1",
  "Z3 Roadster|E36/7": "bmw-z3",
  "Z4 sDrive20i|G29": "bmw-z4-g29",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const bmwCatalogEntries: BmwCatalogEntry[] = sourceRows.map(([model, generation, image]) => {
  const key = `${model}|${generation}`;
  const baseGeneration = generation.split(" ")[0];

  return {
    id: preservedIds[key] ?? `bmw-${slugify(model)}-${slugify(generation)}`,
    model,
    generation,
    image,
    year: generationYears[generation] ?? generationYears[baseGeneration] ?? 2024,
    transmission: legacyManualGenerations.has(baseGeneration) ? "Manual" : "Automatic",
    tags: ["BMW", "Catalog", "Generation"],
  };
});

export const bmwCatalogImageById = Object.fromEntries(
  bmwCatalogEntries.map((car) => [car.id, car.image]),
);
