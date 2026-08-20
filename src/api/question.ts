import { api } from '../utils/request'
import type { QuestionListResponse } from './types'

export const getQuestions = async (categoryId: number, page: number = 1, perPage: number = 20): Promise<QuestionListResponse> => {
  return await api.get<QuestionListResponse>(`/questions?category_id=${categoryId}&page=${page}&per_page=${perPage}`)
}

export const toggleFavorite = async (questionId: number): Promise<any> => {
  return await api.post(`/question/${questionId}/toggle_favorite`)
}

export const toggleWrongBook = async (questionId: number): Promise<any> => {
  return await api.post(`/question/${questionId}/toggle_wrong_book`)
}

export const toggleMastered = async (questionId: number): Promise<any> => {
  return await api.post(`/question/${questionId}/toggle_mastered`)
}

export const saveQuestionNote = async (questionId: number, note: string): Promise<{ message: string }> => {
  return await api.post(`/question/${questionId}/note`, { note })
}

export const submitQuestionFeedback = async (questionId: number, type: string, content: string): Promise<{ message: string }> => {
  return await api.post(`/question/${questionId}/feedback`, { type, content })
}

export const getWrongQuestions = async (perPage: number = 10000): Promise<QuestionListResponse> => {
  return await api.get<QuestionListResponse>(`/user/wrong_book?per_page=${perPage}`)
}

export const getFavoriteQuestions = async (perPage: number = 10000): Promise<QuestionListResponse> => {
  return await api.get<QuestionListResponse>(`/user/favorites?per_page=${perPage}`)
}
