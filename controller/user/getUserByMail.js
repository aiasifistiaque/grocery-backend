import asyncHandler from 'express-async-handler';
import Order from '../../models/orderModel.js';
import { User } from '../../models/userModel.js';

const getUserByMail = asyncHandler(async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email }).select([
			'-password',
		]);
		const orders = await Order.find({ user: user._id });
		res.status(200).json({ user: user, orders: orders });
	} catch (e) {
		res.status(500).json({ msg: e.message });
	}
});

export default getUserByMail;
