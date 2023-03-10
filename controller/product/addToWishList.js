import Product from '../../models/productModel.js';
import asyncHandler from 'express-async-handler';
import { User } from '../../models/userModel.js';

const addToWishList = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select(['-password']);
		const product = await Product.findById(req.params.id);

		if (!user) {
			return res.status(400).send('User does not exist');
		}

		if (!product) {
			return res.status(400).send('product does not exist');
		}

		console.log(req.user._id);
		console.log(user.wishlist);
		const alreadyAdded = user.wishlist.find(
			r => r.toString() === req.params.id.toString()
		);

		console.log(alreadyAdded);

		if (alreadyAdded) {
			console.log('Item Already in wishlist');
			return res.status(400).send('Item Already added to wishlist');
		} else {
			user.wishlist.push(req.params.id);
			const saveUser = await user.save();
			product.wishlisted = product.wishlisted + 1;
			const saveProd = await product.save();
			res.status(200).json({ success: true, wishlist: saveUser.wishlist });
		}
	} catch (e) {
		res.status(500).send('Error updating wishlist');
	}
});

export default addToWishList;
