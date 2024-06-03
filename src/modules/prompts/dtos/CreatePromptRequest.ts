import * as yup from 'yup';

export interface CreatePromptRequest {
	prompt: string;
}

export const CreatePromptRequestSchema = yup
	.object()
	.shape({
		prompt: yup.string().required().min(10),
	})
	.noUnknown();
