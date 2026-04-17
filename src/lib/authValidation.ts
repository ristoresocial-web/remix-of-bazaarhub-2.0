import { z } from "zod";

export const emailSchema = z.string().trim().email("Please enter a valid email");
export const mobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

export const pinSchema = z.string().trim().regex(/^\d{6}$/, "PIN must be 6 digits");

export const gstRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const msmeRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or mobile is required")
    .max(255),
  password: z.string().min(1, "Password is required"),
});

export const buyerRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: emailSchema.max(255),
  mobile: mobileSchema,
  password: passwordSchema,
  city: z.string().trim().min(2, "City is required").max(100),
});

export const sellerRegisterSchema = z
  .object({
    business_owner_name: z
      .string()
      .trim()
      .min(2, "Owner name is required")
      .max(100),
    email: emailSchema.max(255),
    mobile: mobileSchema,
    password: passwordSchema,
    gst_number: z
      .string()
      .trim()
      .toUpperCase()
      .optional()
      .or(z.literal("")),
    pan_number: z
      .string()
      .trim()
      .toUpperCase()
      .optional()
      .or(z.literal("")),
    msme_number: z
      .string()
      .trim()
      .toUpperCase()
      .optional()
      .or(z.literal("")),
    business_address: z
      .string()
      .trim()
      .min(10, "Please enter a complete business address")
      .max(500),
    pin_code: pinSchema,
    shop_category: z.string().trim().min(1, "Please pick a shop category"),
  })
  .superRefine((data, ctx) => {
    const gst = (data.gst_number || "").trim();
    const pan = (data.pan_number || "").trim();
    const msme = (data.msme_number || "").trim();

    if (!gst && !pan && !msme) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least one of GST, PAN, or MSME",
        path: ["gst_number"],
      });
      return;
    }

    if (gst && !gstRegex.test(gst)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid GST format (e.g., 22AAAAA0000A1Z5)",
        path: ["gst_number"],
      });
    }
    if (pan && !panRegex.test(pan)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid PAN format (e.g., ABCDE1234F)",
        path: ["pan_number"],
      });
    }
    if (msme && !msmeRegex.test(msme)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid MSME / Udyam format (e.g., UDYAM-TN-12-1234567)",
        path: ["msme_number"],
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type BuyerRegisterInput = z.infer<typeof buyerRegisterSchema>;
export type SellerRegisterInput = z.infer<typeof sellerRegisterSchema>;

export const SHOP_CATEGORIES = [
  "Electronics",
  "Mobiles & Tablets",
  "Grocery",
  "Fashion & Apparel",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Books & Stationery",
  "Sports & Fitness",
  "Toys & Baby",
  "Automotive",
  "Jewellery",
  "Furniture",
  "Pharmacy & Health",
  "Other",
];
