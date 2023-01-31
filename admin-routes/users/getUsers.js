import { User } from '../../models/userModel.js';

const getUsers = async (req, res) => {
	const { sort, page, perpage, skip } = req.meta;

	try {
		const data = await User.find()
			.sort(sort)
			.limit(perpage)
			.skip(skip)
			.select('-password');
		const count = await User.count();

		req.meta.docsInPage = data.length;
		req.meta.totalDocs = count;
		req.meta.totalPages = Math.ceil(count / perpage);

		return res.status(200).json({ ...req.meta, doc: data });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

export default getUsers;
