import asyncHandler from 'express-async-handler';
import Order from '../../models/orderModel.js';
import Product from '../../models/productModel.js';

const addNewOrder = asyncHandler(async (req, res) => {
	const { orderItems } = req.body;

	if (orderItems && orderItems.length === 0) {
		return res.status(400).json('no order items');
	}

	try {
		const count = await Order.count();
		const orderId = String(count).padStart(5, '0');

		const order = await Order({
			orderItems: req.body.orderItems,
			user: req.user._id,
			shippingAddress: req.body.shippingAddress,
			paymentMethod: req.body.paymentMethod,
			itemsPrice: req.body.itemsPrice,
			vat: req.body.vat,
			shippingPrice: req.body.shippingPrice,
			totalPrice: req.body.totalPrice,
			orderId: orderId,
		});

		orderItems.map(async item => {
			try {
				const prod = await Product.findById(item._id);
				prod.countInStock = prod.countInStock - item.qty;
				prod.totalSold = prod.totalSold + item.qty;
				await prod.save();
			} catch (e) {
				console.log(e);
			}
		});

		const saved = await order.save();
		const findOrder = await Order.findById(saved._id).populate(
			'user',
			'id name email'
		);
		//sendMail(findOrder);
		//sendMailToCustomer(findOrder);
		//sconsole.log(findOrder);
		return res.status(201).json(saved);
	} catch (e) {
		console.log(e.message);
		return res.status(500).json({ msg: e.message, message: e.message });
	}
});

export default addNewOrder;
