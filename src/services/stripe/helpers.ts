import { CourseTable } from "@/db/schema";
import { stripe } from "./stripe";
import { generateImageUrl } from "@/lib/utils";

export const createCourseProduct = async (
  course: Omit<typeof CourseTable.$inferInsert, "stripePriceId">,
) => {
  try {
    const response = await stripe.products.create({
      name: course.title,
      description: course.smallDescription,
      images: [generateImageUrl(course.thumbnailKey)],
      active: true,
      default_price_data: {
        currency: "usd",
        unit_amount: course.price * 100,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
