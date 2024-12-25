export interface User {
  id?: number;
  email: string;
  nickname: string;
  avatar_url: string;
  created_at?: string;
  credits?: UserCredits;
}

export interface UserCredits {
  one_time_credits: number; //一次性充值的积分有多少
  monthly_credits: number; //月充值的积分有多少
  total_credits: number; //总共的积分有多少
  used_credits: number; //已经使用的积分有多少
  left_credits: number; //剩余的积分有多少
}
