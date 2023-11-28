// react
import React, { useEffect } from "react";

// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import type { InferGetStaticPropsType } from "next";

// mongoose models
import dbConnect from "lib/dbConnect";
import HomeSlider from "models/HomeSlider";
import CategoriesModal from "models/SubCategories";
import Products from "models/Products";
import Notifications from "models/UserNotifications";
import HomeBanners from "models/HomeBanners";
import HomeBrands from "models/Brands";

// redux
import { useDispatch } from "react-redux";
import { setCategories } from "src/redux/slices/categories";
import { setNotifications } from "src/redux/slices/notification";

// material
import { Container } from "@mui/material/";

// skeletons
import HeroCarouselSkeleton from "src/components/skeletons/home/heroCarousel";
import BannersSkeleton from "src/components/skeletons/home/bannersSkeleton";

// plaiceholder
import { getPlaiceholder } from "plaiceholder";

// dynamic import
const HeroCarousel = dynamic(
  () => import("src/components/carousels/heroCarousel/heroCarousel"),
  {
    loading: () => <HeroCarouselSkeleton />,
  }
);
const Banners = dynamic(() => import("src/components/_main/home/banners"), {
  loading: () => <BannersSkeleton />,
});
const Categories = dynamic(
  () => import("src/components/_main/home/categories")
);
const TopCollections = dynamic(
  () => import("src/components/_main/home/topCollections")
);
const CenteredBanner = dynamic(
  () => import("src/components/_main/home/centeredBanner")
);
const FeaturedProducts = dynamic(
  () => import("src/components/_main/home/featured")
);
const WhyUs = dynamic(() => import("src/components/_main/home/whyUs"));
const Brands = dynamic(() => import("src/components/_main/home/brands"));

export const getStaticProps = async () => {
  await dbConnect();
  const slides = await HomeSlider.find();
  const categories = await CategoriesModal.find({});
  const homeBanners = await HomeBanners.find({});
  const uniqueIds: string[] = [];

  const unique = categories.filter((element) => {
    const isDuplicate = uniqueIds.includes(element.parentCategory);

    if (!isDuplicate) {
      uniqueIds.push(element.parentCategory);
      return true;
    }

    return false;
  });

  const filtered = unique?.map((key) => {
    return categories?.filter((v) => v.parentCategory === key.parentCategory);
  });

  const products = await Products.find(
    {
      isFeatured: true,
    },
    null,
    {
      limit: 12,
    }
  );

  const topBrands = await HomeBrands.find({
    limit: 12,
  });

  const top = await Products.find({}, null, {
    limit: 8,
  }).sort({
    totalRating: -1,
  });

  const notifications = await Notifications.find({}, null, {}).sort({
    createdAt: -1,
  });

  const { base64: blurDataURL1, img: img1 } =
    homeBanners.length === 0
      ? {
          base64: "",
          img: {},
        }
      : await getPlaiceholder(homeBanners[0]?.bannerAfterSlider1.cover.url);
  const { base64: blurDataURL2, img: img2 } =
    homeBanners.length === 0
      ? {
          base64: "",
          img: {},
        }
      : await getPlaiceholder(homeBanners[0]?.bannerAfterSlider2.cover.url);
  const { base64: blurDataURL3, img: img3 } =
    homeBanners.length === 0
      ? {
          base64: "",
          img: {},
        }
      : await getPlaiceholder(homeBanners[0]?.bannerAfterSlider3.cover.url);
  const { base64: blurDataURL4, img: img4 } =
    homeBanners.length === 0
      ? {
          base64: "",
          img: {},
        }
      : await getPlaiceholder(homeBanners[0]?.centeredBanner.cover.url);

  const homeBannersData = {
    bannerAfterSlider1: {
      ...homeBanners[0]?.bannerAfterSlider1,
      cover: { ...img1, blurDataURL: blurDataURL1 },
    },
    bannerAfterSlider2: {
      ...homeBanners[0]?.bannerAfterSlider2,
      cover: { ...img2, blurDataURL: blurDataURL2 },
    },
    bannerAfterSlider3: {
      ...homeBanners[0]?.bannerAfterSlider3,
      cover: { ...img3, blurDataURL: blurDataURL3 },
    },
    centeredBanner: {
      ...homeBanners[0]?.centeredBanner,
      cover: { ...img4, blurDataURL: blurDataURL4 },
    },
  };

  const topProducts = await Promise.all(
    top.map(async (item) => {
      const {
        base64,
        img: { width, height, ...img },
      } = await getPlaiceholder(item.cover);

      return {
        ...item._doc,
        cover: {
          ...img,
          blurDataURL: base64,
        },
      };
    })
  ).then((values) => values);

  const slidesData = await Promise.all(
    slides.map(async (item) => {
      const {
        base64,
        img: { width, height, ...img },
      } = await getPlaiceholder(item.cover.url);

      return {
        ...item._doc,
        cover: {
          ...img,
          blurDataURL: base64,
        },
      };
    })
  ).then((values) => values);

  const featuredProducts: any = await Promise.all(
    products.map(async (item) => {
      const {
        base64,
        img: { width, height, ...img },
      } = await getPlaiceholder(item.cover);

      return {
        ...item._doc,
        cover: {
          ...img,
          blurDataURL: base64,
        },
      };
    })
  ).then((values) => values);

  return {
    props: {
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      slidesData: JSON.parse(JSON.stringify(slidesData)),
      topProducts: JSON.parse(JSON.stringify(topProducts)),
      notifications: JSON.parse(JSON.stringify(notifications)),
      homeBanners: JSON.parse(
        JSON.stringify(homeBanners.length > 0 ? homeBannersData : null)
      ),
      categories: JSON.parse(JSON.stringify(filtered)),
      topBrands: JSON.parse(JSON.stringify(topBrands)),
    },
    revalidate: 60,
  };
};

export default function Home({
  featuredProducts,
  slidesData,
  topProducts,
  notifications,
  homeBanners,
  categories,
  topBrands,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("home");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCategories(categories));
    dispatch(setNotifications(notifications));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <HeroCarousel isLoading={!slidesData} data={slidesData} />
      <Banners data={homeBanners} />
      <Container>
        <Categories categories={categories} t={t} />
        <TopCollections data={topProducts} t={t} />
        <CenteredBanner data={homeBanners} />
        <FeaturedProducts data={featuredProducts} t={t} />
        <Brands data={topBrands} />
        {/* 
          dt.20-jun-23 commented because not required
          <WhyUs />
          */}
      </Container>
    </>
  );
}
