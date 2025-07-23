// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: true, ref: "user" },
//     items: [
//       {
//         product: { type: String, required: true, ref: "product" },
//         quantity: { type: Number, required: true },
//       },
//     ],
//     amount: { type: Number, required: true },
//     address: { type: String, required: true, ref: "address" },
//     status: { type: String, default: "Order Placed" },
//     paymentOption: { type: String, required: true },
//     isPaid: { type: Boolean, required: true, default: false },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.models.order || mongoose.model("order", orderSchema);

// export default Order;


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "address" },
    status: { type: String, default: "Order Placed" },
    paymentOption: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Correct model registration
const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
