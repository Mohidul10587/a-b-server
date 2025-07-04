import { Schema, model, Document } from "mongoose";

interface ISettings extends Document {
  logo: string;
  favicon: string;
  loto: string;
  fbImage: string;
  bgColor: string;
  websiteTitle: string;
  websiteBgColor: string;
  copyright: string;
  country: string;
  currencySymbol: string;
  priceZero: string;
  highlights: string;
  shippingInside: number;
  shippingOutside: number;
  deliveryMethod1: string;
  deliveryTime1: string;
  deliveryMethod2: string;
  deliveryTime2: string;
  payment: string;
  paymentText1: string;
  paymentText2: string;
  officeAddress: string;
  whatsapp: string;
  telegram: string;
  note: string;
  order: string;
  orderText: string;
  metaDescription: string;
  description: string; // Added field
  privacyPolicies: string;
  termsAndConditions: string; // Added field
  otherPolicies: string; // Added field
  sellerDefaultStatus: boolean;
  keywords: string[];
  phone: string;
}

const settingsSchema = new Schema({
  logo: String,
  favicon: String,
  loto: String,
  fbImage: String,
  bgColor: String,
  websiteTitle: String,
  websiteBgColor: String,
  copyright: String,
  country: String,
  currencySymbol: String,
  priceZero: String,
  highlights: String,
  shippingInside: String,
  shippingOutside: String,
  deliveryMethod1: String,
  deliveryTime1: String,
  deliveryMethod2: String,
  deliveryTime2: String,
  payment: String,
  paymentText1: String,
  paymentText2: String,
  officeAddress: String,
  whatsapp: String,
  telegram: String,
  note: String,
  order: String,
  orderText: String,
  metaDescription: String,
  description: String,
  privacyPolicies: String,
  termsAndConditions: String,
  otherPolicies: String,
  sellerDefaultStatus: Boolean,
  keywords: {
    type: [String],
    default: [],
  },
  phone: String,
});

const Settings = model<ISettings>("Settings", settingsSchema);

export default Settings;
