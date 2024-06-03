import * as yup from 'yup';

export interface FindPromptRequest {
	prompt: string;
}

export const FindPromptRequestSchema = yup
	.object()
	.shape({
		prompt: yup.string().required().min(10),
	})
	.noUnknown();
