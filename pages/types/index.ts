export interface Message {
  text: string;
  sender: UserId; // sender가 Date 타입인 경우
}

export type UserId = Date;
