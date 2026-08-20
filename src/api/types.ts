export interface User {
  id: number;
  username: string;
  nickname: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  path: string;
  depth: number;
  display_order: number;
  question_count: number;
  completed_count: number;
  total_question_count: number;
  total_completed_count: number;
  children: Category[];
}

export interface UserQuestionState {
  is_favorite: boolean;
  is_wrong_book: boolean;
  is_mastered: boolean;
  note: string;
}

export interface Question {
  id: number;
  category_id: number;
  serial_number: number;
  题号: number;
  题目内容: string;
  选项A: string;
  选项B: string;
  选项C: string;
  选项D: string;
  答案: string;
  解析: string;
  题源: string;
  是否选做: string;
  时间戳: string | null;
  video_url: string | null;
  user_state: UserQuestionState;
}

export interface QuestionListResponse {
  items: Question[];
  total: number;
  pages: number;
  current_page: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: number;
}
export interface Notification {
  id: string;
  db_id: number;
  type: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  created_by: string;
}
