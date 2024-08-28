export interface Message {
  text: string;
  sender?: UserId;
}

export type UserId = number;
