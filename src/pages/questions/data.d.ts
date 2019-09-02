export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface ListItemDataType {
  questionCreateTime: string;
  questionDetail: string;
  questionGrade: number;
  questionId: string | number;
  questionPic: string;
  questionType: number;
  questionUserId: string | number;
  deleted: boolean;
}

export interface ListDataType {
  list: ListItemDataType[],
  pagination: pageination
}
export interface pageination {
  current: number;
  pageSize: number;
  total: number;
  onChange?: any;
  defaultCurrent?: number;
}

export interface onChange {
  (page: number, pageSize: number): void;
}

