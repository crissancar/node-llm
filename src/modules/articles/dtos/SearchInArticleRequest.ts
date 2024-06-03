import * as yup from 'yup';

export const SearchInArticleRequest = yup
	.object()
	.shape({
		search: yup.string().required().min(10),
	})
	.noUnknown();
